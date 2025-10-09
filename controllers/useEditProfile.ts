import { api } from "@/convex/_generated/api";
import * as Sentry from "@sentry/react-native";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";

const useEditProfile = ({ biostring }: { biostring: string }) => {
  const [bio, setBio] = useState(decodeURIComponent(biostring || ""));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const router = useRouter();

  const bioCharacterCount = bio?.length || 0;
  const maxBioLength = 160;
  const isOverLimit = bioCharacterCount > maxBioLength;

  const onDone = async () => {
    if (bio === decodeURIComponent(biostring || "") && !selectedImage) {
      router.dismiss();
      return;
    }
    if (isOverLimit) {
      Alert.alert(
        "Bio too long",
        `Please keep your bio under ${maxBioLength} characters.`
      );
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await updateUser({
        bio: bio || undefined,
      });

      if (selectedImage) {
        await updateProfilePicture();
      }

      Sentry.captureEvent({
        message: "User Profile updated",
        extra: { bio },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismiss();
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Update Failed", "Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfilePicture = async () => {
    try {
      const postUrl = await generateUploadUrl();
      const response = await fetch(selectedImage!.uri);
      const blob = await response.blob();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.mimeType! },
        body: blob,
      });

      const { storageId } = await result.json();
      await updateImage({ storageId });
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const selectImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Change Profile Picture",
      "Choose how you'd like to update your photo",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: openCamera },
        { text: "Photo Library", onPress: openLibrary },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const openLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (bio !== decodeURIComponent(biostring || "") || selectedImage) {
        Alert.alert(
          "Discard Changes?",
          "You have unsaved changes. Are you sure you want to leave?",
          [
            { text: "Keep Editing", style: "cancel", onPress: () => null },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => router.dismiss(),
            },
          ]
        );
        return true;
      } else {
        router.dismiss();
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [bio, selectedImage, router, biostring]);
  return {
    isLoading,
    isOverLimit,
    selectedImage,
    bioCharacterCount,
    maxBioLength,
    bio,
    setBio,
    onDone,
    selectImage,
  };
};

export default useEditProfile;
