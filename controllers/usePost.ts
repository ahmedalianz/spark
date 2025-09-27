import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { FlatList, TextInput } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
type CommentWithAuthor = Doc<"comments"> & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};
const usePost = ({ postId }: { postId: Id<"posts"> }) => {
  const inputScale = useSharedValue(1);
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
    setIsSubmittingComment(true);

    try {
      if (isComment) {
        await addComment({
          postId: postId,
          content: commentText.trim(),
        });
      } else {
        await addReply({
          postId: postId,
          content: commentText.trim(),
          parentCommentId: replyingTo,
        });
        setReplyingTo(undefined);
      }
      setCommentText("");
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
  return {
    commentInputRef,
    flatListRef,
    commentText,
    setCommentText,
    isSubmittingComment,
    replyingTo,
    setReplyingTo,
    post,
    comments,
    status,
    handleLoadMore,
    animatedInputStyle,
    submitComment,
  };
};

export default usePost;
