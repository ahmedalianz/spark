import { ActionButton, InputField } from "@/components/create-account";
import ProfilePicture from "@/components/ProfilePicture";
import useEditProfile from "@/controllers/useEditProfile";
import useAppTheme from "@/hooks/useAppTheme";
import { EditProfileProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfile = ({ biostring, imageUrl }: EditProfileProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const {
    isLoading,
    isOverLimit,
    selectedImage,
    bioCharacterCount,
    maxBioLength,
    bio,
    setBio,
    onDone,
    selectImage,
  } = useEditProfile({
    biostring,
  });

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
              Update Your Profile
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              You can update your profile picture and bio
            </Text>
          </View>

          {/* Avatar Upload */}
          <ProfilePicture
            selectedImage={selectedImage}
            selectImage={selectImage}
            colors={colors}
            isLoading={isLoading}
            imageUrl={imageUrl}
          />

          {/* Form Fields */}
          <View style={styles.formSection}>
            <InputField
              label="Bio (Optional)"
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              error={isOverLimit ? "Bio exceeds maximum length" : ""}
              icon="text-outline"
              colors={colors}
              multiline
              characterCount={{
                current: bioCharacterCount,
                max: maxBioLength,
              }}
            />
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              A good bio helps others understand who you are
            </Text>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={[styles.buttonContainer, { paddingBottom: bottom + 16 }]}>
          <ActionButton
            onPress={onDone}
            isLoading={isLoading}
            disabled={isLoading || isOverLimit}
            colors={colors}
            title="Update Profile"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;

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
  errorText: {
    fontSize: 14,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "transparent",
  },
});
