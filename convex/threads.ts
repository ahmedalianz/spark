import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const addThread = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const thread = await ctx.db.insert("threads", {
      ...args,
      userId: user._id,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    });

    // Trigger push notification
    if (args.threadId) {
      const originalThread = await ctx.db.get(args.threadId);
      await ctx.db.patch(args.threadId, {
        commentCount: (originalThread?.commentCount || 0) + 1,
      });

      if (originalThread?.userId) {
        const user = await ctx.db.get(originalThread?.userId);
        const pushToken = user?.pushToken;

        if (!pushToken) return;

        // await ctx.scheduler.runAfter(500, internal.push.sendPushNotification, {
        //   pushToken,
        //   threadTitle: "New comment",
        //   threadBody: args.content,
        //   threadId: args.threadId,
        // });
      }
    }

    return thread;
  },
});

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let threads;
    if (args.userId) {
      threads = await ctx.db
        .query("threads")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      threads = await ctx.db
        .query("threads")
        .filter((q) => q.eq(q.field("threadId"), undefined))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const threadsWithMedia = await Promise.all(
      threads.page.map(async (thread) => {
        const creator = await getMessageCreator(ctx, thread.userId);
        const mediaUrls = await getMediaUrls(ctx, thread.mediaFiles);

        return {
          ...thread,
          mediaFiles: mediaUrls,
          creator,
        };
      })
    );

    return {
      ...threads,
      page: threadsWithMedia,
    };
  },
});

export const likeThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const message = await ctx.db.get(args.threadId);

    await ctx.db.patch(args.threadId, {
      likeCount: (message?.likeCount || 0) + 1,
    });
  },
});

export const getThreadById = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.threadId);
    if (!message) return null;

    const creator = await getMessageCreator(ctx, message.userId);
    const mediaUrls = await getMediaUrls(ctx, message.mediaFiles);

    return {
      ...message,
      mediaFiles: mediaUrls,
      creator,
    };
  },
});

export const getThreadComments = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .order("desc")
      .collect();

    const commentsWithMedia = await Promise.all(
      comments.map(async (comment) => {
        const creator = await getMessageCreator(ctx, comment.userId);
        const mediaUrls = await getMediaUrls(ctx, comment.mediaFiles);

        return {
          ...comment,
          mediaFiles: mediaUrls,
          creator,
        };
      })
    );

    return commentsWithMedia;
  },
});

const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user?.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);

  return {
    ...user,
    imageUrl: url,
  };
};

const getMediaUrls = async (
  ctx: QueryCtx,
  mediaFiles: string[] | undefined
) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    return [];
  }

  const urlPromises = mediaFiles.map((file) =>
    ctx.storage.getUrl(file as Id<"_storage">)
  );
  const results = await Promise.allSettled(urlPromises);
  return results
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
};

export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);

  return await ctx.storage.generateUploadUrl();
});
