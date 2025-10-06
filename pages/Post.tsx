import {
  PostEmpty,
  PostFooter,
  PostHeader,
  PostInput,
} from "@/components/post/index";
import usePostScreen from "@/controllers/usePostScreen";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useAppTheme from "@/hooks/useAppTheme";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Comment from "../components/post/Comment";

type CommentWithAuthor = Doc<"comments"> & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};

interface CommentsProps {
  postId: Id<"posts">;
}

const Post = ({ postId }: CommentsProps) => {
  const {
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
  } = usePostScreen({ postId });
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
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
          colors,
        }}
      />
    );
  };

  const renderHeader = () => <PostHeader post={post} colors={colors} />;

  const renderFooter = () => {
    if (status !== "LoadingMore") return null;
    return <PostFooter colors={colors} />;
  };

  const renderEmptyState = () => {
    if (status === "LoadingFirstPage") return <ActivityIndicator />;
    return <PostEmpty colors={colors} />;
  };

  return (
    <View
      style={{ paddingTop: top, flex: 1, backgroundColor: colors.background }}
    >
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

        <PostInput
          {...{
            commentText,
            setCommentText,
            isSubmittingComment,
            replyingTo,
            setReplyingTo,
            commentInputRef,
            animatedInputStyle,
            submitComment,
            colors,
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
});
