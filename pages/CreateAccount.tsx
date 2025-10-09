import {
  ActionButton,
  FormGuidance,
  InputField,
} from "@/components/create-account";
import useCreateAccount from "@/controllers/useCreateAccount";
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

const CreateAccount = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const {
    isLoading,
    showPassword,
    showConfirmPassword,
    formData,
    scrollRef,
    errors,
    onDone,
    handleFieldChange,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
  } = useCreateAccount();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
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
              Create Your Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join our community and start your journey
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.namesContainer}>
              <InputField
                label="First Name"
                value={formData?.firstName}
                onChangeText={(value) => handleFieldChange("firstName", value)}
                placeholder="First Name"
                error={errors.firstName}
                icon="person-outline"
                colors={colors}
                autoCapitalize="words"
              />
              <InputField
                label="Last Name"
                value={formData?.lastName}
                onChangeText={(value) => handleFieldChange("lastName", value)}
                placeholder="Last Name"
                error={errors.lastName}
                icon="person-outline"
                colors={colors}
                autoCapitalize="words"
              />
            </View>

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
              placeholder="Create a strong password"
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

            <InputField
              label="Confirm Password"
              value={formData?.confirmPassword}
              onChangeText={(value) =>
                handleFieldChange("confirmPassword", value)
              }
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              icon="lock-closed-outline"
              autoCapitalize="none"
              colors={colors}
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* Guidance Section */}
          <FormGuidance colors={colors} />
        </ScrollView>

        {/* Action Button */}
        <View style={[styles.buttonContainer, { paddingBottom: bottom + 16 }]}>
          <ActionButton
            onPress={onDone}
            isLoading={isLoading}
            disabled={isLoading}
            colors={colors}
            title="Create Account"
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
    marginBottom: 24,
  },
  namesContainer: {
    flexDirection: "row",
    gap: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
});

export default CreateAccount;
