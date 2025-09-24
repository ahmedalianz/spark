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
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Comment from "../components/Comment";

type CommentWithAuthor = Doc<"comments"> & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};

interface CommentsProps {
  postId: Id<"posts">;
}

const Comments = ({ postId }: CommentsProps) => {
  const inputScale = useSharedValue(1);
  const { top } = useSafeAreaInsets();
  const commentInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<CommentWithAuthor>>(null);
  const addComment = useMutation(api.comments.addComment);
  const addReply = useMutation(api.replies.addReply);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Id<"comments">>();

  const post = useQuery(api.posts.getPostById, { postId: postId });

  const {
    results: comments,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.comments.getComments,
    { postId: postId },
    { initialNumItems: 15 }
  );

  const handleLoadMore = useCallback(async () => {
    if (status === "CanLoadMore") {
      await loadMore(15);
    }
  }, [loadMore, status]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));
  const submitComment = async () => {
    if (!commentText.trim()) return;
    const isComment = !replyingTo;
    console.log({ isComment });
    setIsSubmittingComment(true);

    try {
      if (isComment) {
        await addComment({
          postId: postId,
          content: commentText.trim(),
        });

        setCommentText("");
      } else {
        await addReply({
          postId: postId,
          content: commentText.trim(),
          parentCommentId: replyingTo,
        });
        setReplyingTo(undefined);
      }
      commentInputRef.current?.blur();

      // Scroll to bottom after posting
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Failed to add comment:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  const renderComment: ListRenderItem<CommentWithAuthor> = ({
    item: comment,
    index,
  }) => {
    return (
      <Comment
        {...{
          setCommentText,
          setReplyingTo,
          comment,
          commentInputRef,
          index,
        }}
      />
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
          {formatCount(post?.likeCount || 0)}{" "}
          {(post?.likeCount || 0) > 1 ? "likes" : "like"}
        </Text>
        <Text style={styles.postStat}>
          {formatCount(post?.commentCount || 0)}{" "}
          {(post?.commentCount || 0) > 1 ? "comments" : "comment"}
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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

        <View style={styles.inputContainer}>
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

  // Post Card
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
    borderTopColor: Colors.borderLighter,
  },
  postStat: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  replayingContainer: { flexDirection: "row", alignItems: "center" },

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
    backgroundColor: Colors.tintBlueLight,
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
    backgroundColor: Colors.backgroundLight,
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
