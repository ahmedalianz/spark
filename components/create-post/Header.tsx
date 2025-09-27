import { Colors } from "@/constants/Colors";
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
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={[
                styles.submitButton,
                !postContent.trim() &&
                  mediaFiles.length === 0 &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                (!postContent.trim() && mediaFiles.length === 0) || isUploading
              }
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !postContent.trim() &&
                    mediaFiles.length === 0 &&
                    styles.submitButtonTextDisabled,
                ]}
              >
                {isUploading ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
        }}
      />

      {isUploading && (
        <View style={styles.uploadingHeader}>
          <Text style={styles.uploadingText}>
            Uploading... {uploadProgress.toFixed(0)}%
          </Text>
          <View style={styles.globalProgressTrack}>
            <View
              style={[
                styles.globalProgressBar,
                { width: `${uploadProgress}%` },
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
    color: Colors.textTertiary,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textDisabled,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  submitButtonTextDisabled: {
    color: Colors.textMuted,
  },
  uploadingHeader: {
    backgroundColor: Colors.tintBlueLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tintBlue,
  },
  uploadingText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
  },
  globalProgressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
  },
  globalProgressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
