import { EmptyFollowListProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const EmptyList = ({
  searchQuery,
  activeTab,
  colors,
  followStatus,
}: EmptyFollowListProps) => {
  if (followStatus === "LoadingFirstPage") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={[
            styles.loadingText,
            {
              color: colors.textTertiary,
            },
          ]}
        >
          Loading connections...
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
      <Text
        style={[
          styles.emptyStateText,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {searchQuery ? "No users found" : `No ${activeTab} yet`}
      </Text>
      <Text
        style={[
          styles.emptyStateSubtext,
          {
            color: colors.textTertiary,
          },
        ]}
      >
        {!searchQuery && activeTab === "followers"
          ? "When someone follows you, they'll appear here."
          : !searchQuery && activeTab === "following"
            ? "Users you follow will appear here."
            : "Try adjusting your search terms."}
      </Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
});
