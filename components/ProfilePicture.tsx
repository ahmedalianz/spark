import { Colors } from "@/constants/Colors";
import { ProfilePictureProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfilePicture = ({
  isLoading,
  selectImage,
  selectedImage,
  imageUrl,
  colors,
}: ProfilePictureProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
          style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDarker]}
            style={styles.imageGradient}
          >
            <Image
              source={
                !selectedImage?.uri && !imageUrl
                  ? require("../assets/images/spark.webp")
                  : {
                      uri:
                        selectedImage?.uri ||
                        decodeURIComponent(imageUrl || ""),
                    }
              }
              style={styles.profileImage}
            />
          </LinearGradient>
          <View
            style={[
              styles.imageOverlay,
              {
                opacity: 0.8,
              },
            ]}
          >
            <View
              style={[
                styles.overlayBlur,
                {
                  backgroundColor: Colors.transparentBlack50,
                },
              ]}
            >
              <Ionicons name="camera" size={24} color={colors.textDisabled} />
              <Text
                style={[styles.overlayText, { color: colors.textDisabled }]}
              >
                {imageUrl?.length ? "Change Photo" : "Select Photo"}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.imageHint, { color: colors.primary }]}>
        {selectedImage ? "Photo selected" : "Tap to add profile photo"}
      </Text>
    </View>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
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
    fontWeight: "600",
    fontFamily: "DMSans_500Medium",
  },
  imageHint: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
});
