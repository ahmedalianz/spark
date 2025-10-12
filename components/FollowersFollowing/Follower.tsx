import useFollowHandler from "@/hooks/useFollowHandler";
import { ColorsType, FollowWithDetails } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Follower = ({
  following,
  colors,
}: {
  following: FollowWithDetails;
  colors: ColorsType;
}) => {
  const { handleFollowToggle, loading } = useFollowHandler();
  const isFollowing = following.isFollowing;

  return (
    <View
      style={[
        styles.userItem,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Image
        source={{
          uri:
            following?.user?.imageUrl ||
            `https://ui-avatars.com/api/?name=${following.user.first_name}+${following.user.last_name}&background=random`,
        }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.name,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {following?.user?.first_name || "Unknown User"}
        </Text>
        <Text
          style={[
            styles.username,
            {
              color: colors.textTertiary,
            },
          ]}
        >
          @{following?.user?.username || "user"}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing
            ? { backgroundColor: colors.background, borderColor: colors.border }
            : {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
        ]}
        onPress={() => handleFollowToggle(following?.user)}
        disabled={loading}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing
              ? { color: colors.textPrimary }
              : { color: colors.white },
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
    borderBottomWidth: 1,
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
    marginBottom: 0,
  },
  username: {
    fontSize: 13,
  },
  followButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
