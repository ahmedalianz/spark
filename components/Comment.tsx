import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
type CommentProps = {
  comment: Doc<"comments"> & {
    author: Doc<"users">;
    userHasLiked?: boolean;
  };
  index: number;
  commentInputRef: React.RefObject<TextInput | null>;
  setCommentText: (author: string) => void;
  setReplyingTo: (commentId: Id<"comments">) => void;
};
const Comment = ({
  comment,
  index,
  commentInputRef,
  setCommentText,
  setReplyingTo,
}: CommentProps) => {
  const likeComment = useMutation(api.comments.likeComment);
  //   const getReplies = useMutation(api.replies.getReplies);

  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const isExpanded = expandedComments.has(comment._id);

  const isLongComment = comment.content.length > 120;
  const displayContent =
    isLongComment && !isExpanded
      ? comment.content.slice(0, 120) + "..."
      : comment.content;

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

  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
    Haptics.selectionAsync();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 20).springify()}
      layout={Layout.springify()}
      style={[
        styles.commentCard,
        // comment.parentCommentId && styles.replyCard,
      ]}
    >
      {/*  Header */}
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
            <Text style={styles.commentUsername} numberOfLines={1}>
              {comment.author?.first_name} {comment.author?.last_name}
            </Text>
            {comment.author?.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={Colors.primary}
              />
            )}
            <Text style={styles.commentTime}>
              · {formatTimeAgo(comment._creationTime)}
            </Text>
          </View>

          <Text style={styles.commentText}>{displayContent}</Text>
        </View>
      </View>

      {/*  Footer */}
      <View style={styles.commentFooter}>
        <TouchableOpacity
          style={styles.commentAction}
          onPress={() => handleCommentLike(comment._id)}
        >
          <Ionicons
            name={comment.userHasLiked ? "heart" : "heart-outline"}
            size={14}
            color={comment.userHasLiked ? Colors.accentLike : Colors.textMuted}
          />
          <Text
            style={[
              styles.commentActionText,
              comment.userHasLiked && styles.commentActionTextLiked,
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
            color={Colors.textMuted}
          />
          <Text style={styles.commentActionText}>Reply</Text>
        </TouchableOpacity>

        {isLongComment && (
          <TouchableOpacity onPress={() => toggleCommentExpansion(comment._id)}>
            <Text style={styles.readMoreText}>
              {isExpanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default Comment;
const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLighter,
  },
  replyCard: {
    marginLeft: 36,
    backgroundColor: Colors.backgroundLight,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryLight,
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
    color: Colors.textSecondary,
    maxWidth: "60%",
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.textSecondary,
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
    color: Colors.textMuted,
    fontWeight: "500",
  },
  commentActionTextLiked: {
    color: Colors.accentLike,
  },
  readMoreText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
});
