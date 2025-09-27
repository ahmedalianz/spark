import { Colors } from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const PostFooter = () => {
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading more comments...</Text>
    </View>
  );
};

export default PostFooter;

const styles = StyleSheet.create({
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
