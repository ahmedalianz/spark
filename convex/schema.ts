import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    username: v.string(),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
    followingsCount: v.number(),
    pushToken: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("byClerkId", ["clerkId"])
    .index("byUsername", ["username"])
    .searchIndex("searchUsers", {
      searchField: "username",
    }),

  threads: defineTable({
    userId: v.id("users"),
    parentThreadId: v.optional(v.id("threads")), // For replies/threads
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    likeCount: v.number(),
    commentCount: v.number(),
    repostCount: v.number(),
    isEdited: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byUserId", ["userId"])
    .index("byParentThread", ["parentThreadId"])
    .index("byCreatedAt", ["createdAt"]),

  // Separate table for likes to track individual user likes
  likes: defineTable({
    userId: v.id("users"),
    threadId: v.id("threads"),
    createdAt: v.number(),
  })
    .index("byThreadId", ["threadId"])
    .index("byUserId", ["userId"])
    .index("byUserAndThread", ["userId", "threadId"]),

  // Separate table for reposts (retweets)
  reposts: defineTable({
    userId: v.id("users"),
    threadId: v.id("threads"),
    createdAt: v.number(),
  })
    .index("byThreadId", ["threadId"])
    .index("byUserId", ["userId"])
    .index("byUserAndThread", ["userId", "threadId"]),

  // Follow relationships
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("byFollower", ["followerId"])
    .index("byFollowing", ["followingId"])
    .index("byFollowerAndFollowing", ["followerId", "followingId"]),
});
