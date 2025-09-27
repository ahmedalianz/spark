import { Header, MediaPreview } from "@/components/create-post";
import { Colors } from "@/constants/Colors";
import useCreatePost from "@/controllers/useCreatePost";
import { useUserInfo } from "@/hooks/useUserInfo";
import { CreatePostProps, MediaFile } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const textInputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

  const renderMediaPreview = (file: MediaFile) => {
    return <MediaPreview {...{ file, removeMedia }} />;
  };

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
          <View style={styles.userSection}>
            <Image
              source={{ uri: userInfo?.imageUrl as string }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {userInfo?.first_name} {userInfo?.last_name}
              </Text>
              <Text style={styles.username}>
                @{userInfo?.email?.split("@")[0]}
              </Text>
            </View>
          </View>

          <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }]}>
            <TextInput
              ref={textInputRef}
              style={[
                styles.input,
                isExpanded && styles.inputExpanded,
                isPreview && styles.inputPreview,
              ]}
              placeholder={"What's happening?"}
              placeholderTextColor={Colors.textMuted}
              value={postContent}
              onChangeText={handleContentChange}
              onSelectionChange={(e) =>
                setTextSelection(e.nativeEvent.selection)
              }
              multiline
              autoFocus={!isPreview}
              textAlignVertical="top"
              scrollEnabled={false}
              editable={!isPreview}
            />
          </Animated.View>

          {mediaFiles.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mediaScroll}
              contentContainerStyle={styles.mediaScrollContent}
            >
              {mediaFiles.map(renderMediaPreview)}
              {mediaFiles.length < MAX_MEDIA_FILES && (
                <TouchableOpacity
                  style={styles.addMediaButton}
                  onPress={() => selectMedia("library")}
                >
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
          {!isPreview && (
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  mediaFiles.length >= MAX_MEDIA_FILES &&
                    styles.iconButtonDisabled,
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
                  mediaFiles.length >= MAX_MEDIA_FILES &&
                    styles.iconButtonDisabled,
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
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
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
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  input: {
    fontSize: 18,
    lineHeight: 28,
    color: Colors.textSecondary,
    minHeight: 100,
    marginBottom: 20,
    fontWeight: "400",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    textAlignVertical: "top",
  },
  inputExpanded: {
    minHeight: 160,
  },
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
    borderColor: Colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.tintBlueLight,
  },
  inputPreview: {
    minHeight: 40,
    marginBottom: 0,
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
