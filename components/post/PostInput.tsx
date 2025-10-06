import { PostInputProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

const PostInput = ({
  commentText,
  isSubmittingComment,
  replyingTo,
  commentInputRef,
  animatedInputStyle,
  colors,
  setCommentText,
  setReplyingTo,
  submitComment,
}: PostInputProps) => {
  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.white,
          borderTopColor: colors.borderLight,
        },
      ]}
    >
      {replyingTo && (
        <Animated.View
          entering={SlideInRight}
          style={[
            styles.replyingIndicator,
            {
              backgroundColor: colors.tintBlueLight,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setReplyingTo(undefined);
              setCommentText("");
            }}
            style={styles.replayingContainer}
          >
            <Text
              style={[styles.replyingText, { color: colors.primary }]}
              numberOfLines={1}
            >
              Replying to comment
            </Text>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.inputRow}>
        <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
          <TextInput
            ref={commentInputRef}
            style={[
              styles.textInput,
              {
                borderColor: colors.borderLight,
                color: colors.textSecondary,
                backgroundColor: colors.backgroundLight,
              },
            ]}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textMuted}
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
            { backgroundColor: colors.primary },
            (!commentText.trim() || isSubmittingComment) && [
              styles.sendButtonDisabled,
              { backgroundColor: colors.textDisabled },
            ],
          ]}
          onPress={submitComment}
          disabled={!commentText.trim() || isSubmittingComment}
        >
          {isSubmittingComment ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="send" size={16} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  replyingIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  replayingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyingText: {
    fontSize: 12,
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
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    // backgroundColor handled inline
  },
});

export default PostInput;
