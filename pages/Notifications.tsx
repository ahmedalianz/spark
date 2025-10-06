import { api } from "@/convex/_generated/api";
import useAppTheme from "@/hooks/useAppTheme";
import { NotificationType, NotificationWithDetails } from "@/types";
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

const Notifications = () => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { colors } = useAppTheme();

  const {
    results: notifications,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.notifications.getNotifications,
    {},
    { initialNumItems: 12 }
  );
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );
  console.log({ notifications: notifications[1] });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const handleNotificationPress = async (
    notification: NotificationWithDetails
  ) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead({ notificationId: notification._id });
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
      case "reply":
      case "mention":
      case "repost":
        if (notification.postId) {
          router.push(`/(auth)/(modals)/post/${notification.postId}`);
        }
        break;
      case "follow":
        if (notification?.author) {
          router.push(
            `/(auth)/(modals)/feed-profile/${notification?.author?._id}`
          );
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
    item: NotificationWithDetails;
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
            {item?.author ? (
              <Image
                source={{
                  uri:
                    item?.author?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${item?.author?.first_name}+${item?.author?.last_name}&background=random`,
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
