import {
  ColorsType,
  PaginationStatue,
  ProfileEmptyConfig,
  ProfileTabs,
} from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileEmpty = ({
  activeTab,
  colors,
  status,
}: {
  activeTab: ProfileTabs;
  colors: ColorsType;
  status: PaginationStatue;
}) => {
  const router = useRouter();
  if (status === "LoadingFirstPage")
    return (
      <View style={styles.firstPageLoading}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
          Loading {activeTab}...
        </Text>
      </View>
    );
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
      <Ionicons name={config.icon} size={52} color={colors.borderDisabled} />
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        {config.title}
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: colors.textMuted }]}>
        {config.subtitle}
      </Text>
      <TouchableOpacity
        style={[styles.emptyActionButton, { backgroundColor: colors.primary }]}
        onPress={config.action}
      >
        <Text style={[styles.emptyActionText, { color: colors.white }]}>
          {config.actionTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEmpty;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    marginTop: 20,
    flex: 1,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
    fontFamily: "DMSans_600SemiBold",
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  emptyActionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  firstPageLoading: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flex: 1,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
});
