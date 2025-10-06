import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";
import { extractMentions, getUserWithImage } from "./utils";

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const mentions = extractMentions(args.content);

    const commentId = await ctx.db.insert("comments", {
      authorId: user._id,
      postId: args.postId,
      content: args.content,
      likeCount: 0,
      replyCount: 0,
      mentions,
      createdAt: now,
    });

    // Update post comment count
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, {
        commentCount: post.commentCount + 1,
      });

      // 1. Send notification to POST AUTHOR (if not commenting on own post)
      if (post.authorId !== user._id) {
        // Check post author's notification settings
        const postAuthorSettings = await ctx.db
          .query("userSettings")
          .withIndex("byUserId", (q) => q.eq("userId", post.authorId))
          .first();

        const shouldNotifyComment =
          !postAuthorSettings?.notifications?.push?.comments;

        if (shouldNotifyComment) {
          await ctx.db.insert("notifications", {
            userId: post.authorId,
            authorId: user._id,
            type: "comment",
            postId: args.postId,
            commentId,
            message: `${user.first_name} commented on your post: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
            isRead: false,
            createdAt: now,
          });
        }
      }

      // 2. Handle mentions in the comment content
      if (mentions && mentions.length > 0) {
        for (const mentionedUserId of mentions) {
          // Don't notify if user mentioned themselves or the post author (already notified above)
          if (
            mentionedUserId !== user._id &&
            mentionedUserId !== post.authorId
          ) {
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
                postId: args.postId,
                commentId,
                message: `${user.first_name} mentioned you in a comment: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
                isRead: false,
                createdAt: now,
              });
            }
          }
        }
      }
    }

    return commentId;
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    let query = ctx.db
      .query("comments")
      .withIndex("byPost", (q) => q.eq("postId", args.postId));

    const comments = await query.order("asc").paginate(args.paginationOpts);

    const commentsWithDetails = await Promise.all(
      comments.page.map(async (comment) => {
        const [author, userLike] = await Promise.all([
          getUserWithImage(ctx, comment.authorId),
          currentUser
            ? getUserCommentLikeStatus(ctx, currentUser._id, comment._id)
            : false,
        ]);

        return {
          ...comment,
          author,
          userHasLiked: userLike,
        };
      })
    );

    return {
      ...comments,
      page: commentsWithDetails,
    };
  },
});

export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
    unlike: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("byUserAndComment", (q) =>
        q.eq("userId", user._id).eq("commentId", args.commentId)
      )
      .unique();

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    if (args.unlike || existingLike) {
      // Unlike
      if (existingLike) {
        await ctx.db.delete(existingLike._id);
        await ctx.db.patch(args.commentId, {
          likeCount: Math.max(0, comment.likeCount - 1),
        });
      }
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("likes", {
        userId: user._id,
        commentId: args.commentId,
        type: "comment",
        createdAt: now,
      });

      await ctx.db.patch(args.commentId, {
        likeCount: comment.likeCount + 1,
      });

      // Send notification to COMMENT AUTHOR (if not liking own comment)
      if (comment.authorId !== user._id) {
        // Check comment author's notification settings
        const commentAuthorSettings = await ctx.db
          .query("userSettings")
          .withIndex("byUserId", (q) => q.eq("userId", comment.authorId))
          .first();

        const shouldNotifyLike =
          !commentAuthorSettings?.notifications?.push?.likes;

        if (shouldNotifyLike) {
          await ctx.db.insert("notifications", {
            userId: comment.authorId,
            authorId: user._id,
            type: "like",
            postId: comment.postId,
            commentId: args.commentId,
            message: `${user.first_name} liked your comment`,
            isRead: false,
            createdAt: now,
          });
        }
      }

      return { liked: true };
    }
  },
});

async function getUserCommentLikeStatus(
  ctx: QueryCtx,
  userId: Id<"users">,
  commentId: Id<"comments">
) {
  const like = await ctx.db
    .query("likes")
    .withIndex("byUserAndComment", (q) =>
      q.eq("userId", userId).eq("commentId", commentId)
    )
    .unique();
  return !!like;
}
