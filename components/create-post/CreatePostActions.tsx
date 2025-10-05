import { CreatePostActionsProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CreatePostActions = ({
  mediaFiles,
  selectMedia,
  resetForm,
  MAX_MEDIA_FILES,
  colors,
}: CreatePostActionsProps) => {
  return (
    <View
      style={[
        styles.iconRow,
        {
          borderTopColor: colors.borderLighter,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: colors.tintBlueLight },
          mediaFiles.length >= MAX_MEDIA_FILES && styles.iconButtonDisabled,
        ]}
        onPress={() => selectMedia("library")}
        disabled={mediaFiles.length >= MAX_MEDIA_FILES}
      >
        <Ionicons
          name="images-outline"
          size={22}
          color={
            mediaFiles.length >= MAX_MEDIA_FILES
              ? colors.textDisabled
              : colors.primary
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: colors.tintBlueLight },
          mediaFiles.length >= MAX_MEDIA_FILES && styles.iconButtonDisabled,
        ]}
        onPress={() => selectMedia("camera")}
        disabled={mediaFiles.length >= MAX_MEDIA_FILES}
      >
        <Ionicons
          name="camera-outline"
          size={22}
          color={
            mediaFiles.length >= MAX_MEDIA_FILES
              ? colors.textDisabled
              : colors.primary
          }
        />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        onPress={resetForm}
        style={[
          styles.clearButton,
          {
            backgroundColor: colors.backgroundLight,
          },
        ]}
      >
        <Ionicons name="refresh-outline" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export default CreatePostActions;

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
  spacer: {
    flex: 1,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
