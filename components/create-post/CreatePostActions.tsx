import { Colors } from "@/constants/Colors";
import { CreatePostActionsProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CreatePostActions = ({
  mediaFiles,
  selectMedia,
  resetForm,
  MAX_MEDIA_FILES,
}: CreatePostActionsProps) => {
  return (
    <View style={styles.iconRow}>
      <TouchableOpacity
        style={[
          styles.iconButton,
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
              ? Colors.textDisabled
              : Colors.primary
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.iconButton,
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
              ? Colors.textDisabled
              : Colors.primary
          }
        />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity onPress={resetForm} style={styles.clearButton}>
        <Ionicons name="refresh-outline" size={20} color={Colors.textMuted} />
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
    borderTopColor: Colors.borderLighter,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.tintBlueLight,
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
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
});
