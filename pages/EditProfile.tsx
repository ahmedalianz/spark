import { FormFields, ProfilePicture, Tips } from "@/components/edit-profile";
import { Colors } from "@/constants/Colors";
import useEditProfile from "@/controllers/useEditProfile";
import { EditProfileProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfile = ({ biostring, linkstring, imageUrl }: EditProfileProps) => {
  const { top } = useSafeAreaInsets();

  const {
    isLoading,
    isOverLimit,
    selectedImage,
    bioCharacterCount,
    maxBioLength,
    bio,
    link,
    setBio,
    setLink,
    onDone,
    selectImage,
    handleCancel,
  } = useEditProfile({
    biostring,
    linkstring,
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: top + 10 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Ionicons name="close" size={24} color={Colors.white} />
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, styles.doneButton]}
            onPress={onDone}
            disabled={isLoading || isOverLimit}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Ionicons name="checkmark" size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProfilePicture
          isLoading={isLoading}
          selectImage={selectImage}
          selectedImage={selectedImage}
          imageUrl={imageUrl}
        />
        <FormFields
          {...{
            isOverLimit,
            bioCharacterCount,
            maxBioLength,
            bio,
            link,
            setBio,
            setLink,
          }}
        />
        <Tips />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.transparentWhite20,
  },
  doneButton: {
    backgroundColor: Colors.transparentWhite30,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_500Medium",
  },
  doneButtonText: {
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSpacing: {
    height: 40,
  },
});
