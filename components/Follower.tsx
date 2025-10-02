import { Colors } from "@/constants/Colors";
import { Doc } from "@/convex/_generated/dataModel";
import useFollowHandler from "@/hooks/useFollowHandler";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Follower = ({ user }: { user: Doc<"users"> }) => {
  const { followStatus, handleFollowToggle, loading } = useFollowHandler({
    userId: user._id,
  });

  return (
    <View style={styles.userItem}>
      <Image
        source={{
          uri: user.imageUrl || "https://via.placeholder.com/50",
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.first_name || "Unknown User"}</Text>
        <Text style={styles.username}>@{user.username || "user"}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          followStatus?.isFollowing
            ? styles.followingButton
            : styles.notFollowingButton,
        ]}
        onPress={() => handleFollowToggle(user)}
        disabled={loading}
      >
        <Text
          style={[
            styles.followButtonText,
            followStatus?.isFollowing
              ? styles.followingButtonText
              : styles.notFollowingButtonText,
          ]}
        >
          {followStatus?.isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Follower;

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLighter,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  username: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  followButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  notFollowingButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  followingButtonText: {
    color: Colors.textPrimary,
  },
  notFollowingButtonText: {
    color: Colors.white,
  },
});
