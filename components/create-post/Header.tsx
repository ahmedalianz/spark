import { CreatePostHeaderProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({
  handleCancel,
  handleSubmit,
  isUploading,
  uploadProgress,
  postContent,
  mediaFiles,
  colors,
}: CreatePostHeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Right Side - Post Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            !postContent.trim() &&
              mediaFiles.length === 0 && {
                backgroundColor: colors.textDisabled,
              },
          ]}
          onPress={handleSubmit}
          disabled={
            (!postContent.trim() && mediaFiles.length === 0) || isUploading
          }
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: colors.white },
              !postContent.trim() &&
                mediaFiles.length === 0 && {
                  color: colors.textMuted,
                },
            ]}
          >
            {isUploading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upload Progress Bar */}
      {isUploading && (
        <View
          style={[
            styles.uploadingHeader,
            {
              backgroundColor: colors.tintBlueLight,
              borderBottomColor: colors.tintBlue,
            },
          ]}
        >
          <Text style={[styles.uploadingText, { color: colors.primary }]}>
            Uploading... {uploadProgress.toFixed(0)}%
          </Text>
          <View
            style={[
              styles.globalProgressTrack,
              { backgroundColor: colors.borderLight },
            ]}
          >
            <View
              style={[
                styles.globalProgressBar,
                {
                  width: `${uploadProgress}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  uploadingHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  uploadingText: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "DMSans_600SemiBold",
  },
  globalProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  globalProgressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
