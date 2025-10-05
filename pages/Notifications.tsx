import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useAppTheme from "@/hooks/useAppTheme";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, usePaginatedQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  Layout,
  SlideOutLeft,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mockNotifications = [
  {
    _id: "notification_1" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    userId: "user_current" as Id<"users">,
    actorId: "user_john" as Id<"users">,
    type: "like" as const,
    postId: "post_123" as Id<"posts">,
    message: "John Doe liked your post",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    _id: "notification_2" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    userId: "user_current" as Id<"users">,
    actorId: "user_jane" as Id<"users">,
    type: "comment" as const,
    postId: "post_456" as Id<"posts">,
    commentId: "comment_789" as Id<"comments">,
    message: 'Jane Smith commented on your post: "Great insights!"',
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    _id: "notification_3" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    userId: "user_current" as Id<"users">,
    actorId: "user_mike" as Id<"users">,
    type: "follow" as const,
    message: "Mike Johnson started following you",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    _id: "notification_4" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    userId: "user_current" as Id<"users">,
    actorId: "user_sarah" as Id<"users">,
    type: "mention" as const,
    postId: "post_789" as Id<"posts">,
    message: "Sarah Wilson mentioned you in a post",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    _id: "notification_5" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    userId: "user_current" as Id<"users">,
    actorId: "user_alex" as Id<"users">,
    type: "repost" as const,
    postId: "post_101" as Id<"posts">,
    message: "Alex Chen reposted your post",
    isRead: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    _id: "notification_6" as Id<"notifications">,
    _creationTime: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    userId: "user_current" as Id<"users">,
    actorId: null, // System notification
    type: "like" as const,
    message: "Your post received 10 likes today!",
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

type NotificationType =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "mention"
  | "post_share";

type NotificationData = {
  _id: Id<"notifications">;
  _creationTime: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  fromUser: Doc<"users"> | null;
  postId?: Id<"posts">;
  commentId?: Id<"comments">;
  replyId?: Id<"replies">;
};

const Notifications = () => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { colors } = useAppTheme();

  const { status, loadMore } = usePaginatedQuery(
    api.notifications.getNotifications,
    {},
    { initialNumItems: 20 }
  );
  const notifications = mockNotifications;
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationPress = async (notification: NotificationData) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
      case "reply":
        if (notification.postId) {
          router.push(`/(auth)/(modals)/post/${notification.postId}`);
        }
        break;
      case "follow":
        if (notification.fromUser) {
          router.push(
            `/(auth)/(modals)/feed-profile/${notification.fromUser._id}`
          );
        }
        break;
      case "mention":
        if (notification.postId) {
          router.push(`/(auth)/(modals)/post/${notification.postId}`);
        }
        break;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllAsRead();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Error", "Failed to mark all as read");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onLoadMore = useCallback(async () => {
    if (status === "CanLoadMore") {
      await loadMore(10);
    }
  }, [loadMore, status]);

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 20 };

    switch (type) {
      case "like":
        return (
          <Ionicons name="heart" color={colors.accentLike} {...iconProps} />
        );
      case "comment":
        return (
          <Ionicons name="chatbubble" color={colors.primary} {...iconProps} />
        );
      case "reply":
        return (
          <Ionicons name="arrow-undo" color={colors.primary} {...iconProps} />
        );
      case "follow":
        return (
          <Ionicons name="person-add" color={colors.success} {...iconProps} />
        );
      case "mention":
        return <Ionicons name="at" color={colors.warning} {...iconProps} />;
      case "post_share":
        return <Ionicons name="share" color={colors.info} {...iconProps} />;
      default:
        return (
          <Ionicons
            name="notifications"
            color={colors.textMuted}
            {...iconProps}
          />
        );
    }
  };

  const renderNotification = ({
    item,
    index,
  }: {
    item: NotificationData;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 50).springify()}
      layout={Layout.springify()}
      exiting={SlideOutLeft.springify()}
    >
      <TouchableOpacity
        style={[
          styles.notificationCard,
          {
            backgroundColor: colors.white,
            shadowColor: colors.blackPure,
          },
          !item.isRead && {
            backgroundColor: colors.tintBlueLight,
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
          },
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationLeft}>
          <View style={styles.avatarContainer}>
            {item.fromUser ? (
              <Image
                source={{
                  uri:
                    item.fromUser.imageUrl ||
                    `https://ui-avatars.com/api/?name=${item.fromUser.first_name}+${item.fromUser.last_name}&background=random`,
                }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.systemAvatar,
                  { backgroundColor: colors.tintBlueLight },
                ]}
              >
                <Ionicons
                  name="notifications"
                  size={20}
                  color={colors.primary}
                />
              </View>
            )}

            <View
              style={[
                styles.notificationIcon,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
            >
              {getNotificationIcon(item.type)}
            </View>
          </View>
        </View>

        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationMessage,
              { color: colors.textSecondary },
            ]}
          >
            {item.message}
          </Text>
          <Text style={[styles.notificationTime, { color: colors.textMuted }]}>
            {formatTimeAgo(item._creationTime)}
          </Text>
        </View>

        <View style={styles.notificationActions}>
          {!item.isRead && (
            <View
              style={[styles.unreadDot, { backgroundColor: colors.primary }]}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.white,
          borderBottomColor: colors.borderLighter,
        },
      ]}
    >
      <View style={styles.headerTop}>
        <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={[
              styles.markAllButton,
              { backgroundColor: colors.tintBlueLight },
            ]}
            onPress={handleMarkAllAsRead}
          >
            <Text style={[styles.markAllButtonText, { color: colors.primary }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "all" && {
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
            },
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: colors.textMuted },
              filter === "all" && { color: colors.textSecondary },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unread" && {
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
            },
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: colors.textMuted },
              filter === "unread" && { color: colors.textSecondary },
            ]}
          >
            Unread
            {unreadCount > 0 && (
              <Text style={{ color: colors.primary }}> ({unreadCount})</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: colors.backgroundLight },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={64}
          color={colors.textMuted}
        />
      </View>
      <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>
        {filter === "unread"
          ? "No unread notifications"
          : "No notifications yet"}
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
        {filter === "unread"
          ? "All caught up! Check back later for new notifications."
          : "We'll notify you when something happens with your posts and interactions."}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (status !== "LoadingMore") return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Loading more notifications...
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top, backgroundColor: colors.background },
      ]}
    >
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          status === "LoadingFirstPage" ? null : renderEmptyState
        }
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          notifications.length === 0 && { flex: 1 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.white}
          />
        }
      />

      {status === "LoadingFirstPage" && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading notifications...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: "row",
    gap: 24,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: "relative",
  },
  filterTabText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Notification Cards
  notificationCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Avatar and Icon
  notificationLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  systemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  // Content
  notificationContent: {
    flex: 1,
    justifyContent: "center",
  },
  notificationMessage: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },

  // Actions
  notificationActions: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },

  // Loading
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});

export default Notifications;
