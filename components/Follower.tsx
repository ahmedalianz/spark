import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Follower = ({ user }: { user: Doc<"users"> }) => {
  const followStatus = useQuery(api.follows.checkFollowStatus, {
    userId: user._id,
  });
  const followUser = useMutation(api.follows.followUser);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (targetUser: Doc<"users">) => {
    setLoading(true);
    try {
      await followUser({
        userId: targetUser._id,
      });
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };
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
    paddingVertical: 12, // Slightly reduced vertical padding for tighter look
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLighter, // Lighter divider
  },
  avatar: {
    width: 44, // Slightly smaller avatar
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
    marginBottom: 0, // Removed gap
  },
  username: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  followButton: {
    paddingHorizontal: 18,
    paddingVertical: 8, // Adjusted padding
    borderRadius: 25, // Rounded button
    borderWidth: 1,
    minWidth: 100, // Ensure consistent width
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: Colors.background, // Muted background when following
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
    color: Colors.textPrimary, // Darker text for "Following"
  },
  notFollowingButtonText: {
    color: Colors.white,
  },
});
