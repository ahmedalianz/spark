import { api } from "@/convex/_generated/api";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validationUtils";
import { useSignUp } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const useCreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setFieldError = (field: keyof typeof errors, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };
  const isFormValid = (): boolean => {
    const newErrors = {
      name: validateName(formData.name, "Full name") || "",
      email: validateEmail(formData.email) || "",
      password: validatePassword(formData.password) || "",
      confirmPassword:
        validateConfirmPassword(formData.confirmPassword, formData.password) ||
        "",
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== "");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setFieldError(field as keyof typeof errors, "");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const { isLoaded, signUp, setActive } = useSignUp();

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const router = useRouter();

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
  const onDone = async () => {
    if (!isFormValid() || !isLoaded) {
      return;
    }
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await signUp.create({
        firstName: formData.name.split(" ")[0],
        lastName: formData.name.split(" ")[1],
        emailAddress: formData.email,
        password: formData.password,
      });
      if (response.createdSessionId) {
        setActive!({ session: response.createdSessionId });
      }

      if (selectedImage) {
        await updateProfilePicture();
      }

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

  return {
    isLoading,
    selectedImage,
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    setFormData,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
    onDone,
    selectImage,
    handleFieldChange,
  };
};

export default useCreateAccount;
