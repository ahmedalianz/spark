import { useFeedPost } from "@/controllers/useFeedPost";
import useCopyText from "@/hooks/useCopyText";
import { ColorsType, PostWithAuthorDetails } from "@/types";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";

interface PostProps {
  post: PostWithAuthorDetails;
  colors: ColorsType;
}

const Post: React.FC<PostProps> = ({ post, colors }) => {
  const { content, mediaFiles, commentCount } = post;
  const { copyText } = useCopyText();
  const {
    likeCount,
    isLiked,
    scaleAnim,
    handleLike,
    handleOpenComments,
    handleShare,
    handleShowSheet,
  } = useFeedPost(post);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
        },
      ]}
    >
      <PostHeader post={post} onMenuPress={handleShowSheet} colors={colors} />

      <View style={styles.content}>
        <TouchableOpacity
          onLongPress={() => copyText(content)}
          activeOpacity={0.5}
          delayLongPress={500}
          onPress={handleOpenComments}
        >
          <Text style={[styles.contentText, { color: colors.textPrimary }]}>
            {content}
          </Text>
        </TouchableOpacity>
        <PostMedia
          mediaFiles={mediaFiles}
          likeCount={likeCount}
          commentCount={commentCount}
          colors={colors}
        />
      </View>

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
    </View>
  );
};

export default memo(Post);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 2,
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
