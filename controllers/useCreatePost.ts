import { api } from "@/convex/_generated/api";
import { CreatePostControllerProps, MediaFile, UploadError } from "@/types";
import { openDeviceSettings } from "@/utils/openSettings";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

const MAX_MEDIA_FILES = 10;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const COMPRESSION_QUALITY = 0.8;
const MAX_IMAGE_DIMENSION = 2048;

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
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  // Use ref to track upload cancellation
  const uploadCancelledRef = useRef(false);

  /**
   * Compresses an image if it exceeds the maximum file size
   */
  const compressImageIfNeeded = async (
    uri: string
  ): Promise<{ uri: string; compressed: boolean }> => {
    try {
      // If we don't know the size, fetch it
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileSize = fileInfo.size || 0;

      // If file is under 2MB, no compression needed
      if (fileSize <= MAX_FILE_SIZE_BYTES) {
        return { uri, compressed: false };
      }

      console.log(
        `Compressing image: ${(fileSize / 1024 / 1024).toFixed(2)}MB`
      );

      // Get image dimensions
      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], {
        format: ImageManipulator.SaveFormat.JPEG,
      });

      // Calculate new dimensions if image is too large
      const manipulations = [];
      if (
        imageInfo.width > MAX_IMAGE_DIMENSION ||
        imageInfo.height > MAX_IMAGE_DIMENSION
      ) {
        const aspectRatio = imageInfo.width / imageInfo.height;
        let newWidth = imageInfo.width;
        let newHeight = imageInfo.height;

        if (imageInfo.width > imageInfo.height) {
          newWidth = MAX_IMAGE_DIMENSION;
          newHeight = Math.round(MAX_IMAGE_DIMENSION / aspectRatio);
        } else {
          newHeight = MAX_IMAGE_DIMENSION;
          newWidth = Math.round(MAX_IMAGE_DIMENSION * aspectRatio);
        }

        manipulations.push({
          resize: { width: newWidth, height: newHeight },
        });
      }

      // Compress with quality adjustment
      let quality = COMPRESSION_QUALITY;
      let compressedResult = await ImageManipulator.manipulateAsync(
        uri,
        manipulations,
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Check compressed size
      const compressedResponse = await fetch(compressedResult.uri);
      const compressedBlob = await compressedResponse.blob();
      const compressedSize = compressedBlob.size;

      console.log(
        `Compressed: ${(fileSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`
      );

      // If still too large, reduce quality further
      if (compressedSize > MAX_FILE_SIZE_BYTES && quality > 0.5) {
        quality = 0.6;
        compressedResult = await ImageManipulator.manipulateAsync(
          uri,
          manipulations,
          {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        console.log(`Further compressed with quality: ${quality}`);
      }

      return { uri: compressedResult.uri, compressed: true };
    } catch (error) {
      console.error("Compression error:", error);
      // If compression fails, return original
      return { uri, compressed: false };
    }
  };

  /**
   * Handles post submission with proper error handling
   */
  const handleSubmit = async () => {
    if (!postContent.trim() && mediaFiles.length === 0) {
      Alert.alert("Empty Post", "Please add some content or media.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsUploading(true);
    uploadCancelledRef.current = false;

    try {
      const mediaStorageIds =
        mediaFiles.length > 0 ? await uploadMediaFiles(mediaFiles) : [];

      // Check if upload was cancelled
      if (uploadCancelledRef.current) {
        throw new Error("Upload cancelled");
      }

      await createPost({
        content: postContent.trim(),
        mediaFiles: mediaStorageIds,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      resetForm();
      setTimeout(() => {
        if (onDismiss) {
          onDismiss();
        } else {
          router.dismiss();
        }
      }, 150);
    } catch (error: any) {
      console.error("Post submission error:", error);

      if (error.message !== "Upload cancelled") {
        Alert.alert("Error", "Failed to create post. Please try again.", [
          { text: "OK" },
        ]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Uploads multiple media files with progress tracking
   */
  const uploadMediaFiles = async (files: MediaFile[]): Promise<string[]> => {
    const storageIds: string[] = [];
    const errors: UploadError[] = [];
    let completedCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (uploadCancelledRef.current) {
        throw new Error("Upload cancelled");
      }

      try {
        const file = files[i];
        const storageId = await uploadMediaFile(file, i);
        storageIds[i] = storageId;
      } catch (error: any) {
        console.error(`Failed to upload file ${i}:`, error);
        errors.push({
          index: i,
          fileName: files[i].fileName || `Image ${i + 1}`,
          error: error.message || "Unknown error",
        });
      } finally {
        completedCount++;
        setUploadProgress((completedCount / files.length) * 100);
      }
    }

    // Filter out failed uploads
    const successfulUploads = storageIds.filter(Boolean);

    // Show warning if some uploads failed
    if (errors.length > 0 && successfulUploads.length > 0) {
      Alert.alert(
        "Partial Upload",
        `${errors.length} file(s) failed to upload. Continue with ${successfulUploads.length} file(s)?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              uploadCancelledRef.current = true;
              throw new Error("Upload cancelled");
            },
          },
          { text: "Continue", style: "default" },
        ]
      );
    } else if (errors.length > 0 && successfulUploads.length === 0) {
      throw new Error("All uploads failed");
    }

    return successfulUploads;
  };

  /**
   * Uploads a single media file with compression
   */
  const uploadMediaFile = async (
    file: MediaFile,
    index?: number
  ): Promise<string> => {
    try {
      // Compress image if needed
      const { uri: processedUri, compressed } = await compressImageIfNeeded(
        file.uri
      );

      if (compressed) {
        console.log(`Image ${index !== undefined ? index + 1 : ""} compressed`);
      }

      // Generate upload URL
      const postUrl = await generateUploadUrl();

      // Fetch and upload
      const response = await fetch(processedUri);
      const blob = await response.blob();

      const uploadResult = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.mimeType || "image/jpeg" },
        body: blob,
      });

      if (!uploadResult.ok) {
        throw new Error(`Upload failed with status: ${uploadResult.status}`);
      }

      const { storageId } = await uploadResult.json();

      if (!storageId) {
        throw new Error("No storage ID returned");
      }

      return storageId;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Upload failed");
    }
  };

  /**
   * Selects media from camera or library
   */
  const selectMedia = useCallback(
    async (type: "camera" | "library") => {
      if (mediaFiles.length >= MAX_MEDIA_FILES) {
        Alert.alert(
          "Media Limit",
          `You can only add up to ${MAX_MEDIA_FILES} files.`
        );
        return;
      }

      try {
        let result: ImagePicker.ImagePickerResult;

        if (type === "camera") {
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();

          if (!cameraPermission.granted) {
            Alert.alert(
              "Permission Required",
              "Please allow camera access in your device settings.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: openDeviceSettings }, // Link to settings if needed
              ]
            );
            return;
          }

          result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1, // We'll compress ourselves
          });
        } else {
          const libraryPermission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!libraryPermission.granted) {
            Alert.alert(
              "Permission Required",
              "Please allow photo library access in your device settings.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: openDeviceSettings },
              ]
            );
            return;
          }

          result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1, // We'll compress ourselves
            allowsMultipleSelection: true,
            selectionLimit: MAX_MEDIA_FILES - mediaFiles.length,
          });
        }

        if (!result.canceled && result.assets) {
          const remainingSlots = MAX_MEDIA_FILES - mediaFiles.length;
          const assetsToAdd = result.assets.slice(0, remainingSlots);

          const newFiles: MediaFile[] = assetsToAdd.map((asset) => ({
            ...asset,
            id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
            type: "image",
            isUploading: false,
            uploadProgress: 0,
          }));

          setMediaFiles((prev) => [...prev, ...newFiles]);
          Haptics.selectionAsync();
        }
      } catch (error) {
        console.error("Media selection error:", error);
        Alert.alert("Error", "Failed to select media. Please try again.");
      }
    },
    [mediaFiles.length]
  );

  const removeMedia = useCallback((id: string) => {
    setMediaFiles((prev) => prev.filter((file) => file.id !== id));
    Haptics.selectionAsync();
  }, []);

  const resetForm = useCallback(() => {
    setPostContent("");
    setMediaFiles([]);
    setIsExpanded(false);
    setUploadProgress(0);
    uploadCancelledRef.current = false;
  }, []);

  const handleCancel = useCallback(() => {
    const hasContent = postContent.trim().length > 0 || mediaFiles.length > 0;

    if (hasContent) {
      Alert.alert(
        "Discard Post?",
        "Your changes will be lost.",
        [
          {
            text: "Keep Editing",
            style: "cancel",
          },
          {
            text: "Discard",
            onPress: () => {
              resetForm();
              if (onDismiss) onDismiss();
              else router.dismiss();
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    } else {
      if (onDismiss) onDismiss();
      else router.dismiss();
    }
  }, [postContent, mediaFiles.length, onDismiss, router, resetForm]);

  const handleContentChange = useCallback(
    (text: string) => {
      setPostContent(text);
      if (!isExpanded && text.length > 50) {
        setIsExpanded(true);
      }
    },
    [isExpanded]
  );

  const cancelUpload = useCallback(() => {
    uploadCancelledRef.current = true;
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

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
    handleContentChange,
    handleSubmit,
    setTextSelection,
    resetForm,
    cancelUpload,
  };
};

export default useCreatePost;
