import { Colors } from "@/constants/Colors";
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
  setCommentText,
  isSubmittingComment,
  replyingTo,
  setReplyingTo,
  commentInputRef,
  animatedInputStyle,
  submitComment,
}: PostInputProps) => {
  return (
    <View style={styles.inputContainer}>
      {replyingTo && (
        <Animated.View entering={SlideInRight} style={styles.replyingIndicator}>
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
  );
};

const styles = StyleSheet.create({
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
  replayingContainer: { flexDirection: "row", alignItems: "center" },
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
});
export default PostInput;
