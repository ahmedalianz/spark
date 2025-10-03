import { Colors } from "@/constants/Colors";
import useFollowHandler from "@/hooks/useFollowHandler";
import { FollowWithDetails } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Follower = ({ following }: { following: FollowWithDetails }) => {
  const { handleFollowToggle, loading } = useFollowHandler();
  const isFollowing = following.isFollowing;

  return (
    <View style={styles.userItem}>
      <Image
        source={{
          uri:
            following?.user?.imageUrl ||
            `https://ui-avatars.com/api/?name=${following.user.first_name}+${following.user.last_name}&background=random`,
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>
          {following?.user?.first_name || "Unknown User"}
        </Text>
        <Text style={styles.username}>
          @{following?.user?.username || "user"}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing ? styles.followingButton : styles.notFollowingButton,
        ]}
        onPress={() => handleFollowToggle(following?.user)}
        disabled={loading}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing
              ? styles.followingButtonText
              : styles.notFollowingButtonText,
          ]}
        >
          {isFollowing ? "Following" : "Follow"}
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
