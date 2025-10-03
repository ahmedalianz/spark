import { Colors } from "@/constants/Colors";
import { EmptyFollowListProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EmptyList = ({ searchQuery, activeTab }: EmptyFollowListProps) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyStateText}>
        {searchQuery ? "No users found" : `No ${activeTab} yet`}
      </Text>
      <Text style={styles.emptyStateSubtext}>
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
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 20,
  },
});
