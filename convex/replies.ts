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

    const replyId = await ctx.db.insert("replies", {
      authorId: user._id,
      postId: args.postId,
      parentCommentId: args.parentCommentId,
      content: args.content,
      mentions,
      createdAt: now,
    });

    // Update parent comment reply count
    const parentComment = await ctx.db.get(args.parentCommentId);
    if (parentComment) {
      await ctx.db.patch(args.parentCommentId, {
        replyCount: (parentComment.replyCount || 0) + 1,
      });
    }

    // Get the post to find the post author
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // 1. Notify the COMMENT AUTHOR (person whose comment is being replied to)
    if (parentComment && parentComment.authorId !== user._id) {
      // Check user settings for reply notifications
      const commentAuthorSettings = await ctx.db
        .query("userSettings")
        .withIndex("byUserId", (q) => q.eq("userId", parentComment.authorId))
        .first();

      const shouldNotifyReply =
        !commentAuthorSettings?.notifications?.push?.comments;

      if (shouldNotifyReply) {
        await ctx.db.insert("notifications", {
          userId: parentComment.authorId,
          authorId: user._id,
          type: "reply", // Use "reply" type for reply notifications
          postId: args.postId,
          commentId: args.parentCommentId,
          replyId: replyId,
          message: `${user.first_name} replied to your comment: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
          isRead: false,
          createdAt: now,
        });
      }
    }

    // 2. Notify the POST AUTHOR (only if they're not the one replying AND not the comment author)
    if (
      post.authorId !== user._id &&
      post.authorId !== parentComment?.authorId
    ) {
      // Check user settings for comment notifications
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
          type: "comment", // Use "comment" type for post comment notifications
          postId: args.postId,
          commentId: args.parentCommentId,
          replyId: replyId,
          message: `${user.first_name} commented on your post: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
          isRead: false,
          createdAt: now,
        });
      }
    }

    // 3. Handle mentions in the reply content
    if (mentions && mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        // Don't notify if user mentioned themselves
        if (mentionedUserId !== user._id) {
          // Check mentioned user's settings for mention notifications
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
              replyId: replyId,
              message: `${user.first_name} mentioned you in a reply: "${args.content.length > 30 ? `${args.content.slice(0, 30)}...` : args.content}"`,
              isRead: false,
              createdAt: now,
            });
          }
        }
      }
    }

    return replyId;
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
