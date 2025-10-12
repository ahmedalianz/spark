import useCopyText from "@/hooks/useCopyText";
import { ColorsType, PostWithAuthorDetails } from "@/types";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PostMedia from "../feed-post/PostMedia";

const PostHeader = ({
  post,
  colors,
}: {
  post: PostWithAuthorDetails;
  colors: ColorsType;
}) => {
  const { copyText } = useCopyText();

  return (
    <View style={styles.postContainer}>
      {/* Author Row */}
      <Link href={`/(auth)/(modals)/feed-profile/${post?.author?._id}`} asChild>
        <TouchableOpacity style={styles.authorRow}>
          <Image
            source={{
              uri:
                post?.author?.imageUrl ||
                `https://ui-avatars.com/api/?name=${post?.author?.first_name}+${post?.author?.last_name}&background=random`,
            }}
            style={styles.avatar}
          />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.textPrimary }]}>
              {post?.author?.first_name} {post?.author?.last_name}
            </Text>
            <Text style={[styles.postTime, { color: colors.textTertiary }]}>
              {formatTimeAgo(post?._creationTime || 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      {/* Post Content */}
      <TouchableOpacity
        onLongPress={() => copyText(post?.content)}
        delayLongPress={500}
        activeOpacity={0.5}
      >
        <Text style={[styles.postContent, { color: colors.textPrimary }]}>
          {post?.content}
        </Text>
      </TouchableOpacity>
      {/* Media */}
      <PostMedia
        mediaFiles={post?.mediaFiles || []}
        likeCount={post?.likeCount || 0}
        commentCount={post?.commentCount || 0}
        colors={colors}
      />

      {/* Stats */}
      <View style={[styles.statsContainer, { borderTopColor: colors.border }]}>
        <Text style={[styles.stat, { color: colors.textSecondary }]}>
          {formatCount(post?.likeCount || 0)} likes
        </Text>
        <Text style={[styles.stat, { color: colors.textSecondary }]}>
          {formatCount(post?.commentCount || 0)} comments
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "DMSans_400Regular",
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  stat: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
});

export default PostHeader;
