import { Colors } from "@/constants/Colors";
import { ProfileEmptyConfig, ProfileTabs } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProfileEmpty = ({ activeTab }: { activeTab: ProfileTabs }) => {
  const router = useRouter();
  const emptyConfig: ProfileEmptyConfig = {
    posts: {
      icon: "create-outline",
      title: "No posts yet",
      subtitle: "Share your thoughts with the world",
      actionTitle: "Create First Post",
      action: () => router.push("/(auth)/(modals)/create-post"),
    },
    reposts: {
      icon: "chatbubble-outline",
      title: "No reposts yet",
      subtitle: "Join conversations by replying to posts",
      actionTitle: "Find Posts to Reply",
      action: () => router.push("/(auth)/(tabs)/feed"),
    },
    tagged: {
      icon: "pricetag-outline",
      title: "No tagged posts",
      subtitle: "Posts you're tagged in will appear here",
      actionTitle: "Explore Posts",
      action: () => router.push("/(auth)/(tabs)/feed"),
    },
  };

  const config = emptyConfig[activeTab];

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={config.icon} size={52} color={Colors.borderDisabled} />
      </View>
      <Text style={styles.emptyStateText}>{config.title}</Text>
      <Text style={styles.emptyStateSubtext}>{config.subtitle}</Text>
      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={config.action}
      >
        <Text style={styles.emptyActionText}>{config.actionTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEmpty;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 8,
    fontFamily: "DMSans_600SemiBold",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  emptyActionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyActionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
});
