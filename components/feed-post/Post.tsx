import { useFeedPost } from "@/controllers/useFeedPost";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ColorsType, PostWithAuthorDetails } from "@/types";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import PostActions from "./PostActions";
import PostEngagement from "./PostEngagement";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostMenuModal from "./PostMenuModal";

interface PostProps {
  post: PostWithAuthorDetails;
  colors: ColorsType;
}

const Post: React.FC<PostProps> = ({ post, colors }) => {
  const { content, mediaFiles, commentCount, author } = post;
  const { userInfo } = useUserInfo();
  const {
    likeCount,
    isLiked,
    menuVisible,
    scaleAnim,
    setMenuVisible,
    handleLike,
    handleOpenComments,
    handleShare,
    handleMenuAction,
  } = useFeedPost(post);

  const isOwnPost = userInfo?._id === author._id;

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <PostHeader
        post={post}
        onMenuPress={() => setMenuVisible(true)}
        colors={colors}
      />

      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.black }]}>
          {content}
        </Text>
        <PostMedia
          mediaFiles={mediaFiles}
          likeCount={likeCount}
          commentCount={commentCount}
          colors={colors}
        />
      </View>

      <PostEngagement
        likeCount={likeCount}
        commentCount={commentCount}
        onCommentsPress={handleOpenComments}
        colors={colors}
      />

      <PostActions
        likeCount={likeCount}
        commentCount={commentCount}
        isLiked={isLiked}
        scaleAnim={scaleAnim}
        onLike={handleLike}
        onComments={handleOpenComments}
        onShare={handleShare}
        colors={colors}
      />

      <PostMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isOwnPost={isOwnPost}
        onMenuAction={handleMenuAction}
        author={post?.author?.first_name || ""}
      />
    </View>
  );
};

export default memo(Post);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: "DMSans_400Regular",
  },
});
