import { api } from "@/convex/_generated/api";
import useAppTheme from "@/hooks/useAppTheme";
import { NotificationType, NotificationWithDetails } from "@/types";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation, usePaginatedQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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
  const bottomTabHeight = useBottomTabBarHeight();
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

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead),
    [notifications]
  );
  const displayedNotifications = useMemo(
    () => (filter === "all" ? notifications : unreadNotifications),
    [notifications, unreadNotifications, filter]
  );
  const unreadCount = unreadNotifications.length;
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
            backgroundColor: colors.backgroundSecondary,
          },
          !item.isRead && {
            backgroundColor: colors.primaryTint,
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
                  { backgroundColor: colors.backgroundTertiary },
                ]}
              >
                <Ionicons
                  name="notifications"
                  size={20}
                  color={colors.iconPrimary}
                />
              </View>
            )}

            <View
              style={[
                styles.notificationIcon,
                {
                  backgroundColor: colors.background,
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
            style={[styles.notificationMessage, { color: colors.textPrimary }]}
          >
            {item.message}
          </Text>
          <Text
            style={[styles.notificationTime, { color: colors.textTertiary }]}
          >
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
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.headerTop}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={[
              styles.markAllButton,
              { backgroundColor: colors.primaryTint },
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
              { color: colors.textTertiary },
              filter === "all" && { color: colors.textPrimary },
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
              { color: colors.textTertiary },
              filter === "unread" && { color: colors.textPrimary },
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

  const renderEmptyState = () => {
    if (status === "LoadingFirstPage")
      return (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
            Loading notifications...
          </Text>
        </View>
      );
    return (
      <View style={styles.emptyState}>
        <View
          style={[
            styles.emptyIconContainer,
            { backgroundColor: colors.backgroundMuted },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={64}
            color={colors.textMuted}
          />
        </View>
        <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
          {filter === "unread"
            ? "No unread notifications"
            : "No notifications yet"}
        </Text>
        <Text
          style={[styles.emptyStateSubtitle, { color: colors.textTertiary }]}
        >
          {filter === "unread"
            ? "All caught up! Check back later for new notifications."
            : "We'll notify you when something happens with your posts and interactions."}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (status === "LoadingMore")
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
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
        data={displayedNotifications}
        renderItem={renderNotification}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomTabHeight + 20,
          },
        ]}
        keyExtractor={(item) => item._id}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
        windowSize={21}
        maxToRenderPerBatch={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
});

export default Notifications;
