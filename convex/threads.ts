import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const addThread = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    parentThreadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const thread = await ctx.db.insert("threads", {
      userId: user._id,
      content: args.content,
      mediaFiles: args.mediaFiles,
      parentThreadId: args.parentThreadId,
      likeCount: 0,
      commentCount: 0,
      repostCount: 0,
      isEdited: false,
      createdAt: now,
    });

    // Update parent thread comment count if this is a reply
    if (args.parentThreadId) {
      const parentThread = await ctx.db.get(args.parentThreadId);
      if (parentThread) {
        await ctx.db.patch(args.parentThreadId, {
          commentCount: (parentThread.commentCount || 0) + 1,
        });

        // Send notification to parent thread author
        if (parentThread.userId !== user._id) {
          const parentUser = await ctx.db.get(parentThread.userId);
          if (parentUser?.pushToken) {
            // await ctx.scheduler.runAfter(500, internal.push.sendPushNotification, {
            //   pushToken: parentUser.pushToken,
            //   title: "New reply",
            //   body: `${user.first_name} replied to your thread`,
            //   threadId: args.parentThreadId,
            // });
          }
        }
      }
    }

    return thread;
  },
});

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
    parentThreadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    let query = ctx.db.query("threads");

    if (args.userId) {
      query = query.filter((q) => q.eq(q.field("userId"), args.userId));
    }

    if (args.parentThreadId) {
      query = query.filter((q) =>
        q.eq(q.field("parentThreadId"), args.parentThreadId)
      );
    } else {
      query = query.filter((q) => q.eq(q.field("parentThreadId"), undefined));
    }

    const threads = await query.order("desc").paginate(args.paginationOpts);

    const threadsWithDetails = await Promise.all(
      threads.page.map(async (thread) => {
        const [creator, mediaUrls, userLike, userRepost] = await Promise.all([
          getMessageCreator(ctx, thread.userId),
          getMediaUrls(ctx, thread.mediaFiles),
          user ? hasUserLikedThread(ctx, user._id, thread._id) : false,
          user ? hasUserRepostedThread(ctx, user._id, thread._id) : false,
        ]);

        return {
          ...thread,
          mediaFiles: mediaUrls,
          creator,
          userHasLiked: userLike,
          userHasReposted: userRepost,
        };
      })
    );

    return {
      ...threads,
      page: threadsWithDetails,
    };
  },
});

export const likeThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    // Check if user already liked this thread
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("byUserAndThread", (q) =>
        q.eq("userId", user._id).eq("threadId", args.threadId)
      )
      .unique();

    if (existingLike) {
      // Unlike: remove like record and decrement count
      await ctx.db.delete(existingLike._id);
      const thread = await ctx.db.get(args.threadId);
      if (thread) {
        await ctx.db.patch(args.threadId, {
          likeCount: Math.max(0, (thread.likeCount || 0) - 1),
        });
      }
      return { liked: false };
    } else {
      // Like: add like record and increment count
      await ctx.db.insert("likes", {
        userId: user._id,
        threadId: args.threadId,
        createdAt: now,
      });

      const thread = await ctx.db.get(args.threadId);
      if (thread) {
        await ctx.db.patch(args.threadId, {
          likeCount: (thread.likeCount || 0) + 1,
        });

        // Send notification to thread author if it's not the current user
        if (thread.userId !== user._id) {
          const threadUser = await ctx.db.get(thread.userId);
          if (threadUser?.pushToken) {
            // await ctx.scheduler.runAfter(500, internal.push.sendPushNotification, {
            //   pushToken: threadUser.pushToken,
            //   title: "New like",
            //   body: `${user.first_name} liked your thread`,
            //   threadId: args.threadId,
            // });
          }
        }
      }
      return { liked: true };
    }
  },
});

export const repostThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const existingRepost = await ctx.db
      .query("reposts")
      .withIndex("byUserAndThread", (q) =>
        q.eq("userId", user._id).eq("threadId", args.threadId)
      )
      .unique();

    if (existingRepost) {
      await ctx.db.delete(existingRepost._id);
      const thread = await ctx.db.get(args.threadId);
      if (thread) {
        await ctx.db.patch(args.threadId, {
          repostCount: Math.max(0, (thread.repostCount || 0) - 1),
        });
      }
      return { reposted: false };
    } else {
      await ctx.db.insert("reposts", {
        userId: user._id,
        threadId: args.threadId,
        createdAt: now,
      });

      const thread = await ctx.db.get(args.threadId);
      if (thread) {
        await ctx.db.patch(args.threadId, {
          repostCount: (thread.repostCount || 0) + 1,
        });
      }
      return { reposted: true };
    }
  },
});

export const getThreadById = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const thread = await ctx.db.get(args.threadId);

    if (!thread) return null;

    const [creator, mediaUrls, userLike, userRepost] = await Promise.all([
      getMessageCreator(ctx, thread.userId),
      getMediaUrls(ctx, thread.mediaFiles),
      user ? hasUserLikedThread(ctx, user._id, thread._id) : false,
      user ? hasUserRepostedThread(ctx, user._id, thread._id) : false,
    ]);

    return {
      ...thread,
      mediaFiles: mediaUrls,
      creator,
      userHasLiked: userLike,
      userHasReposted: userRepost,
    };
  },
});

export const getThreadLikes = query({
  args: {
    threadId: v.id("threads"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("byThreadId", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .paginate(args.paginationOpts);

    const likesWithUsers = await Promise.all(
      likes.page.map(async (like) => {
        const user = await getMessageCreator(ctx, like.userId);
        return { ...like, user };
      })
    );

    return {
      ...likes,
      page: likesWithUsers,
    };
  },
});

// Helper functions
const hasUserLikedThread = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  threadId: Id<"threads">
) => {
  const like = await ctx.db
    .query("likes")
    .withIndex("byUserAndThread", (q) =>
      q.eq("userId", userId).eq("threadId", threadId)
    )
    .unique();
  return !!like;
};

const hasUserRepostedThread = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  threadId: Id<"threads">
) => {
  const repost = await ctx.db
    .query("reposts")
    .withIndex("byUserAndThread", (q) =>
      q.eq("userId", userId).eq("threadId", threadId)
    )
    .unique();
  return !!repost;
};

const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  if (!user.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return { ...user, imageUrl: url };
};

const getMediaUrls = async (
  ctx: QueryCtx,
  mediaFiles: string[] | undefined
) => {
  if (!mediaFiles || mediaFiles.length === 0) return [];

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
