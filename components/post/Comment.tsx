import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import useCopyText from "@/hooks/useCopyText";
import { CommentProps } from "@/types";
import { Link } from "expo-router";
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
  const { copyText } = useCopyText();
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
  };

  const toggleCommentExpansion = () => {
    setExpandedComment(!expandedComment);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const hasReplies = comment.replyCount > 0;

  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(index * 20)}
        layout={Layout.duration(200)}
        style={[
          styles.commentContainer,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        {/* Comment Content */}
        <View style={styles.commentMain}>
          <Link
            asChild
            href={`/(auth)/(modals)/feed-profile/${comment?.author?._id}`}
          >
            <TouchableOpacity>
              <Image
                source={{
                  uri:
                    comment.author?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${comment.author?.first_name}+${comment.author?.last_name}&background=random`,
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </Link>
          <View style={styles.commentContent}>
            <Link
              asChild
              href={`/(auth)/(modals)/feed-profile/${comment?.author?._id}`}
            >
              <TouchableOpacity style={styles.commentHeader}>
                <Text
                  style={[styles.authorName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {comment.author?.first_name} {comment.author?.last_name}
                </Text>
                <Text
                  style={[styles.commentTime, { color: colors.textTertiary }]}
                >
                  {formatTimeAgo(comment._creationTime)}
                </Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              delayLongPress={500}
              onLongPress={() => copyText(comment.content)}
            >
              <Text style={[styles.commentText, { color: colors.textPrimary }]}>
                {displayContent}
              </Text>
            </TouchableOpacity>

            {/* Actions Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCommentLike(comment._id)}
              >
                <Ionicons
                  name={comment.userHasLiked ? "heart" : "heart-outline"}
                  size={14}
                  color={
                    comment.userHasLiked
                      ? colors.accentLike
                      : colors.iconSecondary
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: colors.textTertiary },
                    comment.userHasLiked && { color: colors.accentLike },
                  ]}
                >
                  {formatCount(comment.likeCount)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleReply(comment._id, comment.author?.first_name || "User")
                }
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={colors.iconSecondary}
                />
                <Text
                  style={[styles.actionText, { color: colors.textTertiary }]}
                >
                  Reply
                </Text>
              </TouchableOpacity>

              {isLongComment && (
                <TouchableOpacity onPress={toggleCommentExpansion}>
                  <Text
                    style={[styles.readMoreText, { color: colors.primary }]}
                  >
                    {expandedComment ? "Show less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Replies Toggle */}
            {hasReplies && (
              <TouchableOpacity
                style={styles.repliesToggle}
                onPress={toggleReplies}
              >
                <View
                  style={[styles.replyLine, { backgroundColor: colors.border }]}
                />
                <Ionicons
                  name={showReplies ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.repliesText, { color: colors.primary }]}>
                  {showReplies ? "Hide" : "Show"} {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {showReplies && <Replies parentCommentId={comment._id} colors={colors} />}
    </>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  commentMain: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  commentTime: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  repliesToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  replyLine: {
    width: 2,
    height: 16,
  },
  repliesText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
});
