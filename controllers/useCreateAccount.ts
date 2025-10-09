import {
  sanitizeInput,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validationUtils";
import { useSignUp } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";

import { useRef, useState } from "react";
import { Alert, Keyboard, ScrollView } from "react-native";

const useCreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const isFormValid = () => {
    const newErrors = {
      firstName: validateName(formData?.firstName) || "",
      lastName: validateName(formData?.lastName) || "",
      email: validateEmail(formData?.email) || "",
      password: validatePassword(formData?.password) || "",
      confirmPassword:
        validateConfirmPassword(
          formData?.password,
          formData?.confirmPassword
        ) || "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };
  const { setActive, isLoaded, signUp } = useSignUp();
  const onDone = async () => {
    await Keyboard.dismiss();
    scrollRef.current?.scrollTo({ animated: true, y: 0 });
    if (!isLoaded || !isFormValid()) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      setIsLoading(true);
      const data = {
        firstName: sanitizeInput(formData?.firstName),
        lastName: sanitizeInput(formData?.lastName),
        emailAddress: sanitizeInput(formData?.email),
        password: sanitizeInput(formData?.password),
      };
      const response = await signUp.create(data);
      if (response.createdSessionId) {
        setActive({ session: response.createdSessionId });
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Failed", "Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    isLoading,
    scrollRef,
    onDone,
    setFormData,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
    handleFieldChange,
  };
};

export default useCreateAccount;
