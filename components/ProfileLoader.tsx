import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProfileLoader() {
  return (
    <View style={styles.loadingMainContainer}>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={[styles.loadingLine, { width: "60%" }]} />
          <View style={styles.loadingLine} />
          <View style={[styles.loadingLine, { width: "60%" }]} />
        </View>
        <View style={styles.loadingAvatar} />
      </View>
      <View style={styles.loadingBioLine} />
    </View>
  );
}
const styles = StyleSheet.create({
  loadingMainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f0f0f0",
  },
  loadingContent: {
    flex: 1,
    gap: 8,
  },
  loadingLine: {
    height: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "80%",
  },
  loadingBioLine: {
    height: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginTop: 20,
  },
});
