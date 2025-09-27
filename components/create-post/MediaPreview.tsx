import { Colors } from "@/constants/Colors";
import { MediaPreviewProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const MediaPreview = ({ file, removeMedia }: MediaPreviewProps) => {
  return (
    <View key={file.id} style={styles.mediaContainer}>
      {file.type === "image" && (
        <Image source={{ uri: file.uri }} style={styles.mediaImage} />
      )}

      {file.isUploading && (
        <View style={styles.uploadingOverlay}>
          <View style={styles.uploadProgress}>
            <View
              style={[
                styles.uploadProgressBar,
                { width: `${file.uploadProgress || 0}%` },
              ]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.deleteIconContainer}
        onPress={() => removeMedia(file.id)}
      >
        <Ionicons name="close" size={16} color="white" />
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.transparentBlack70,
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
    backgroundColor: Colors.transparentBlack70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  uploadProgress: {
    width: "80%",
    height: 4,
    backgroundColor: Colors.transparentWhite30,
    borderRadius: 2,
  },
  uploadProgressBar: {
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});
