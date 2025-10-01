import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { ProfileHeaderProps } from "@/types";

const ProfileHeader = ({
  router,
  scrollY,
  userInfo,
  isCurrentUserProfile,
  viewedUserInfo,
  signOutHandler,
}: ProfileHeaderProps) => {
  const headerOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });
  return (
    <Animated.View
      style={[
        styles.animatedHeader,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
        },
        Platform.OS === "android" && { backgroundColor: Colors.primary },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={80}
          tint="prominent"
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.headerButton} onPress={router.back}>
          <Ionicons
            name="chevron-back"
            size={22}
            color={Platform.OS === "android" ? Colors.white : Colors.black}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: Platform.OS === "android" ? Colors.white : Colors.black,
              },
            ]}
          >
            {isCurrentUserProfile
              ? `${userInfo?.first_name} ${userInfo?.last_name}`
              : `${viewedUserInfo?.first_name} ${viewedUserInfo?.last_name}`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push(`/(auth)/(tabs)/notifications`)}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Platform.OS === "android" ? Colors.white : Colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={signOutHandler}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={Platform.OS === "android" ? Colors.white : Colors.black}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === "ios" ? 44 : 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.transparentWhite20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },

  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.transparentWhite10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
