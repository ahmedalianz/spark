import { ColorsType } from "@/types";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const PostFooter = ({ colors }: { colors: ColorsType }) => {
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
        Loading more comments...
      </Text>
    </View>
  );
};

export default PostFooter;

const styles = StyleSheet.create({
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
});
