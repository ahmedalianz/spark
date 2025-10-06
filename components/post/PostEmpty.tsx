import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PostEmpty = ({ colors }: { colors: ColorsType }) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>
        No comments yet
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
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
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
