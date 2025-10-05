import { CreatePostInputProps } from "@/types";
import React, { useRef } from "react";
import { Animated, StyleSheet, TextInput } from "react-native";

const CreatePostInput = ({
  postContent,
  handleContentChange,
  isExpanded,
  isPreview,
  setTextSelection,
  colors,
}: CreatePostInputProps) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const textInputRef = useRef<TextInput>(null);

  return (
    <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }]}>
      <TextInput
        ref={textInputRef}
        style={[
          styles.input,
          {
            color: colors.textSecondary,
            backgroundColor: colors.backgroundLight,
          },
          isExpanded && styles.inputExpanded,
          isPreview && styles.inputPreview,
        ]}
        placeholder={"What's happening?"}
        placeholderTextColor={colors.textMuted}
        value={postContent}
        onChangeText={handleContentChange}
        onSelectionChange={(e) => setTextSelection(e.nativeEvent.selection)}
        multiline
        autoFocus={!isPreview}
        textAlignVertical="top"
        scrollEnabled={false}
        editable={!isPreview}
      />
    </Animated.View>
  );
};

export default CreatePostInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    lineHeight: 28,
    minHeight: 100,
    marginBottom: 20,
    fontWeight: "400",
    borderRadius: 12,
    padding: 16,
    textAlignVertical: "top",
  },
  inputExpanded: {
    minHeight: 160,
  },
  inputPreview: {
    minHeight: 40,
    marginBottom: 0,
  },
});
