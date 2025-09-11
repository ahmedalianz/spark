import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfilePage = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: string;
    imageUrl: string;
  }>();

  const { top } = useSafeAreaInsets();
  const [bio, setBio] = useState(decodeURIComponent(biostring || ""));
  const [link, setLink] = useState(decodeURIComponent(linkstring || ""));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const bioCharacterCount = bio?.length || 0;
  const maxBioLength = 160;
  const isOverLimit = bioCharacterCount > maxBioLength;

  const onDone = async () => {
    if (
      bio === decodeURIComponent(biostring || "") &&
      link === decodeURIComponent(linkstring || "") &&
      !selectedImage
    ) {
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
        websiteUrl: link || undefined,
      });

      if (selectedImage) {
        await updateProfilePicture();
      }

      Sentry.captureEvent({
        message: "User Profile updated",
        extra: { bio, link },
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

  const handleCancel = () => {
    if (
      bio !== decodeURIComponent(biostring || "") ||
      link !== decodeURIComponent(linkstring || "") ||
      selectedImage
    ) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.dismiss(),
          },
        ]
      );
    } else {
      router.dismiss();
    }
  };

  const animateImagePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Custom Header */}
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
        {/* Profile Picture Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            onPress={() => {
              animateImagePress();
              selectImage();
            }}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.imageContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.imageGradient}
              >
                <Image
                  source={{
                    uri:
                      selectedImage?.uri || decodeURIComponent(imageUrl || ""),
                  }}
                  style={styles.profileImage}
                />
              </LinearGradient>
              <View
                style={[
                  styles.imageOverlay,
                  {
                    opacity: Platform.OS === "ios" ? 0 : 0.8,
                  },
                ]}
              >
                <BlurView intensity={50} tint="dark" style={styles.overlayBlur}>
                  <Ionicons name="camera" size={24} color={Colors.white} />
                  <Text style={styles.overlayText}>Change Photo</Text>
                </BlurView>
              </View>
            </Animated.View>
          </TouchableOpacity>
          {selectedImage && (
            <Text style={styles.imageHint}>New photo selected</Text>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Bio Section */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <Text
                style={[
                  styles.characterCount,
                  isOverLimit && styles.overLimitText,
                ]}
              >
                {bioCharacterCount}/{maxBioLength}
              </Text>
            </View>
            <View style={[styles.inputContainer, styles.bioContainer]}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself..."
                placeholderTextColor={Colors.textMuted}
                numberOfLines={4}
                multiline
                textAlignVertical="top"
                style={[styles.textInput, styles.bioInput]}
                maxLength={maxBioLength + 20} // Allow some overflow for warning
              />
            </View>
            {isOverLimit && (
              <Text style={styles.errorText}>Bio exceeds maximum length</Text>
            )}
          </View>

          {/* Link Section */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Website</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons
                  name="link-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <TextInput
                value={link}
                onChangeText={setLink}
                placeholder="https://yourwebsite.com"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={[styles.textInput, styles.linkInput]}
              />
              {link ? (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setLink("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.textDisabled}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Profile Tips</Text>
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
            <Text style={styles.tipText}>
              A good bio helps others understand who you are
            </Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="link-outline" size={16} color={Colors.primary} />
            <Text style={styles.tipText}>
              Share your website or portfolio to showcase your work
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
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
    backgroundColor: Colors.white20,
  },
  doneButton: {
    backgroundColor: Colors.white30,
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
  imageSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  imageGradient: {
    padding: 4,
    borderRadius: 65,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.borderVeryLight,
  },
  imageOverlay: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 60,
    overflow: "hidden",
  },
  overlayBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  overlayText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "600",
    fontFamily: "DMSans_500Medium",
  },
  imageHint: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: "DMSans_700Bold",
  },
  characterCount: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: "DMSans_400Regular",
  },
  overLimitText: {
    color: Colors.like,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blueTintLight,
    borderWidth: 2,
    borderColor: Colors.blueTint,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bioContainer: {
    alignItems: "flex-start",
    minHeight: 100,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontFamily: "DMSans_400Regular",
  },
  bioInput: {
    textAlignVertical: "top",
    minHeight: 76,
  },
  linkInput: {
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.like,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
  tipsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.blueTintLight,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 12,
    fontFamily: "DMSans_700Bold",
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textTertiary,
    lineHeight: 20,
    fontFamily: "DMSans_400Regular",
  },
  bottomSpacing: {
    height: 40,
  },
});
