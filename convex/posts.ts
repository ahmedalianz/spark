import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";
import {
  extractHashtags,
  extractMentions,
  getMediaUrls,
  getUserWithImage,
} from "./utils";

export const createPost = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    type: v.optional(v.union(v.literal("post"), v.literal("repost"))),
    originalPostId: v.optional(v.id("posts")),
    visibility: v.optional(
      v.union(v.literal("public"), v.literal("followers"))
    ),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    // Extract mentions and hashtags
    const mentions = extractMentions(args.content);
    const tags = extractHashtags(args.content);

    const postId = await ctx.db.insert("posts", {
      authorId: user._id,
      content: args.content,
      mediaFiles: args.mediaFiles || [],
      type: args.type || "post",
      originalPostId: args.originalPostId,
      likeCount: 0,
      repostCount: 0,
      commentCount: 0,
      visibility: args.visibility || "public",
      tags,
      mentions,
      createdAt: args.scheduledAt || now,
      scheduledAt: args.scheduledAt,
    });

    // Update user's post count
    await ctx.db.patch(user._id, {
      postsCount: (user.postsCount || 0) + 1,
      updatedAt: now,
    });

    // Send notifications for mentions
    if (mentions.length > 0) {
      await Promise.all(
        mentions.map(async (mentionedUserId) => {
          if (mentionedUserId !== user._id) {
            // Check mentioned user's notification settings
            const mentionedUserSettings = await ctx.db
              .query("userSettings")
              .withIndex("byUserId", (q) => q.eq("userId", mentionedUserId))
              .first();

            const shouldNotifyMention =
              !mentionedUserSettings?.notifications?.push?.mentions;

            if (shouldNotifyMention) {
              await ctx.db.insert("notifications", {
                userId: mentionedUserId,
                authorId: user._id,
                type: "mention",
                postId,
                message: `${user.first_name} mentioned you in a post: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
                isRead: false,
                createdAt: now,
              });
            }
          }
        })
      );
    }
    if (args.type === "repost" && args.originalPostId) {
      const originalPost = await ctx.db.get(args.originalPostId);
      if (originalPost && originalPost.authorId !== user._id) {
        const originalAuthorSettings = await ctx.db
          .query("userSettings")
          .withIndex("byUserId", (q) => q.eq("userId", originalPost.authorId))
          .first();

        const shouldNotifyRepost =
          !originalAuthorSettings?.notifications?.push?.reposts;

        if (shouldNotifyRepost) {
          await ctx.db.insert("notifications", {
            userId: originalPost.authorId,
            authorId: user._id,
            type: "repost",
            postId,
            originalPostId: args.originalPostId,
            message: `${user.first_name} quoted your post`,
            isRead: false,
            createdAt: now,
          });
        }
      }
    }
    return postId;
  },
});

export const getFeedPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    filter: v.optional(v.union(v.literal("following"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    let query = ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("visibility"), "public"));

    if (args.filter === "following" && user) {
      // Get following list
      const following = await ctx.db
        .query("follows")
        .withIndex("byFollower", (q) => q.eq("followerId", user._id))
        .collect();

      const followingIds = following.map((f) => f.followingId);

      query = query.filter((q) =>
        followingIds.some((id) => q.eq(q.field("authorId"), id))
      );
    }

    const posts = await query.order("desc").paginate(args.paginationOpts);

    const postsWithDetails = await Promise.all(
      posts.page.map(async (post) => await getPostWithDetails(ctx, post, user))
    );

    return {
      ...posts,
      page: postsWithDetails,
    };
  },
});

export const getUserPosts = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
    type: v.optional(
      v.union(
        v.literal("posts"),
        v.literal("reposts"),
        v.literal("tagged"),
        v.literal("all")
      )
    ),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    let posts;

    if (args.type === "posts") {
      // Get original posts only (not reposts)
      const query = ctx.db
        .query("posts")
        .withIndex("byAuthor", (q) => q.eq("authorId", args.userId))
        .filter((q) => q.eq(q.field("type"), "post"));

      posts = await query.order("desc").paginate(args.paginationOpts);
    } else if (args.type === "reposts") {
      // Get reposts from the posts table
      const query = ctx.db
        .query("posts")
        .withIndex("byAuthor", (q) => q.eq("authorId", args.userId))
        .filter((q) => q.eq(q.field("type"), "repost"));

      posts = await query.order("desc").paginate(args.paginationOpts);
    } else if (args.type === "tagged") {
      // Get posts where user is mentioned
      const query = ctx.db
        .query("posts")
        .withIndex("byVisibility", (q) => q.eq("visibility", "public"));

      const allPosts = await query.collect();
      const taggedPosts = allPosts.filter((post) =>
        post.mentions?.includes(args.userId)
      );

      // Sort by creation date and paginate manually
      taggedPosts.sort((a, b) => b.createdAt - a.createdAt);

      const startIndex = args.paginationOpts.cursor
        ? parseInt(args.paginationOpts.cursor)
        : 0;
      const endIndex = startIndex + args.paginationOpts.numItems;
      const paginatedTagged = taggedPosts.slice(startIndex, endIndex);

      posts = {
        page: paginatedTagged,
        isDone: endIndex >= taggedPosts.length,
        continueCursor:
          endIndex < taggedPosts.length ? endIndex.toString() : null,
      };
    } else {
      // Get all posts (original + reposts)
      const query = ctx.db
        .query("posts")
        .withIndex("byAuthor", (q) => q.eq("authorId", args.userId));

      posts = await query.order("desc").paginate(args.paginationOpts);
    }

    const postsWithDetails = await Promise.all(
      posts.page.map(
        async (post) => await getPostWithDetails(ctx, post, currentUser)
      )
    );

    return {
      ...posts,
      page: postsWithDetails,
    };
  },
});
export const searchPosts = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
    filters: v.optional(
      v.object({
        authorId: v.optional(v.id("users")),
        type: v.optional(
          v.union(v.literal("post"), v.literal("repost"), v.literal("tagged"))
        ),
        visibility: v.optional(
          v.union(v.literal("public"), v.literal("followers"))
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Use the search index to find posts matching the query
    const results = await ctx.db
      .query("posts")
      .withSearchIndex("searchPosts", (q) => {
        let searchQuery = q.search("content", args.query);

        // Apply filters if provided
        if (args.filters?.authorId) {
          searchQuery = searchQuery.eq("authorId", args.filters.authorId);
        }
        if (args.filters?.type) {
          searchQuery = searchQuery.eq("type", args.filters.type);
        }
        if (args.filters?.visibility) {
          searchQuery = searchQuery.eq("visibility", args.filters.visibility);
        } else {
          // Default to public posts only if no visibility filter
          searchQuery = searchQuery.eq("visibility", "public");
        }

        return searchQuery;
      })
      .order("desc")
      .paginate(args.paginationOpts);

    // Enrich posts with author and media details
    const postsWithDetails = await Promise.all(
      results.page.map(async (post) => {
        const [author, mediaUrls, userLike] = await Promise.all([
          getUserWithImage(ctx, post.authorId),
          getMediaUrls(ctx, post.mediaFiles),
          user ? getUserLikeStatus(ctx, user._id, post._id) : false,
        ]);

        return {
          ...post,
          author,
          mediaFiles: mediaUrls,
          userHasLiked: userLike,
        };
      })
    );

    return {
      ...results,
      page: postsWithDetails,
    };
  },
});
export const likePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("byUserAndPost", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .unique();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      });
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("likes", {
        userId: user._id,
        postId: args.postId,
        type: "post",
        createdAt: now,
      });

      await ctx.db.patch(args.postId, {
        likeCount: post.likeCount + 1,
      });

      // Send notification to post author (if not liking own post)
      if (post.authorId !== user._id) {
        // Check post author's notification settings
        const postAuthorSettings = await ctx.db
          .query("userSettings")
          .withIndex("byUserId", (q) => q.eq("userId", post.authorId))
          .first();

        const shouldNotifyLike =
          !postAuthorSettings?.notifications?.push?.likes;

        if (shouldNotifyLike) {
          await ctx.db.insert("notifications", {
            userId: post.authorId,
            authorId: user._id,
            type: "like",
            postId: args.postId,
            message: `${user.first_name} liked your post`,
            isRead: false,
            createdAt: now,
          });
        }
      }

      return { liked: true };
    }
  },
});
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const post = await ctx.db.get(args.postId);

    if (!post || post.authorId !== user._id) {
      throw new Error("Not authorized to delete this post");
    }

    await ctx.db.delete(args.postId);
  },
});
export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const [author, mediaUrls, userLike] = await Promise.all([
      getUserWithImage(ctx, post.authorId),
      getMediaUrls(ctx, post.mediaFiles),
      user ? getUserLikeStatus(ctx, user._id, post._id) : false,
    ]);

    return {
      ...post,
      mediaFiles: mediaUrls,
      author,
      userHasLiked: userLike,
    };
  },
});
export const repost = mutation({
  args: {
    originalPostId: v.id("posts"),
    content: v.optional(v.string()), // For quote reposts
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const originalPost = await ctx.db.get(args.originalPostId);
    if (!originalPost) {
      throw new Error("Original post not found");
    }

    // Extract mentions and hashtags from content if it's a quote repost
    const mentions = args.content ? extractMentions(args.content) : [];
    const tags = args.content ? extractHashtags(args.content) : [];

    // Create the repost as a new post
    const repostId = await ctx.db.insert("posts", {
      authorId: user._id,
      content: args.content || "", // Empty for simple reposts, content for quotes
      mediaFiles: [], // Reposts don't have their own media
      type: "repost",
      originalPostId: args.originalPostId,
      likeCount: 0,
      repostCount: 0,
      commentCount: 0,
      visibility: "public",
      tags,
      mentions,
      createdAt: now,
    });

    // Update original post's repost count
    await ctx.db.patch(args.originalPostId, {
      repostCount: (originalPost.repostCount || 0) + 1,
    });

    // Update user's post count
    await ctx.db.patch(user._id, {
      postsCount: (user.postsCount || 0) + 1,
      updatedAt: now,
    });

    // Send notification to original post author
    if (originalPost.authorId !== user._id) {
      const originalAuthorSettings = await ctx.db
        .query("userSettings")
        .withIndex("byUserId", (q) => q.eq("userId", originalPost.authorId))
        .first();

      const shouldNotifyRepost =
        !originalAuthorSettings?.notifications?.push?.reposts;

      if (shouldNotifyRepost) {
        await ctx.db.insert("notifications", {
          userId: originalPost.authorId,
          authorId: user._id,
          type: "repost",
          postId: repostId,
          originalPostId: args.originalPostId,
          message: `${user.first_name} shared your post`,
          isRead: false,
          createdAt: now,
        });
      }
    }

    return repostId;
  },
});
export const deleteRepost = mutation({
  args: { repostId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const repost = await ctx.db.get(args.repostId);

    if (!repost || repost.authorId !== user._id || repost.type !== "repost") {
      throw new Error("Not authorized to delete this repost or not a repost");
    }

    // Decrement original post's repost count
    if (repost.originalPostId) {
      const originalPost = await ctx.db.get(repost.originalPostId);
      if (originalPost) {
        await ctx.db.patch(repost.originalPostId, {
          repostCount: Math.max(0, (originalPost.repostCount || 0) - 1),
        });
      }
    }

    // Update user's post count
    await ctx.db.patch(user._id, {
      postsCount: Math.max(0, (user.postsCount || 0) - 1),
      updatedAt: Date.now(),
    });

    // Delete the repost
    await ctx.db.delete(args.repostId);
  },
});
// Helper functions
async function getPostWithDetails(
  ctx: QueryCtx,
  post: Doc<"posts">,
  currentUser: Doc<"users">
) {
  const [author, mediaUrls, userLike] = await Promise.all([
    getUserWithImage(ctx, post.authorId),
    getMediaUrls(ctx, post.mediaFiles),
    currentUser ? getUserLikeStatus(ctx, currentUser._id, post._id) : false,
  ]);

  // For reposts, get the original post details
  let originalPostDetails = null;
  if (post.type === "repost" && post.originalPostId) {
    const originalPost = await ctx.db.get(post.originalPostId);
    if (originalPost) {
      const [originalAuthor, originalMediaUrls] = await Promise.all([
        getUserWithImage(ctx, originalPost.authorId),
        getMediaUrls(ctx, originalPost.mediaFiles),
      ]);
      originalPostDetails = {
        ...originalPost,
        author: originalAuthor,
        mediaFiles: originalMediaUrls,
      };
    }
  }

  return {
    ...post,
    author,
    mediaFiles: mediaUrls,
    userHasLiked: userLike,
    originalPost: originalPostDetails,
  };
}

async function getUserLikeStatus(
  ctx: QueryCtx,
  userId: Id<"users">,
  postId: Id<"posts">
) {
  const like = await ctx.db
    .query("likes")
    .withIndex("byUserAndPost", (q) =>
      q.eq("userId", userId).eq("postId", postId)
    )
    .unique();
  return !!like;
}
