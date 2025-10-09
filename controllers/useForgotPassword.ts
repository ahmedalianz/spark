import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/utils/validationUtils";
import { useSignIn } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

const useForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  const handleGoToFeed = useCallback(
    () => () => {
      router.push("/(auth)/(tabs)/profile");
    },
    [router]
  );
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => handleGoToFeed(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, handleGoToFeed]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.code.trim()) {
      setErrors((prev) => ({ ...prev, code: "Verification code is required" }));
      return false;
    }
    if (formData.code.length !== 6) {
      setErrors((prev) => ({ ...prev, code: "Code must be 6 digits" }));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const newPasswordError = validatePassword(formData.newPassword);
    const confirmPasswordError = validateConfirmPassword(
      formData.newPassword,
      formData.confirmPassword
    );

    const newErrors = {
      newPassword: newPasswordError || "",
      confirmPassword: confirmPasswordError || "",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const onSendCode = async () => {
    if (!validateStep1() || !isLoaded) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);

    try {
      // Prepare password reset
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: formData.email,
      });

      setStep(2);
      setCountdown(60); // Start 60-second countdown
      Alert.alert("Code Sent", "Check your email for the verification code.");
    } catch (error: any) {
      console.error("Send code failed:", JSON.stringify(error, null, 2));

      if (error.errors) {
        const clerkError = error.errors[0];
        if (clerkError.code === "form_identifier_not_found") {
          Alert.alert("Error", "No account found with this email address.");
        } else {
          Alert.alert(
            "Error",
            clerkError.longMessage || "Failed to send code. Please try again."
          );
        }
      } else {
        Alert.alert("Error", "Failed to send code. Please try again.");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!validateStep2() || !isLoaded) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);

    try {
      // Attempt to reset password with the code
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: formData.code,
      });

      if (result.status === "needs_new_password") {
        setStep(3);
        Alert.alert("Code Verified", "Please enter your new password.");
      } else {
        throw new Error("Verification failed");
      }
    } catch (error: any) {
      console.error("Verify code failed:", JSON.stringify(error, null, 2));

      if (error.errors) {
        const clerkError = error.errors[0];
        Alert.alert(
          "Error",
          clerkError.longMessage ||
            "Invalid verification code. Please try again."
        );
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again.");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!validateStep3() || !isLoaded) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLoading(true);

    try {
      // Reset the password
      const result = await signIn.resetPassword({
        password: formData.newPassword,
      });

      if (result.status === "complete") {
        setStep("success");
        Alert.alert("Success", "Your password has been reset successfully!");
      } else {
        throw new Error("Password reset failed");
      }
    } catch (error: any) {
      console.error("Reset password failed:", JSON.stringify(error, null, 2));

      if (error.errors) {
        const clerkError = error.errors[0];
        Alert.alert(
          "Error",
          clerkError.longMessage ||
            "Failed to reset password. Please try again."
        );
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0 || !isLoaded) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: formData.email,
      });

      setCountdown(60);
      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email."
      );
    } catch (error: any) {
      console.error("Resend code failed:", error);
      Alert.alert("Error", "Failed to resend code. Please try again.");
    }
  };

  return {
    isLoading,
    step,
    formData,
    countdown,
    showConfirmPassword,
    showPassword,
    errors,
    onSendCode,
    onVerifyCode,
    onResetPassword,
    handleFieldChange,
    handleGoToFeed,
    resendCode,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
  };
};

export default useForgotPassword;
