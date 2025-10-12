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
    followersCount: v.number(),
    followingsCount: v.number(),
    postsCount: v.number(),
    pushToken: v.optional(v.string()),
    lastActiveAt: v.optional(v.number()),
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
    type: v.union(v.literal("post"), v.literal("repost"), v.literal("tagged")),
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
    authorId: v.optional(v.id("users")),
    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("follow"),
      v.literal("mention"),
      v.literal("reply"),
      v.literal("system"),
      v.literal("post"),
      v.literal("repost")
    ),
    postId: v.optional(v.id("posts")),
    originalPostId: v.optional(v.id("posts")),
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
      // Push notifications
      push: v.object({
        likes: v.boolean(),
        comments: v.boolean(),
        follows: v.boolean(),
        mentions: v.boolean(),
        reposts: v.boolean(),
        posts: v.boolean(),
        directMessages: v.boolean(),
        storyReplies: v.boolean(),
      }),
      // Email notifications
      email: v.object({
        securityAlerts: v.boolean(),
        productUpdates: v.boolean(),
        weeklyDigest: v.boolean(),
      }),
      // In-app notifications
      inApp: v.object({
        badges: v.boolean(),
        sounds: v.boolean(),
        previews: v.boolean(),
      }),
    }),
    privacy: v.object({
      account: v.union(v.literal("public"), v.literal("private")),
      allowDirectMessages: v.union(
        v.literal("everyone"),
        v.literal("following"),
        v.literal("none")
      ),
      showOnlineStatus: v.boolean(),
      showReadReceipts: v.boolean(),
      hideLikes: v.boolean(),
      hideFollowers: v.boolean(),
      blockedUsers: v.array(v.id("users")),
      mutedUsers: v.array(v.id("users")),
    }),
    // Appearance
    appearance: v.object({
      theme: v.union(
        v.literal("light"),
        v.literal("dark"),
        v.literal("system")
      ),
      fontSize: v.union(
        v.literal("small"),
        v.literal("medium"),
        v.literal("large")
      ),
      reduceMotion: v.boolean(),
      highContrast: v.boolean(),
    }),

    // Feed preferences
    feed: v.object({
      algorithm: v.union(v.literal("chronological"), v.literal("recommended")),
      showReposts: v.boolean(),
      showQuotes: v.boolean(),
      autoPlayVideos: v.boolean(),
      contentLanguages: v.array(v.string()),
      sensitiveContent: v.boolean(),
    }),

    // Accessibility
    accessibility: v.object({
      altTextReminders: v.boolean(),
      keyboardShortcuts: v.boolean(),
      screenReaderOptimized: v.boolean(),
    }),

    // Storage & Data
    storage: v.object({
      autoPlayVideos: v.union(
        v.literal("always"),
        v.literal("wifi"),
        v.literal("never")
      ),
      imageQuality: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      ),
      clearCacheOnExit: v.boolean(),
      downloadOriginals: v.boolean(),
    }),
    updatedAt: v.number(),
  }).index("byUserId", ["userId"]),
});
