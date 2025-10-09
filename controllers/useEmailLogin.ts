import {
  sanitizeInput,
  validateEmail,
  validatePassword,
} from "@/utils/validationUtils";
import { useSignIn } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";

const useEmailLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setActive, isLoaded, signIn } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync("saved_email");
      const savedPassword = await SecureStore.getItemAsync("saved_password");

      if (savedEmail && savedPassword) {
        setFormData((prev) => ({
          ...prev,
          email: savedEmail,
          password: savedPassword,
          rememberMe: true,
        }));
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error);
    }
  };
  const saveCredentials = async () => {
    try {
      await SecureStore.setItemAsync("saved_email", formData?.email);
      await SecureStore.setItemAsync("saved_password", formData?.password);
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  };
  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync("saved_email");
      await SecureStore.deleteItemAsync("saved_password");
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  };
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const isFormValid = () => {
    const newErrors = {
      email: validateEmail(formData?.email) || "",
      password: validatePassword(formData?.password) || "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };
  const onDone = async () => {
    await Keyboard.dismiss();
    if (!isLoaded || !isFormValid()) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      setIsLoading(true);
      const data = {
        identifier: sanitizeInput(formData?.email),
        password: sanitizeInput(formData?.password),
      };
      const response = await signIn.create(data);
      if (response.createdSessionId) {
        if (rememberMe) {
          saveCredentials();
        } else {
          deleteCredentials();
        }
        setActive({ session: response.createdSessionId });
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Login Failed", "Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadSavedCredentials();
  }, []);
  return {
    isLoading,
    showPassword,
    formData,
    errors,
    rememberMe,
    onDone,
    handleFieldChange,
    togglePasswordVisibility,
    toggleRememberMe,
  };
};

export default useEmailLogin;
