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
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_MEDIA_FILES = 10;

const CreatePost: React.FC<CreatePostProps> = ({
  onDismiss,
  initialContent = "",
}) => {
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
        paddingTop: top,
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
        <View
          style={[
            styles.contentCard,
            {
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        >
          <UserAvatar userInfo={userInfo} colors={colors} />

          <CreatePostInput
            {...{
              postContent,
              handleContentChange,
              isExpanded,
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
          <CreatePostActions
            {...{
              mediaFiles,
              selectMedia,
              resetForm,
              MAX_MEDIA_FILES,
              colors,
            }}
          />
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
  },
});

export default CreatePost;
