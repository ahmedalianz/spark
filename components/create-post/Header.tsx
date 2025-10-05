import { CreatePostHeaderProps } from "@/types";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({
  handleCancel,
  handleSubmit,
  isUploading,
  uploadProgress,
  postContent,
  mediaFiles,
  colors,
}: CreatePostHeaderProps) => {
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.headerButton}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  { color: colors.textTertiary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
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
          ),
          headerTitle: "",
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />

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
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontWeight: "700",
    fontSize: 16,
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
  },
  globalProgressTrack: {
    height: 4,
    borderRadius: 2,
  },
  globalProgressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
