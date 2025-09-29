import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const getUserById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    return await getUserWithImage(ctx, { userId: args.userId });
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
      lastActiveAt: now,
      postsCount: 0,
    });
  },
});

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

export const searchUsers = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return { page: [], isDone: true, continueCursor: null };
    }

    try {
      // This is a simple implementation - you might want to use a proper search index
      const users = await ctx.db
        .query("users")
        .order("desc")
        .paginate(args.paginationOpts);

      const searchTerm = args.query.toLowerCase();
      const filteredUsers = users.page.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(searchTerm) ||
          user.last_name?.toLowerCase().includes(searchTerm) ||
          user.username?.toLowerCase().includes(searchTerm)
      );

      return {
        page: filteredUsers,
        isDone: filteredUsers.length < args.paginationOpts.numItems,
        continueCursor: users.continueCursor,
      };
    } catch (error) {
      console.error("Error searching users:", error);
      return { page: [], isDone: true, continueCursor: null };
    }
  },
});

// users.ts - Get mutual followers function
export const getMutualFollowers = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser._id === args.userId) {
      return [];
    }

    // Get who the viewer follows
    const viewerFollowing = await ctx.db
      .query("follows")
      .withIndex("byFollower", (q) => q.eq("followerId", currentUser._id))
      .collect();

    // Get who follows the target user
    const targetFollowers = await ctx.db
      .query("follows")
      .withIndex("byFollowing", (q) => q.eq("followingId", args.userId))
      .collect();

    // Find mutual connections
    const mutualIds = viewerFollowing
      .map((f) => f.followingId)
      .filter((id) => targetFollowers.some((tf) => tf.followerId === id));

    // Get user details for mutual followers
    const mutualUsers = await Promise.all(
      mutualIds.slice(0, 5).map(async (id) => {
        const user = await ctx.db.get(id);
        return user
          ? {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              imageUrl: user.imageUrl,
            }
          : null;
      })
    );

    return mutualUsers.filter((user) => user !== null);
  },
});

// Helper function for optional current user (add to helpers.ts)
export async function getCurrentUserOptional(ctx: any) {
  try {
    return await getCurrentUser(ctx);
  } catch {
    return null;
  }
}
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
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await getUserWithImage(ctx, { clerkId: args.clerkId });
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user) await ctx.db.delete(user._id);
  },
});
