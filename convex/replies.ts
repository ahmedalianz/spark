import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";
import { extractMentions, getUserWithImage } from "./utils";

export const addReply = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
    parentCommentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const mentions = extractMentions(args.content);

    const commentId = await ctx.db.insert("replies", {
      authorId: user._id,
      postId: args.postId,
      parentCommentId: args.parentCommentId,
      content: args.content,
      likeCount: 0,
      mentions,
      createdAt: now,
    });

    // Update parent comment reply count if this is a reply
    const parentComment = await ctx.db.get(args.parentCommentId);
    if (parentComment) {
      await ctx.db.patch(args.parentCommentId, {
        replyCount: parentComment.replyCount + 1,
      });
    }

    return commentId;
  },
});

export const getReplies = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    let query = ctx.db
      .query("replies")
      .withIndex("byPost", (q) => q.eq("postId", args.postId));

    const replies = await query.order("asc").paginate(args.paginationOpts);

    const repliesWithDetails = await Promise.all(
      replies.page.map(async (reply) => {
        const [author, userLike] = await Promise.all([
          getUserWithImage(ctx, reply.authorId),
          currentUser
            ? getUserReliesLikeStatus(ctx, currentUser._id, reply._id)
            : false,
        ]);

        return {
          ...replies,
          author,
          userHasLiked: userLike,
        };
      })
    );

    return {
      ...replies,
      page: repliesWithDetails,
    };
  },
});
export const likeReply = mutation({
  args: {
    replyId: v.id("replies"),
    unlike: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("byUserAndReply", (q) =>
        q.eq("userId", user._id).eq("replyId", args.replyId)
      )
      .unique();

    const reply = await ctx.db.get(args.replyId);
    if (!reply) throw new Error("Reply not found");

    if (args.unlike || existingLike) {
      // Unlike
      if (existingLike) {
        await ctx.db.delete(existingLike._id);
        await ctx.db.patch(args.replyId, {
          likeCount: Math.max(0, reply.likeCount - 1),
        });
      }
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("likes", {
        userId: user._id,
        replyId: args.replyId,
        type: "reply",
        createdAt: now,
      });

      await ctx.db.patch(args.replyId, {
        likeCount: reply.likeCount + 1,
      });

      return { liked: true };
    }
  },
});
async function getUserReliesLikeStatus(
  ctx: QueryCtx,
  userId: Id<"users">,
  replyId: Id<"replies">
) {
  const like = await ctx.db
    .query("likes")
    .withIndex("byUserAndReply", (q) =>
      q.eq("userId", userId).eq("replyId", replyId)
    )
    .unique();
  return !!like;
}
