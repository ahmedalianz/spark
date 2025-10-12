import { PostHeaderProps } from "@/types";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  colors,
  onMenuPress,
}) => {
  const { author } = post;

  return (
    <View style={styles.header}>
      <Link href={`/(auth)/(modals)/feed-profile/${author?._id}`} asChild>
        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  author?.imageUrl ||
                  `https://ui-avatars.com/api/?name=${author?.first_name}+${author?.last_name}&background=random`,
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.username, { color: colors.black }]}>
                {author?.first_name} {author?.last_name}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                · {formatTimeAgo(post._creationTime)}
              </Text>
            </View>
            <Text style={[styles.handle, { color: colors.textTertiary }]}>
              @{author?.email?.split("@")[0]}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 4,
    fontFamily: "DMSans_700Bold",
  },
  timestamp: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: "DMSans_400Regular",
  },
  handle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
});

export default PostHeader;
