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
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const mentions = extractMentions(args.content);

    const commentId = await ctx.db.insert("comments", {
      authorId: user._id,
      postId: args.postId,
      parentCommentId: args.parentCommentId,
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

      // Send notification to post author
      if (post.authorId !== user._id) {
        await ctx.db.insert("notifications", {
          userId: post.authorId,
          actorId: user._id,
          type: "comment",
          postId: args.postId,
          commentId,
          message: `${user.first_name} commented on your post`,
          isRead: false,
          createdAt: now,
        });
      }
    }

    // Update parent comment reply count if this is a reply
    if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);
      if (parentComment) {
        await ctx.db.patch(args.parentCommentId, {
          replyCount: parentComment.replyCount + 1,
        });
      }
    }

    return commentId;
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    let query = ctx.db
      .query("comments")
      .withIndex("byPost", (q) => q.eq("postId", args.postId));

    if (args.parentCommentId) {
      query = query.filter((q) =>
        q.eq(q.field("parentCommentId"), args.parentCommentId)
      );
    } else {
      query = query.filter((q) => q.eq(q.field("parentCommentId"), undefined));
    }

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
