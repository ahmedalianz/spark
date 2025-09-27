import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
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
    parentCommentId: v.id("comments"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("replies")
      .withIndex("byParentComment", (q) =>
        q.eq("parentCommentId", args.parentCommentId)
      );

    const replies = await query.order("asc").paginate(args.paginationOpts);

    const repliesWithDetails = await Promise.all(
      replies.page.map(async (reply) => {
        const author = await getUserWithImage(ctx, reply.authorId);

        return {
          ...reply,
          author,
        };
      })
    );

    return {
      ...replies,
      page: repliesWithDetails,
    };
  },
});
