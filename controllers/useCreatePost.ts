import { api } from "@/convex/_generated/api";
import { CreatePostControllerProps, MediaFile } from "@/types";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const MAX_MEDIA_FILES = 10;

const useCreatePost = ({
  onDismiss,
  initialContent = "",
}: CreatePostControllerProps) => {
  const router = useRouter();

  const [postContent, setPostContent] = useState(initialContent);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 });

  const createPost = useMutation(api.posts.createPost);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsUploading(true);

    try {
      const mediaStorageIds =
        mediaFiles.length > 0 ? await uploadMediaFiles(mediaFiles) : [];

      await createPost({
        content: postContent,
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
      Alert.alert("Error", "Failed to post post. Please try again.");
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
    setPostContent("");
    setMediaFiles([]);
  };

  const handleCancel = () => {
    const hasContent = postContent.trim().length || mediaFiles.length > 0;

    if (hasContent) {
      Alert.alert("Discard post?", "Your changes will be lost.", [
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleContentChange = (text: string) => {
    setPostContent(text);
    if (!isExpanded && text.length > 50) {
      setIsExpanded(true);
    }
  };
  return {
    postContent,
    mediaFiles,
    isUploading,
    uploadProgress,
    isExpanded,
    textSelection,
    handleCancel,
    selectMedia,
    removeMedia,
    uploadMediaFile,
    handleContentChange,
    handleSubmit,
    setTextSelection,
    resetForm,
  };
};

export default useCreatePost;
