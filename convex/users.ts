import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await getUserWithImage(ctx, { clerkId: args.clerkId });
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await getUserWithImage(ctx, { userId: args.userId });
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byUsername", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;
    return await getUserWithImage(ctx, { userId: user._id });
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.union(v.string(), v.null())), // Allow null
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
    followingsCount: v.number(),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Generate a username if none provided
    const username = args.username || generateUsername(args);

    return await ctx.db.insert("users", {
      ...args,
      username, // Use the generated username
      createdAt: now,
      followersCount: args.followersCount || 0,
      followingsCount: args.followingsCount || 0,
      isVerified: args.isVerified || false,
    });
  },
});

// Helper function to generate a username
function generateUsername(args: {
  first_name?: string;
  last_name?: string;
  email: string;
}): string {
  if (args.first_name && args.last_name) {
    return `${args.first_name.toLowerCase()}${args.last_name.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
  }
  if (args.first_name) {
    return `${args.first_name.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
  }
  // Fallback to email username part
  const emailUsername = args.email.split("@")[0];
  return `${emailUsername}${Math.floor(Math.random() * 1000)}`;
}

export const updateUser = mutation({
  args: {
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db.patch(user._id, args);
  },
});

export const followUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    if (currentUser._id === args.userId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("byFollowerAndFollowing", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", args.userId)
      )
      .unique();

    if (existingFollow) {
      // Unfollow
      await ctx.db.delete(existingFollow._id);

      // Update counts
      await ctx.db.patch(currentUser._id, {
        followingsCount: Math.max(0, (currentUser.followingsCount || 0) - 1),
      });

      const targetUser = await ctx.db.get(args.userId);
      if (targetUser) {
        await ctx.db.patch(args.userId, {
          followersCount: Math.max(0, (targetUser.followersCount || 0) - 1),
        });
      }

      return { followed: false };
    } else {
      // Follow
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: args.userId,
        createdAt: Date.now(),
      });

      // Update counts
      await ctx.db.patch(currentUser._id, {
        followingsCount: (currentUser.followingsCount || 0) + 1,
      });

      const targetUser = await ctx.db.get(args.userId);
      if (targetUser) {
        await ctx.db.patch(args.userId, {
          followersCount: (targetUser.followersCount || 0) + 1,
        });

        // Send notification
        if (targetUser.pushToken) {
          // await ctx.scheduler.runAfter(500, internal.push.sendPushNotification, {
          //   pushToken: targetUser.pushToken,
          //   title: "New follower",
          //   body: `${currentUser.first_name} started following you`,
          // });
        }
      }

      return { followed: true };
    }
  },
});

export const searchUsers = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withSearchIndex("searchUsers", (q) => q.search("username", args.search))
      .collect();

    return await Promise.all(
      users.map(
        async (user) => await getUserWithImage(ctx, { userId: user._id })
      )
    );
  },
});

export const getUserFollowers = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("byFollowing", (q) => q.eq("followingId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const followersWithDetails = await Promise.all(
      follows.page.map(async (follow) => {
        const user = await getUserWithImage(ctx, { userId: follow.followerId });
        return { ...follow, user };
      })
    );

    return { ...follows, page: followersWithDetails };
  },
});

export const getUserFollowing = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("byFollower", (q) => q.eq("followerId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const followingWithDetails = await Promise.all(
      follows.page.map(async (follow) => {
        const user = await getUserWithImage(ctx, {
          userId: follow.followingId,
        });
        return { ...follow, user };
      })
    );

    return { ...follows, page: followingWithDetails };
  },
});

// Helper functions
async function getUserWithImage(
  ctx: QueryCtx,
  criteria: { clerkId?: string; userId?: Id<"users"> }
) {
  let user;

  if (criteria.userId) {
    user = await ctx.db.get(criteria.userId);
  } else if (criteria.clerkId) {
    user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", criteria?.clerkId || ""))
      .unique();
  }

  if (!user) return null;

  if (!user.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return { ...user, imageUrl: url };
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user) await ctx.db.delete(user._id);
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Can't get current user");
  return user;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", externalId))
    .unique();
}

export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);
  return await ctx.storage.generateUploadUrl();
});

export const updateImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.patch(user._id, { imageUrl: args.storageId });
  },
});
