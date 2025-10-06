import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";
import { getUserWithImage } from "./utils";

export const getNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    let query = ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", currentUser._id));

    const notifications = await query
      .order("desc")
      .paginate(args.paginationOpts);

    const notificationsWithDetails = await Promise.all(
      notifications.page.map(async (notification) => {
        const author = notification.authorId
          ? await getUserWithImage(ctx, notification.authorId)
          : null;

        return {
          ...notification,
          author,
        };
      })
    );

    return {
      ...notifications,
      page: notificationsWithDetails,
    };
  },
});

export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    const notification = await ctx.db.get(args.notificationId);

    if (!notification || notification.userId !== currentUser._id) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return { success: true };
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {},
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("byUserAndRead", (q) =>
        q.eq("userId", currentUser._id).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map(async (notification) => {
        await ctx.db.patch(notification._id, { isRead: true });
      })
    );

    return { success: true, count: unreadNotifications.length };
  },
});

export const getUnreadNotificationCount = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);

    if (!currentUser) return 0;

    const unreadCount = await ctx.db
      .query("notifications")
      .withIndex("byUserAndRead", (q) =>
        q.eq("userId", currentUser._id).eq("isRead", false)
      )
      .collect();

    return unreadCount.length;
  },
});
