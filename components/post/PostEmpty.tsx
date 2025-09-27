import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PostEmpty = () => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyStateTitle}>No comments yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Be the first to leave a comment!
      </Text>
    </View>
  );
};

export default PostEmpty;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
