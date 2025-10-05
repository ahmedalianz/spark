import {
  CreatePostActions,
  CreatePostInput,
  Header,
  MediaFiles,
  UserAvatar,
} from "@/components/create-post";
import useCreatePost from "@/controllers/useCreatePost";
import useAppTheme from "@/hooks/useAppTheme";
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
  const { colors } = useAppTheme();
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
    <View
      style={{
        paddingTop: isPreview ? 0 : top,
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <Header
        {...{
          handleCancel,
          handleSubmit,
          isUploading,
          uploadProgress,
          postContent,
          mediaFiles,
          colors,
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
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: colors.white,
              shadowColor: colors.black,
            },
          ]}
        >
          <UserAvatar userInfo={userInfo} colors={colors} />

          <CreatePostInput
            {...{
              postContent,
              handleContentChange,
              isExpanded,
              isPreview,
              setTextSelection,
              colors,
            }}
          />

          {mediaFiles.length > 0 && (
            <MediaFiles
              {...{
                mediaFiles,
                removeMedia,
                selectMedia,
                MAX_MEDIA_FILES,
                colors,
              }}
            />
          )}
          {!isPreview && (
            <CreatePostActions
              {...{
                mediaFiles,
                selectMedia,
                resetForm,
                MAX_MEDIA_FILES,
                colors,
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
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
