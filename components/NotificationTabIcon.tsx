import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { IconType } from "@/types";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const NotificationTabIcon = ({ color, size, focused }: IconType) => {
  const unreadCount =
    useQuery(api.notifications.getUnreadNotificationCount) || 0;
  const badgeScale = useSharedValue(unreadCount > 0 ? 1 : 0);

  useEffect(() => {
    badgeScale.value = withSpring(unreadCount > 0 ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [unreadCount]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <Animated.View style={styles.notificationIconContainer}>
      <Ionicons
        name={focused ? "notifications" : "notifications-outline"}
        size={size}
        color={color}
      />
      {unreadCount > 0 && (
        <Animated.View style={[styles.notificationBadge, badgeAnimatedStyle]}>
          <Text style={styles.notificationBadgeText}>
            {unreadCount > 99 ? "99+" : unreadCount.toString()}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.accentLike,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationTabIcon;
