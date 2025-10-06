import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CommentProps } from "@/types";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import Replies from "./Replies";

const Comment = ({
  comment,
  index,
  commentInputRef,
  setCommentText,
  setReplyingTo,
  colors,
}: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [expandedComment, setExpandedComment] = useState(false);
  const isLongComment = comment.content.length > 120;
  const displayContent =
    isLongComment && !expandedComment
      ? comment.content.slice(0, 120) + "..."
      : comment.content;

  const likeComment = useMutation(api.comments.likeComment);

  const handleCommentLike = async (commentId: Id<"comments">) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await likeComment({ commentId });
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleReply = (commentId: Id<"comments">, authorName: string) => {
    setReplyingTo(commentId);
    setCommentText(`@${authorName} `);
    commentInputRef.current?.focus();
    Haptics.selectionAsync();
  };

  const toggleCommentExpansion = () => {
    setExpandedComment(!expandedComment);
    Haptics.selectionAsync();
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hasReplies = comment.replyCount > 0;

  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(index * 20).springify()}
        layout={Layout.springify()}
        style={[
          styles.commentCard,
          {
            backgroundColor: colors.white,
            borderColor: colors.borderLighter,
          },
        ]}
      >
        {/* Comment Header */}
        <View style={styles.commentHeader}>
          <Image
            source={{
              uri:
                comment.author?.imageUrl ||
                `https://ui-avatars.com/api/?name=${comment.author?.first_name}+${comment.author?.last_name}&background=random`,
            }}
            style={styles.commentAvatar}
          />

          <View style={styles.commentHeaderContent}>
            <View style={styles.commentUserRow}>
              <Text
                style={[
                  styles.commentUsername,
                  { color: colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {comment.author?.first_name} {comment.author?.last_name}
              </Text>
              <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                · {formatTimeAgo(comment._creationTime)}
              </Text>
            </View>

            <Text style={[styles.commentText, { color: colors.textSecondary }]}>
              {displayContent}
            </Text>

            {isLongComment && (
              <TouchableOpacity onPress={toggleCommentExpansion}>
                <Text style={[styles.readMoreText, { color: colors.primary }]}>
                  {expandedComment ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Comment Footer */}
        <View style={styles.commentFooter}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => handleCommentLike(comment._id)}
          >
            <Ionicons
              name={comment.userHasLiked ? "heart" : "heart-outline"}
              size={14}
              color={
                comment.userHasLiked ? colors.accentLike : colors.textMuted
              }
            />
            <Text
              style={[
                styles.commentActionText,
                { color: colors.textMuted },
                comment.userHasLiked && [
                  styles.commentActionTextLiked,
                  { color: colors.accentLike },
                ],
              ]}
            >
              {formatCount(comment.likeCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commentAction}
            onPress={() =>
              handleReply(comment._id, comment.author?.first_name || "User")
            }
          >
            <Ionicons
              name="arrow-undo-outline"
              size={14}
              color={colors.textMuted}
            />
            <Text
              style={[styles.commentActionText, { color: colors.textMuted }]}
            >
              Reply
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show Replies Toggle */}
        {hasReplies && (
          <TouchableOpacity
            style={styles.showRepliesButton}
            onPress={toggleReplies}
          >
            <View style={styles.showRepliesContent}>
              <View
                style={[
                  styles.replyConnector,
                  { backgroundColor: colors.borderLight },
                ]}
              />
              <Ionicons
                name={showReplies ? "chevron-up" : "chevron-down"}
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.showRepliesText, { color: colors.primary }]}>
                {showReplies ? "Hide" : "Show"} {comment.replyCount}{" "}
                {comment.replyCount === 1 ? "reply" : "replies"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
      {showReplies && <Replies parentCommentId={comment._id} colors={colors} />}
    </>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentCard: {
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentHeaderContent: {
    flex: 1,
    gap: 4,
  },
  commentUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "60%",
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentActionTextLiked: {
    // color handled inline
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  showRepliesButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  showRepliesContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 4,
  },
  replyConnector: {
    width: 2,
    height: 20,
    marginRight: 4,
  },
  showRepliesText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
