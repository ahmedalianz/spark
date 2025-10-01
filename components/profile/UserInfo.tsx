import { Colors } from "@/constants/Colors";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileLoader from "./ProfileSkeleton";

const UserInfo = ({
  isCurrentUserProfile,
  userInfo,
}: {
  userInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (userInfo) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [userInfo]);

  if (!userInfo) {
    return <ProfileLoader />;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {userInfo?.first_name} {userInfo?.last_name}
            </Text>
          </View>
          <Text style={styles.email}>{userInfo?.email}</Text>
        </View>

        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.avatarGradient}
          >
            <Image
              source={{ uri: userInfo?.imageUrl as string }}
              style={styles.avatar}
            />
          </LinearGradient>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text style={styles.bio}>
          {userInfo?.bio || "✨ No bio yet - the mystery adds to the charm"}
        </Text>

        {userInfo?.websiteUrl && (
          <TouchableOpacity style={styles.websiteContainer}>
            <Ionicons name="link-outline" size={16} color={Colors.primary} />
            <Text style={styles.websiteText}>{userInfo.websiteUrl}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {isCurrentUserProfile ? (
          <View style={styles.buttonRow}>
            <Link
              href={`/(auth)/(modals)/edit-profile?biostring=${
                userInfo?.bio ? encodeURIComponent(userInfo?.bio) : ""
              }&linkstring=${userInfo?.websiteUrl ? encodeURIComponent(userInfo?.websiteUrl) : ""}&userId=${
                userInfo?._id
              }&imageUrl=${userInfo?.imageUrl ? encodeURIComponent(userInfo?.imageUrl) : ""}`}
              asChild
            >
              <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={Colors.white}
                  />
                  <Text style={styles.primaryButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="share-outline" size={18} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons
                  name="person-add-outline"
                  size={18}
                  color={Colors.white}
                />
                <Text style={styles.primaryButtonText}>Follow</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconOnlyButton}>
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
    marginRight: 16,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: "DMSans_700Bold",
  },
  email: {
    fontSize: 15,
    color: Colors.textTertiary,
    marginBottom: 16,
    fontFamily: "DMSans_400Regular",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    padding: 3,
    borderRadius: 40,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.borderLighter,
  },

  bioSection: {
    marginBottom: 24,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontFamily: "DMSans_400Regular",
  },
  websiteContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  websiteText: {
    fontSize: 15,
    color: Colors.primary,
    fontFamily: "DMSans_500Medium",
  },
  actionSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLighter,
    paddingTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_500Medium",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: Colors.tintBlueLight,
    borderWidth: 1.5,
    borderColor: Colors.tintBlue,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "DMSans_500Medium",
  },
  iconOnlyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.tintBlueLight,
    borderWidth: 1.5,
    borderColor: Colors.tintBlue,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default UserInfo;
