import { Doc } from "@/convex/_generated/dataModel";
import useAppTheme from "@/hooks/useAppTheme";
import { PaginationStatue } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const ProfileFooter = ({
  posts,
  status,
}: {
  posts: Doc<"posts">[];
  status: PaginationStatue;
}) => {
  const { colors } = useAppTheme();

  if (status === "LoadingMore") {
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
          Loading more...
        </Text>
      </View>
    );
  }

  if (posts && posts.length > 0 && status === "Exhausted") {
    return (
      <View style={styles.endMessage}>
        <Ionicons name="checkmark-done" size={20} color={colors.textMuted} />
        <Text style={[styles.endMessageText, { color: colors.textMuted }]}>
          {"You've reached the end"}
        </Text>
      </View>
    );
  }

  return null;
};

export default ProfileFooter;

const styles = StyleSheet.create({
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  endMessage: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  endMessageText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
});
