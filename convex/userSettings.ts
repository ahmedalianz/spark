import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId as Id<"users">))
      .first();

    if (!settings) {
      // Return default settings if none exist
      return getDefaultSettings(args.userId);
    }

    return settings;
  },
});

export const update = mutation({
  args: {
    userId: v.string(),
    category: v.string(),
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId as Id<"users">))
      .first();

    if (existing) {
      // Update existing settings
      const updatedSettings = {
        ...existing,
        [args.category]: {
          ...existing[args.category as keyof typeof existing],
          [args.key]: args.value,
        },
        updatedAt: args.updatedAt,
      };

      await ctx.db.patch(existing._id, updatedSettings);
      return updatedSettings;
    } else {
      // Create new settings with defaults
      const defaultSettings = getDefaultSettings(args.userId);
      const updatedSettings = {
        ...defaultSettings,
        [args.category]: {
          ...defaultSettings[args.category as keyof typeof defaultSettings],
          [args.key]: args.value,
        },
        updatedAt: args.updatedAt,
      };

      await ctx.db.insert("userSettings", updatedSettings);
      return updatedSettings;
    }
  },
});

// Helper function for default settings
function getDefaultSettings(userId: string) {
  return {
    userId,
    notifications: {
      push: {
        likes: true,
        comments: true,
        follows: true,
        mentions: true,
        reposts: true,
        directMessages: true,
        storyReplies: true,
      },
      email: {
        securityAlerts: true,
        productUpdates: false,
        weeklyDigest: false,
      },
      inApp: {
        badges: true,
        sounds: true,
        previews: true,
      },
    },
    privacy: {
      account: "public",
      allowDirectMessages: "everyone",
      showOnlineStatus: true,
      showReadReceipts: true,
      hideLikes: false,
      hideFollowers: false,
      blockedUsers: [],
      mutedUsers: [],
    },
    appearance: {
      theme: "system",
      fontSize: "medium",
      reduceMotion: false,
      highContrast: false,
    },
    feed: {
      algorithm: "recommended",
      showReposts: true,
      showQuotes: true,
      autoPlayVideos: true,
      contentLanguages: ["en"],
      sensitiveContent: false,
    },
    accessibility: {
      altTextReminders: true,
      keyboardShortcuts: false,
      screenReaderOptimized: false,
    },
    storage: {
      autoPlayVideos: "wifi",
      imageQuality: "medium",
      clearCacheOnExit: false,
      downloadOriginals: false,
    },
    updatedAt: Date.now(),
  };
}
