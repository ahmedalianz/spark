import { ActionButton, InputField } from "@/components/create-account";
import useForgotPassword from "@/controllers/useForgotPassword";
import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const {
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
  } = useForgotPassword();

  const renderStep1 = () => (
    <>
      <View style={styles.iconContainer}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.primaryTint }]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={32}
            color={colors.primary}
          />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {
            "Enter your email address and we'll send you a code to reset your password"
          }
        </Text>
      </View>

      <View style={styles.formSection}>
        <InputField
          label="Email Address"
          value={formData.email}
          onChangeText={(value) => handleFieldChange("email", value)}
          placeholder="your@email.com"
          error={errors.email}
          icon="mail-outline"
          colors={colors}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={onSendCode}
          isLoading={isLoading}
          disabled={isLoading}
          colors={colors}
          title="Send Reset Code"
        />
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.iconContainer}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.primaryTint }]}
        >
          <Ionicons name="mail-outline" size={32} color={colors.primary} />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Check Your Email
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We sent a 6-digit code to {formData.email}
        </Text>
      </View>

      <View style={styles.formSection}>
        <InputField
          label="Verification Code"
          value={formData.code}
          onChangeText={(value) => handleFieldChange("code", value)}
          placeholder="Enter 6-digit code"
          error={errors.code}
          icon="key-outline"
          colors={colors}
          keyboardType="number-pad"
          maxLength={6}
        />

        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: colors.textSecondary }]}>
            {"Didn't receive the code?"}
          </Text>
          <TouchableOpacity onPress={resendCode} disabled={countdown > 0}>
            <Text
              style={[
                styles.resendLink,
                { color: countdown > 0 ? colors.textTertiary : colors.primary },
              ]}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={onVerifyCode}
          isLoading={isLoading}
          disabled={isLoading}
          colors={colors}
          title="Verify Code"
        />
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.success + "20" },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={32}
            color={colors.success}
          />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Create New Password
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your code has been verified. Please enter your new password
        </Text>
      </View>

      <View style={styles.formSection}>
        <InputField
          label="New Password"
          value={formData.newPassword}
          onChangeText={(value) => handleFieldChange("newPassword", value)}
          placeholder="Enter new password"
          error={errors.newPassword}
          icon="lock-closed-outline"
          colors={colors}
          secureTextEntry
          rightIcon={
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          }
        />

        <InputField
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChangeText={(value) => handleFieldChange("confirmPassword", value)}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          icon="lock-closed-outline"
          colors={colors}
          secureTextEntry
          rightIcon={
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={onResetPassword}
          isLoading={isLoading}
          disabled={isLoading}
          colors={colors}
          title="Reset Password"
        />
      </View>
    </>
  );

  const renderSuccess = () => (
    <>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.success + "20" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Password Reset!
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your password has been successfully reset. You will be Automatically
          signed in with your new password.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={handleGoToFeed}
          isLoading={false}
          disabled={false}
          colors={colors}
          title="Go To Your Profile"
        />
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottom + 20 },
          ]}
        >
          {/* Step Indicator */}
          {step !== "success" && (
            <View style={styles.stepIndicator}>
              <View
                style={[styles.stepDot, { backgroundColor: colors.primary }]}
              />
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: step >= 2 ? colors.primary : colors.border,
                  },
                ]}
              />
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: step >= 2 ? colors.primary : colors.border,
                  },
                ]}
              />
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: step >= 3 ? colors.primary : colors.border,
                  },
                ]}
              />
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: step >= 3 ? colors.primary : colors.border,
                  },
                ]}
              />
            </View>
          )}

          {/* Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === "success" && renderSuccess()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    flex: 1,
    height: 2,
    maxWidth: 40,
    marginHorizontal: 8,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  formSection: {
    gap: 20,
    marginBottom: 32,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  resendLink: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default ForgotPassword;
