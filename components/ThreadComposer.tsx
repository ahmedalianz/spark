import { Colors } from "@/constants/Colors";
import emojis from "@/constants/emojis";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThreadComposerProps = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"threads">;
  onDismiss?: () => void;
  initialContent?: string;
};

type MediaFile = ImagePicker.ImagePickerAsset & {
  id: string;
  type: "image" | "video";
  isUploading?: boolean;
  uploadProgress?: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_MEDIA_FILES = 10;

const ThreadComposer: React.FC<ThreadComposerProps> = ({
  isPreview,
  isReply,
  threadId,
  onDismiss,
  initialContent = "",
}) => {
  const router = useRouter();
  const [threadContent, setThreadContent] = useState(initialContent);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 });

  const { userProfile } = useUserProfile();
  const addThread = useMutation(api.threads.addThread);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const generateUploadUrl = useMutation(api.threads.generateUploadUrl);

  const textInputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsUploading(true);

    try {
      const mediaStorageIds =
        mediaFiles.length > 0 ? await uploadMediaFiles(mediaFiles) : [];

      await addThread({
        threadId,
        content: threadContent,
        mediaFiles: mediaStorageIds,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      resetForm();
      setTimeout(() => {
        if (onDismiss) {
          onDismiss();
        } else router.dismiss();
      }, 150);
    } catch (error) {
      Alert.alert("Error", "Failed to post thread. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMediaFiles = async (files: MediaFile[]): Promise<string[]> => {
    const storageIds: string[] = [];
    let completedCount = 0;

    const uploadPromises = files.map(async (file, index) => {
      try {
        const storageId = await uploadMediaFile(file);
        storageIds[index] = storageId;

        completedCount++;
        setUploadProgress((completedCount / files.length) * 100);

        return storageId;
      } catch (error) {
        console.error(`Failed to upload file ${index}:`, error);
        // Mark this upload as failed but don't stop others
        completedCount++;
        setUploadProgress((completedCount / files.length) * 100);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      return storageIds.filter(Boolean);
    } catch (error) {
      // Some uploads failed, but we might have partial success
      if (storageIds.some((id) => id)) {
        // At least one file uploaded successfully
        console.warn("Partial upload success:", storageIds.filter(Boolean));
      }
      throw error;
    }
  };
  const resetForm = () => {
    setThreadContent("");
    setMediaFiles([]);
  };

  const handleCancel = () => {
    const hasContent = threadContent.trim().length || mediaFiles.length > 0;

    if (hasContent) {
      Alert.alert("Discard thread?", "Your changes will be lost.", [
        {
          text: "Discard",
          onPress: () => {
            resetForm();
            if (onDismiss) onDismiss();
            else router.dismiss();
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } else {
      if (onDismiss) onDismiss();
      else router.dismiss();
    }
  };

  const selectMedia = async (type: "camera" | "library") => {
    if (mediaFiles.length >= MAX_MEDIA_FILES) {
      Alert.alert(
        "Media Limit",
        `You can only add up to ${MAX_MEDIA_FILES} files.`
      );
      return;
    }

    try {
      let result: any;

      switch (type) {
        case "camera":
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!cameraPermission.granted) {
            Alert.alert(
              "Permission needed",
              "Please allow camera access to take photos."
            );
            return;
          }
          result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.8,
            videoMaxDuration: 60,
          });
          break;

        case "library":
          const libraryPermission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!libraryPermission.granted) {
            Alert.alert(
              "Permission needed",
              "Please allow photo library access."
            );
            return;
          }
          result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.8,
            allowsMultipleSelection: true,
            selectionLimit: MAX_MEDIA_FILES - mediaFiles.length,
          });
          break;
      }

      if (!result.canceled && result.assets) {
        const newFiles: MediaFile[] = result.assets.map((asset: any) => ({
          ...asset,
          id: Date.now() + Math.random().toString(),
          type: asset.type?.startsWith("image/") ? "image" : "video",
          isUploading: false,
          uploadProgress: 0,
        }));

        setMediaFiles([...mediaFiles, ...newFiles]);
        Haptics.selectionAsync();
      }
    } catch (error) {
      console.error("Media selection error:", error);
      Alert.alert("Error", "Failed to select media. Please try again.");
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter((file) => file.id !== id));
    Haptics.selectionAsync();
  };

  const uploadMediaFile = async (file: MediaFile): Promise<string> => {
    const postUrl = await generateUploadUrl();
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const uploadResult = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.mimeType || "application/octet-stream" },
      body: blob,
    });

    const { storageId } = await uploadResult.json();
    return storageId;
  };

  const addEmoji = (emoji: string) => {
    const newContent =
      threadContent.slice(0, textSelection.start) +
      emoji +
      threadContent.slice(textSelection.end);
    setThreadContent(newContent);
    Haptics.selectionAsync();
  };

  const handleContentChange = (text: string) => {
    setThreadContent(text);
    if (!isExpanded && text.length > 50) {
      setIsExpanded(true);
    }
  };

  const renderMediaPreview = (file: MediaFile) => {
    return (
      <View key={file.id} style={styles.mediaContainer}>
        {file.type === "image" && (
          <Image source={{ uri: file.uri }} style={styles.mediaImage} />
        )}
        {file.type === "video" && (
          <View style={styles.videoContainer}>
            <Image source={{ uri: file.uri }} style={styles.mediaImage} />
            <View style={styles.videoOverlay}>
              <Ionicons name="play-circle" size={32} color="white" />
            </View>
          </View>
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

  const renderEmojiItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.emojiItem} onPress={() => addEmoji(item)}>
      <Text style={styles.emojiText}>{item}</Text>
    </TouchableOpacity>
  );

  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
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
                !threadContent.trim() &&
                  mediaFiles.length === 0 &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                (!threadContent.trim() && mediaFiles.length === 0) ||
                isUploading
              }
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !threadContent.trim() &&
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentCard}>
          <View style={styles.userSection}>
            <Image
              source={{ uri: userProfile?.imageUrl as string }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {userProfile?.first_name} {userProfile?.last_name}
              </Text>
              <Text style={styles.username}>
                @{userProfile?.username || "username"}
              </Text>
            </View>
          </View>

          <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }]}>
            <TextInput
              ref={textInputRef}
              style={[styles.input, isExpanded && styles.inputExpanded]}
              placeholder={
                isReply ? "Reply to this thread..." : "What's happening?"
              }
              placeholderTextColor={Colors.textMuted}
              value={threadContent}
              onChangeText={handleContentChange}
              onSelectionChange={(e) =>
                setTextSelection(e.nativeEvent.selection)
              }
              multiline
              autoFocus={!isPreview}
              textAlignVertical="top"
              scrollEnabled={false}
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

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Ionicons name="happy-outline" size={22} color={Colors.primary} />
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
        </View>
      </ScrollView>

      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowEmojiPicker(false)}
          />
          <View style={styles.emojiPicker}>
            <View style={styles.emojiHeader}>
              <Text style={styles.emojiTitle}>Add Emoji</Text>
              <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={emojis}
              renderItem={renderEmojiItem}
              numColumns={6}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.emojiGrid}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  uploadingHeader: {
    backgroundColor: Colors.blueTintLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blueTint,
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
    backgroundColor: Colors.lightBackground,
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
    borderTopColor: Colors.borderVeryLight,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blueTintLight,
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
    backgroundColor: Colors.lightBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaScroll: {
    marginBottom: 16,
  },
  mediaScrollContent: {
    paddingRight: 16,
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 16,
    padding: 8,
    zIndex: 10,
  },
  mediaImage: {
    width: 120,
    height: 160,
    borderRadius: 16,
  },
  videoContainer: {
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  uploadProgress: {
    width: "80%",
    height: 4,
    backgroundColor: Colors.white30,
    borderRadius: 2,
  },
  uploadProgressBar: {
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 2,
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
    backgroundColor: Colors.blueTintLight,
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
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButtonText: {
    color: Colors.textTertiary,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  emojiPicker: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.5,
    paddingTop: 16,
  },
  emojiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  emojiTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  emojiGrid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emojiItem: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: Colors.lightBackground,
    margin: 4,
    maxWidth: "16.66%",
  },
  emojiText: {
    fontSize: 24,
  },
});

export default ThreadComposer;
