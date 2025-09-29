import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
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
    type: v.optional(v.union(v.literal("post"), v.literal("quote"))),
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
    });

    // Send notifications for mentions
    if (mentions.length > 0) {
      await Promise.all(
        mentions.map(async (mentionedUserId) => {
          if (mentionedUserId !== user._id) {
            await ctx.db.insert("notifications", {
              userId: mentionedUserId,
              actorId: user._id,
              type: "mention",
              postId,
              message: `${user.first_name} mentioned you in a post`,
              isRead: false,
              createdAt: now,
            });
          }
        })
      );
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
    const user = await getCurrentUser(ctx);

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
      followingIds.push(user._id); // Include user's own posts

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
      // Get original posts only
      const query = ctx.db
        .query("posts")
        .withIndex("byAuthorAndType", (q) =>
          q.eq("authorId", args.userId).eq("type", "post")
        );

      posts = await query.order("desc").paginate(args.paginationOpts);
    } else if (args.type === "reposts") {
      // Get reposts from the reposts table
      const repostQuery = ctx.db
        .query("reposts")
        .withIndex("byUser", (q) => q.eq("userId", args.userId));

      const reposts = await repostQuery
        .order("desc")
        .paginate(args.paginationOpts);

      // Get the original posts for each repost
      const repostDetails = await Promise.all(
        reposts.page.map(async (repost) => {
          const originalPost = await ctx.db.get(repost.postId);
          if (!originalPost) return null;

          // Add repost metadata
          return {
            ...originalPost,
            repostId: repost._id,
            repostComment: repost.comment,
            repostDate: repost.createdAt,
            isRepost: true,
          };
        })
      );

      const validReposts = repostDetails.filter((post) => post !== null);

      posts = {
        ...reposts,
        page: validReposts,
      };
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
      // Get all posts (original + reposts + tagged)
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

      // Send notification
      if (post.authorId !== user._id) {
        await ctx.db.insert("notifications", {
          userId: post.authorId,
          actorId: user._id,
          type: "like",
          postId: args.postId,
          message: `${user.first_name} liked your post`,
          isRead: false,
          createdAt: now,
        });
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
// Helper functions
async function getPostWithDetails(ctx: QueryCtx, post: any, currentUser: any) {
  const [author, mediaUrls, userLike, userRepost] = await Promise.all([
    getUserWithImage(ctx, post.authorId),
    getMediaUrls(ctx, post.mediaFiles),
    currentUser ? getUserLikeStatus(ctx, currentUser._id, post._id) : false,
    currentUser ? getUserRepostStatus(ctx, currentUser._id, post._id) : false,
  ]);

  return {
    ...post,
    author,
    mediaFiles: mediaUrls,
    userHasLiked: userLike,
    userHasReposted: userRepost,
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
async function getUserRepostStatus(
  ctx: QueryCtx,
  userId: Id<"users">,
  postId: Id<"posts">
) {
  const repost = await ctx.db
    .query("reposts")
    .withIndex("byUserAndPost", (q) =>
      q.eq("userId", userId).eq("postId", postId)
    )
    .unique();
  return !!repost;
}
