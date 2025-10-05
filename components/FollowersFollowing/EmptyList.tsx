import { EmptyFollowListProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EmptyList = ({
  searchQuery,
  activeTab,
  colors,
}: EmptyFollowListProps) => {
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
    padding: 40,
    marginTop: 60,
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
});
