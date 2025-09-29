import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileFooter = ({
  posts,
  status,
  handleLoadMore,
}: {
  posts: any;
  status: any;
  handleLoadMore: any;
}) => {
  if (status === "LoadingMore") {
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={Colors.primary} size="small" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  }

  if (status === "CanLoadMore") {
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
        <Ionicons name="chevron-down" size={16} color={Colors.primary} />
      </TouchableOpacity>
    );
  }

  if (posts && posts.length > 0 && status === "Exhausted") {
    return (
      <View style={styles.endMessage}>
        <Ionicons name="checkmark-done" size={20} color={Colors.textMuted} />
        <Text style={styles.endMessageText}>{"You've reached the end"}</Text>
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
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: Colors.tintBlueLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.tintBlue,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 15,
    color: Colors.primary,
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
    color: Colors.textMuted,
    fontFamily: "DMSans_400Regular",
  },
});
