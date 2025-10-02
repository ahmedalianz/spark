import { Colors } from "@/constants/Colors";
import { useFeedPost } from "@/controllers/useFeedPost";
import { useUserInfo } from "@/hooks/useUserInfo";
import { PostWithAuthorDetails } from "@/types";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import PostActions from "./PostActions";
import PostEngagement from "./PostEngagement";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostMenuModal from "./PostMenuModal";

interface PostProps {
  post: PostWithAuthorDetails;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { content, mediaFiles, commentCount, author } = post;
  const { userInfo } = useUserInfo();
  const {
    localLikeCount,
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
    <View style={styles.container}>
      <PostHeader post={post} onMenuPress={() => setMenuVisible(true)} />

      <View style={styles.content}>
        <Text style={styles.contentText}>{content}</Text>
        <PostMedia
          mediaFiles={mediaFiles}
          likeCount={localLikeCount}
          commentCount={commentCount}
        />
      </View>

      <PostEngagement
        likeCount={localLikeCount}
        commentCount={commentCount}
        onCommentsPress={handleOpenComments}
      />

      <PostActions
        likeCount={localLikeCount}
        commentCount={commentCount}
        isLiked={isLiked}
        scaleAnim={scaleAnim}
        onLike={handleLike}
        onComments={handleOpenComments}
        onShare={handleShare}
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
    backgroundColor: Colors.white,
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
    color: Colors.black,
    marginBottom: 12,
    fontFamily: "DMSans_400Regular",
  },
});
