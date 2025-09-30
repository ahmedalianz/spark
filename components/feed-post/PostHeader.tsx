import { Colors } from "@/constants/Colors";
import { PostWithAuthorDetails } from "@/types";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PostHeaderProps {
  post: PostWithAuthorDetails;
  onMenuPress: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onMenuPress }) => {
  const { author } = post;

  return (
    <View style={styles.header}>
      <Link href={`/(auth)/(modals)/feed-profile/${author?._id}`} asChild>
        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: author?.imageUrl }} style={styles.avatar} />
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.username}>
                {author?.first_name} {author?.last_name}
              </Text>
              <Text style={styles.timestamp}>
                · {formatTimeAgo(post._creationTime)}
              </Text>
            </View>
            <Text style={styles.handle}>@{author?.email?.split("@")[0]}</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons
          name="ellipsis-horizontal"
          size={20}
          color={Colors.textMuted}
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
    backgroundColor: Colors.borderLighter,
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
    color: Colors.black,
    marginRight: 4,
    fontFamily: "DMSans_700Bold",
  },
  timestamp: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 4,
    fontFamily: "DMSans_400Regular",
  },
  handle: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
});
export default PostHeader;
