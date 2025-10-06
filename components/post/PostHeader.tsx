import { ColorsType, PostWithAuthorDetails } from "@/types";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Image, StyleSheet, Text, View } from "react-native";

const PostHeader = ({
  post,
  colors,
}: {
  post: PostWithAuthorDetails;
  colors: ColorsType;
}) => {
  return (
    <View
      style={[
        styles.postCard,
        {
          backgroundColor: colors.white,
          shadowColor: colors.black,
        },
      ]}
    >
      <View style={styles.postHeader}>
        <Image
          source={{
            uri:
              post?.author?.imageUrl ||
              `https://ui-avatars.com/api/?name=${post?.author?.first_name}+${post?.author?.last_name}&background=random`,
          }}
          style={styles.postAvatar}
        />
        <View style={styles.postHeaderContent}>
          <View style={styles.postUserRow}>
            <Text
              style={[styles.postUsername, { color: colors.textSecondary }]}
            >
              {post?.author?.first_name} {post?.author?.last_name}
            </Text>
            <Text style={[styles.postTime, { color: colors.textMuted }]}>
              · {formatTimeAgo(post?._creationTime || 0)}
            </Text>
          </View>
          <Text style={[styles.postContent, { color: colors.textSecondary }]}>
            {post?.content}
          </Text>

          {post?.mediaFiles && post.mediaFiles.length > 0 && (
            <Image
              source={{ uri: post.mediaFiles[0] }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
        </View>
      </View>

      <View
        style={[styles.postStats, { borderTopColor: colors.borderLighter }]}
      >
        <Text style={[styles.postStat, { color: colors.textTertiary }]}>
          {formatCount(post?.likeCount || 0)}{" "}
          {(post?.likeCount || 0) > 1 ? "likes" : "like"}
        </Text>
        <Text style={[styles.postStat, { color: colors.textTertiary }]}>
          {formatCount(post?.commentCount || 0)}{" "}
          {(post?.commentCount || 0) > 1 ? "comments" : "comment"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 14,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postHeaderContent: {
    flex: 1,
    gap: 6,
  },
  postUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  postUsername: {
    fontSize: 15,
    fontWeight: "600",
  },
  postTime: {
    fontSize: 13,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 8,
  },
  postStats: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  postStat: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default PostHeader;
