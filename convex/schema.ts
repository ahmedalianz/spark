// schema.ts
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
    postsCount: v.number(), // Added
    pushToken: v.optional(v.string()),
    lastActiveAt: v.optional(v.number()), // Added for activity tracking
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byClerkId", ["clerkId"])
    .index("byUsername", ["username"])
    .index("byEmail", ["email"])
    .index("byLastActive", ["lastActiveAt"])
    .searchIndex("searchUsers", {
      searchField: "username",
    }),

  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    type: v.union(v.literal("post"), v.literal("repost"), v.literal("quote")), // Added post types
    originalPostId: v.optional(v.id("posts")), // For reposts/quotes
    likeCount: v.number(),
    repostCount: v.number(), // Added
    commentCount: v.number(),
    isPinned: v.optional(v.boolean()), // Added for pinned posts
    visibility: v.union(v.literal("public"), v.literal("followers")), // Added visibility control
    tags: v.optional(v.array(v.string())), // Added hashtags
    mentions: v.optional(v.array(v.id("users"))), // Added mentions
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    scheduledAt: v.optional(v.number()), // Added for scheduled posts
  })
    .index("byAuthor", ["authorId"])
    .index("byCreatedAt", ["createdAt"])
    .index("byUpdatedAt", ["updatedAt"])
    .index("byType", ["type"])
    .index("byVisibility", ["visibility"])
    .index("byScheduled", ["scheduledAt"])
    .index("byAuthorAndType", ["authorId", "type"])
    .searchIndex("searchPosts", {
      searchField: "content",
      filterFields: ["authorId", "type", "visibility"],
    }),

  comments: defineTable({
    authorId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
    likeCount: v.number(),
    replyCount: v.number(), // Added for nested replies
    mentions: v.optional(v.array(v.id("users"))), // Added mentions in comments
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byPost", ["postId"])
    .index("byAuthor", ["authorId"])
    .index("byPostAndCreated", ["postId", "createdAt"])
    .index("byAuthorAndPost", ["authorId", "postId"]),

  replies: defineTable({
    authorId: v.id("users"),
    postId: v.id("posts"),
    parentCommentId: v.id("comments"),
    content: v.string(),
    mentions: v.optional(v.array(v.id("users"))), // Added mentions in comments
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byPost", ["postId"])
    .index("byAuthor", ["authorId"])
    .index("byParentComment", ["parentCommentId"])
    .index("byPostAndCreated", ["postId", "createdAt"])
    .index("byAuthorAndPost", ["authorId", "postId"]),

  likes: defineTable({
    userId: v.id("users"),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    replyId: v.optional(v.id("replies")),
    type: v.union(v.literal("post"), v.literal("comment"), v.literal("reply")),
    createdAt: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byPost", ["postId"])
    .index("byComment", ["commentId"])
    .index("byType", ["type"])
    .index("byUserAndPost", ["userId", "postId"])
    .index("byUserAndComment", ["userId", "commentId"])
    .index("byUserAndReply", ["userId", "replyId"])
    .index("byUserAndType", ["userId", "type"]),

  reposts: defineTable({
    // Separate table for better tracking
    userId: v.id("users"),
    postId: v.id("posts"),
    comment: v.optional(v.string()), // For quote reposts
    createdAt: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byPost", ["postId"])
    .index("byUserAndPost", ["userId", "postId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("byFollower", ["followerId"])
    .index("byFollowing", ["followingId"])
    .index("byFollowerAndFollowing", ["followerId", "followingId"]),
  notifications: defineTable({
    userId: v.id("users"),
    actorId: v.optional(v.id("users")),
    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("follow"),
      v.literal("mention"),
      v.literal("reply"),
      v.literal("system"),
      v.literal("repost")
    ),
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    replyId: v.optional(v.id("replies")),
    actionUrl: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byUserAndRead", ["userId", "isRead"])
    .index("byType", ["type"])
    .index("byCreatedAt", ["createdAt"]),

  userSettings: defineTable({
    // Added user preferences
    userId: v.id("users"),
    notifications: v.object({
      likes: v.boolean(),
      comments: v.boolean(),
      follows: v.boolean(),
      mentions: v.boolean(),
      reposts: v.boolean(),
    }),
    privacy: v.object({
      allowDirectMessages: v.boolean(),
      showOnlineStatus: v.boolean(),
    }),
    theme: v.union(v.literal("light"), v.literal("dark")),
    feed: v.object({
      algorithm: v.union(v.literal("chronological"), v.literal("recommended")),
      showReposts: v.boolean(),
      language: v.optional(v.string()),
    }),
    updatedAt: v.number(),
  }).index("byUserId", ["userId"]),
});
