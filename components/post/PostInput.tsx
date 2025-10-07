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
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {replyingTo && (
        <Animated.View
          entering={SlideInRight}
          style={[
            styles.replyingIndicator,
            {
              backgroundColor: colors.primaryTint,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setReplyingTo(undefined);
              setCommentText("");
            }}
            style={styles.replyingContainer}
          >
            <Text
              style={[styles.replyingText, { color: colors.primary }]}
              numberOfLines={1}
            >
              Replying to comment
            </Text>
            <Ionicons name="close" size={16} color={colors.iconSecondary} />{" "}
            {/* CHANGED: from textMuted to iconSecondary */}
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
                borderColor: colors.border,
                color: colors.textPrimary,
                backgroundColor: colors.backgroundTertiary,
              },
            ]}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textTertiary}
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
            (!commentText.trim() || isSubmittingComment) && {
              backgroundColor: colors.textDisabled,
            },
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
    paddingBottom: 16,
  },
  replyingIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  replyingText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 40,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    fontFamily: "DMSans_400Regular",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
});

export default PostInput;
