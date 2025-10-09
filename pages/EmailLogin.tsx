import { ActionButton, InputField } from "@/components/create-account";
import useEmailLogin from "@/controllers/useEmailLogin";
import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EmailLogin = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { colors, barStyleColors } = useAppTheme();
  const {
    isLoading,
    showPassword,
    formData,
    rememberMe,
    errors,
    onDone,
    handleFieldChange,
    togglePasswordVisibility,
    toggleRememberMe,
  } = useEmailLogin();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <StatusBar barStyle={barStyleColors} translucent />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottom + 20 },
          ]}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to your account to continue
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <InputField
              label="Email Address"
              value={formData?.email}
              onChangeText={(value) => handleFieldChange("email", value)}
              placeholder="your@email.com"
              error={errors.email}
              icon="mail-outline"
              colors={colors}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Password"
              value={formData?.password}
              onChangeText={(value) => handleFieldChange("password", value)}
              placeholder="Enter your password"
              error={errors.password}
              icon="lock-closed-outline"
              colors={colors}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
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

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.utilityRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={toggleRememberMe}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: rememberMe
                        ? colors.primary
                        : colors.backgroundSecondary,
                      borderColor: rememberMe ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  )}
                </View>
                <Text
                  style={[
                    styles.rememberMeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Remember me
                </Text>
              </TouchableOpacity>
              <Link asChild href={"/(public)/forgot-password"}>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      { color: colors.primary },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
              {"Don't have an account?"}
            </Text>
            <Link asChild href={"/(public)/create-account"}>
              <TouchableOpacity>
                <Text style={{ ...styles.signUpLink, color: colors.primary }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={[styles.buttonContainer, { paddingBottom: bottom + 16 }]}>
          <ActionButton
            onPress={onDone}
            isLoading={isLoading}
            disabled={isLoading}
            colors={colors}
            title="Sign In"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
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
  utilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberMeText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
});

export default EmailLogin;
