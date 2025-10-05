import { MediaPreviewProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const MediaPreview = ({ file, removeMedia, colors }: MediaPreviewProps) => {
  return (
    <View
      key={file.id}
      style={[styles.mediaContainer, { shadowColor: colors.black }]}
    >
      {file.type === "image" && (
        <Image source={{ uri: file.uri }} style={styles.mediaImage} />
      )}

      {file.isUploading && (
        <View
          style={[
            styles.uploadingOverlay,
            { backgroundColor: colors.transparentBlack70 },
          ]}
        >
          <View
            style={[
              styles.uploadProgress,
              { backgroundColor: colors.transparentWhite30 },
            ]}
          >
            <View
              style={[
                styles.uploadProgressBar,
                {
                  width: `${file.uploadProgress || 0}%`,
                  backgroundColor: colors.white,
                },
              ]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.deleteIconContainer,
          { backgroundColor: colors.transparentBlack70 },
        ]}
        onPress={() => removeMedia(file.id)}
      >
        <Ionicons name="close" size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  mediaContainer: {
    position: "relative",
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 16,
    padding: 8,
    zIndex: 10,
  },
  mediaImage: {
    width: 120,
    height: 160,
    borderRadius: 16,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  uploadProgress: {
    width: "80%",
    height: 4,
    borderRadius: 2,
  },
  uploadProgressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
