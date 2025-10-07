import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PostEmpty = ({ colors }: { colors: ColorsType }) => {
  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: colors.backgroundMuted },
        ]}
      >
        <Ionicons
          name="chatbubbles-outline"
          size={48}
          color={colors.iconSecondary}
        />
      </View>
      <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
        No comments yet
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textTertiary }]}>
        Be the first to leave a comment!
      </Text>
    </View>
  );
};

export default PostEmpty;

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    flex: 1,
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "DMSans_400Regular",
  },
});
