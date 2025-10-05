import { MediaFile, MediaFilesProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import MediaPreview from "./MediaPreview";

const MediaFiles = ({
  mediaFiles,
  removeMedia,
  selectMedia,
  MAX_MEDIA_FILES,
  colors,
}: MediaFilesProps) => {
  const renderMediaPreview = (file: MediaFile) => {
    return <MediaPreview {...{ file, removeMedia, colors }} key={file.id} />;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.mediaScroll}
      contentContainerStyle={styles.mediaScrollContent}
    >
      {mediaFiles.map(renderMediaPreview)}
      {mediaFiles.length < MAX_MEDIA_FILES && (
        <TouchableOpacity
          style={[
            styles.addMediaButton,
            {
              borderColor: colors.primary,
              backgroundColor: colors.tintBlueLight,
            },
          ]}
          onPress={() => selectMedia("library")}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default MediaFiles;

const styles = StyleSheet.create({
  mediaScroll: {
    marginBottom: 16,
  },
  mediaScrollContent: {
    paddingRight: 16,
  },
  addMediaButton: {
    width: 120,
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
});
