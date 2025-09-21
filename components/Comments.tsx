import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CommentWithAuthor = Doc<"comments"> & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};

interface CommentsProps {
  threadId: Id<"posts">;
}

const Comments = ({ threadId }: CommentsProps) => {
  const commentInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<CommentWithAuthor>>(null);
  const addComment = useMutation(api.comments.addComment);
  const likeComment = useMutation(api.comments.likeComment);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Id<"comments">>();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  const inputScale = useSharedValue(1);
  const { top, bottom } = useSafeAreaInsets();

  const post = useQuery(api.posts.getPostById, { postId: threadId });

  const {
    results: comments,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.comments.getComments,
    { postId: threadId },
    { initialNumItems: 15 }
  );
  console.log("🚀 ~ Comments ~ comments:", comments);

  const submitComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await addComment({
        postId: threadId,
        content: commentText.trim(),
        parentCommentId: replyingTo,
      });

      setCommentText("");
      setReplyingTo(undefined);
      commentInputRef.current?.blur();

      // Scroll to bottom after posting
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Failed to add comment:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  const handleLoadMore = useCallback(async () => {
    if (status === "CanLoadMore") {
      await loadMore(15);
    }
  }, [loadMore, status]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const renderComment: ListRenderItem<CommentWithAuthor> = ({
    item: comment,
    index,
  }) => {
    const isExpanded = expandedComments.has(comment._id);
    const isLongComment = comment.content.length > 120;
    const displayContent =
      isLongComment && !isExpanded
        ? comment.content.slice(0, 120) + "..."
        : comment.content;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 20).springify()}
        layout={Layout.springify()}
        style={[
          styles.commentCard,
          comment.parentCommentId && styles.replyCard,
        ]}
      >
        {/* Compact Header */}
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

        {/* Compact Footer */}
        <View style={styles.commentFooter}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => handleCommentLike(comment._id)}
          >
            <Ionicons
              name={comment.userHasLiked ? "heart" : "heart-outline"}
              size={14}
              color={comment.userHasLiked ? Colors.like : Colors.textMuted}
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
            <TouchableOpacity
              onPress={() => toggleCommentExpansion(comment._id)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.postCard}>
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
            <Text style={styles.postUsername}>
              {post?.author?.first_name} {post?.author?.last_name}
            </Text>
            {post?.author?.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={Colors.primary}
              />
            )}
            <Text style={styles.postTime}>
              · {formatTimeAgo(post?._creationTime || 0)}
            </Text>
          </View>
          <Text style={styles.postContent}>{post?.content}</Text>

          {post?.mediaFiles && post.mediaFiles.length > 0 && (
            <Image
              source={{ uri: post.mediaFiles[0] }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
        </View>
      </View>

      <View style={styles.postStats}>
        <Text style={styles.postStat}>
          {formatCount(post?.likeCount || 0)} likes
        </Text>
        <Text style={styles.postStat}>
          {formatCount(post?.commentCount || 0)} comments
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (status !== "LoadingMore") return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading more comments...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (status === "LoadingFirstPage") return <ActivityIndicator />;
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="chatbubbles-outline"
          size={64}
          color={Colors.textMuted}
        />
        <Text style={styles.emptyStateTitle}>No comments yet</Text>
        <Text style={styles.emptyStateSubtitle}>
          Be the first to leave a comment!
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={10}
        />

        <View style={[styles.inputContainer, { paddingBottom: bottom + 8 }]}>
          {replyingTo && (
            <Animated.View
              entering={SlideInRight}
              style={styles.replyingIndicator}
            >
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(undefined);
                  setCommentText("");
                }}
                style={styles.replayingContainer}
              >
                <Text style={styles.replyingText} numberOfLines={1}>
                  Replying to comment
                </Text>
                <Ionicons name="close" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.inputRow}>
            <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
              <TextInput
                ref={commentInputRef}
                style={styles.textInput}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.textMuted}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={300}
                numberOfLines={1}
              />
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!commentText.trim() || isSubmittingComment) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={submitComment}
              disabled={!commentText.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Ionicons name="send" size={16} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },

  // Post Card - More Compact
  postCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: Colors.black,
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
    color: Colors.textSecondary,
  },
  postTime: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.textSecondary,
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
    borderTopColor: Colors.borderVeryLight,
  },
  postStat: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: "500",
  },

  // Comment Card - Ultra Compact
  commentCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderVeryLight,
  },
  replyCard: {
    marginLeft: 36,
    backgroundColor: Colors.lightBackground,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryLight,
  },
  replayingContainer: { flexDirection: "row", alignItems: "center" },
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
    color: Colors.like,
  },
  readMoreText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },

  // Input Styles
  inputContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  replyingIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.blueTintLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  replyingText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 36,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
    color: Colors.textSecondary,
    backgroundColor: Colors.lightBackground,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textDisabled,
  },

  // Loading & Empty States
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
