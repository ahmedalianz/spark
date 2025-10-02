import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const followUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    if (currentUser._id === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("byFollowerAndFollowing", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.userId)
      )
      .unique();

    const now = Date.now();

    if (existingFollow) {
      // Unfollow
      await ctx.db.delete(existingFollow._id);

      // Update counts
      await ctx.db.patch(currentUser._id, {
        followingsCount: Math.max(0, (currentUser.followingsCount || 0) - 1),
      });

      await ctx.db.patch(args.userId, {
        followersCount: Math.max(0, (targetUser.followersCount || 0) - 1),
      });

      return { followed: false };
    } else {
      // Follow

      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.userId,
        createdAt: now,
      });

      await ctx.db.patch(currentUser._id, {
        followingsCount: (currentUser.followingsCount || 0) + 1,
      });

      // Send notification
      await ctx.db.insert("notifications", {
        userId: args.userId,
        actorId: currentUser._id,
        type: "follow",
        message: `${currentUser.first_name} started following you`,
        isRead: false,
        createdAt: now,
      });
      if (targetUser.pushToken) {
        // await ctx.scheduler.runAfter(500, internal.push.sendPushNotification, {
        //   pushToken: targetUser.pushToken,
        //   title: "New follower",
        //   body: `${currentUser.first_name} started following you`,
        // });
      }
      return { followed: true };
    }
  },
});

export const getFollowers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const follows = await ctx.db
      .query("follows")
      .order("desc")
      .paginate(args.paginationOpts);

    const followersWithDetails = await Promise.all(
      follows.page.map(async (follow) => {
        const [user, isFollowedByCurrentUser] = await Promise.all([
          getUserWithImage(ctx, follow.followerId),
          currentUser
            ? isUserFollowedBy(ctx, currentUser._id, follow.followerId)
            : false,
        ]);

        return {
          ...follow,
          user,
          isFollowedByCurrentUser,
        };
      })
    );

    return {
      ...follows,
      page: followersWithDetails,
    };
  },
});

export const getFollowing = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const follows = await ctx.db
      .query("follows")
      .order("desc")
      .paginate(args.paginationOpts);

    const followingWithDetails = await Promise.all(
      follows.page.map(async (follow) => {
        const [user, isFollowedByCurrentUser] = await Promise.all([
          getUserWithImage(ctx, follow.followingId),
          currentUser
            ? isUserFollowedBy(ctx, currentUser._id, follow.followingId)
            : false,
        ]);

        return {
          ...follow,
          user,
          isFollowedByCurrentUser,
        };
      })
    );

    return {
      ...follows,
      page: followingWithDetails,
    };
  },
});

export const checkFollowStatus = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser || !args?.userId || currentUser._id === args?.userId) {
      return {
        isFollowing: false,
        isFollowedBy: false,
      };
    }

    const [userFollow, reverseFollow] = await Promise.all([
      ctx.db
        .query("follows")
        .withIndex("byFollowerAndFollowing", (q) =>
          q
            .eq("followerId", currentUser._id)
            .eq("followingId", args.userId as Id<"users">)
        )
        .unique(),
      ctx.db
        .query("follows")
        .withIndex("byFollowerAndFollowing", (q) =>
          q.eq("followerId", args.userId).eq("followingId", currentUser._id)
        )
        .unique(),
    ]);

    return {
      isFollowing: !!userFollow,
      isFollowedBy: !!reverseFollow,
    };
  },
});
export const getFollowCounts = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db.get(args.userId);
      if (!user) {
        return { followersCount: 0, followingsCount: 0 };
      }

      return {
        followersCount: user.followersCount || 0,
        followingsCount: user.followingsCount || 0,
      };
    } catch (error) {
      return { followersCount: 0, followingsCount: 0 };
    }
  },
});
// Helper functions

async function isUserFollowedBy(
  ctx: QueryCtx,
  currentUserId: Id<"users">,
  targetUserId: Id<"users">
) {
  const follow = await ctx.db
    .query("follows")
    .withIndex("byFollowerAndFollowing", (q) =>
      q.eq("followerId", currentUserId).eq("followingId", targetUserId)
    )
    .unique();

  return !!follow;
}

async function getUserWithImage(ctx: QueryCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  if (!user.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return { ...user, imageUrl: url };
}
