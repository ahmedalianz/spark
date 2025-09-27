import {
  CreatePostActions,
  CreatePostInput,
  Header,
  MediaFiles,
  UserAvatar,
} from "@/components/create-post";
import { Colors } from "@/constants/Colors";
import useCreatePost from "@/controllers/useCreatePost";
import { useUserInfo } from "@/hooks/useUserInfo";
import { CreatePostProps } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_MEDIA_FILES = 10;

const CreatePost: React.FC<CreatePostProps> = ({
  isPreview,
  onDismiss,
  initialContent = "",
}) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { userInfo } = useUserInfo();

  const {
    postContent,
    mediaFiles,
    isUploading,
    uploadProgress,
    isExpanded,
    resetForm,
    setTextSelection,
    handleCancel,
    selectMedia,
    removeMedia,
    handleContentChange,
    handleSubmit,
  } = useCreatePost({ onDismiss, initialContent });

  return (
    <View style={[styles.container, { paddingTop: isPreview ? 0 : top }]}>
      <Header
        {...{
          handleCancel,
          handleSubmit,
          isUploading,
          uploadProgress,
          postContent,
          mediaFiles,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isPreview && (
          <TouchableOpacity
            onPress={() => router.push("/(auth)/(modals)/create-post")}
            style={styles.previewDisabledContainer}
          />
        )}
        <View style={styles.contentCard}>
          <UserAvatar userInfo={userInfo} />

          <CreatePostInput
            {...{
              postContent,
              handleContentChange,
              isExpanded,
              isPreview,
              setTextSelection,
            }}
          />

          {mediaFiles.length > 0 && (
            <MediaFiles
              {...{
                mediaFiles,
                removeMedia,
                selectMedia,
                MAX_MEDIA_FILES,
              }}
            />
          )}
          {!isPreview && (
            <CreatePostActions
              {...{ mediaFiles, selectMedia, resetForm, MAX_MEDIA_FILES }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },

  previewDisabledContainer: {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "box-only",
    position: "absolute",
  },
});

export default CreatePost;
