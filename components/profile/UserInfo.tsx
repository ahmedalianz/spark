import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useFollowHandler from "@/hooks/useFollowHandler";
import { MenuSection } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheetModal from "../BottomSheetModal";

const UserInfo = ({
  isCurrentUserProfile,
  userInfo,
  signOutHandler,
}: {
  userInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  signOutHandler: () => void;
}) => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const handleMenuAction = (action: string) => {
    console.log("Menu action:", action);
    // Handle different actions here
    switch (action) {
      case "share_profile":
        // Implement share profile logic
        break;
      case "toggle_follow":
        // Implement follow/unfollow logic
        break;
      case "report":
        // Implement report logic
        break;
      case "qr_code":
        // Show QR code modal
        break;
      // ... handle other actions
    }
  };
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
  const editProfileRoute: any = `/(auth)/(modals)/edit-profile?biostring=${
    userInfo?.bio ? encodeURIComponent(userInfo?.bio) : ""
  }&linkstring=${userInfo?.websiteUrl ? encodeURIComponent(userInfo?.websiteUrl) : ""}&userId=${
    userInfo?._id
  }&imageUrl=${userInfo?.imageUrl ? encodeURIComponent(userInfo?.imageUrl) : ""}`;
  const otherUserSections = [
    {
      id: "actions",
      data: [
        {
          id: "share",
          iconName: "share-outline",
          title: "Share profile",
          onPress: () => handleMenuAction("share_profile"),
        },
      ],
    },
    {
      id: "moderation",
      showDivider: true,
      data: [
        {
          id: "report",
          iconName: "alert-circle-outline",
          title: `Report ${userInfo?.first_name}`,
          subtitle: "We Are Sorry for this experience",
          onPress: () => handleMenuAction("report"),
        },
        {
          id: "block",
          iconName: "ban-outline",
          title: `Block ${userInfo?.first_name}`,
          subtitle: "You won't be able to see or contact each other",
          isDestructive: true,
          onPress: () => handleMenuAction("block"),
        },
      ],
    },
  ];
  const currentUserSections = [
    {
      id: "account",
      title: "Account",
      data: [
        {
          id: "edit-profile",
          iconName: "person-outline",
          title: "Edit Profile",
          onPress: () => router.push(editProfileRoute),
        },
        {
          id: "privacy",
          iconName: "lock-closed-outline",
          title: "Privacy & Safety",
          subtitle: "Manage your privacy settings",
          onPress: () => router.push("/(auth)/(settings)/privacy"),
        },
        {
          id: "security",
          iconName: "shield-checkmark-outline",
          title: "Security",
          subtitle: "Two-factor authentication, login history",
          onPress: () => router.push("/(auth)/(settings)/security"),
        },
        {
          id: "blocked-users",
          iconName: "ban-outline",
          title: "Blocked Users",
          subtitle: "Manage blocked accounts",
          onPress: () => router.push("/(auth)/(settings)/blocked-users"),
        },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      showDivider: true,
      data: [
        {
          id: "notifications",
          iconName: "notifications-outline",
          title: "Notifications",
          subtitle: "Push, email, and in-app notifications",
          onPress: () => router.push("/(auth)/(settings)/notifications"),
        },
        {
          id: "feed-preferences",
          iconName: "newspaper-outline",
          title: "Feed Preferences",
          subtitle: "Algorithm, content languages",
          onPress: () => router.push("/(auth)/(settings)/feed-preferences"),
        },
        {
          id: "appearance",
          iconName: "color-palette-outline",
          title: "Appearance",
          subtitle: "Theme, font size, reduce motion",
          onPress: () => router.push("/(auth)/(settings)/appearance"),
        },
        {
          id: "accessibility",
          iconName: "accessibility-outline",
          title: "Accessibility",
          subtitle: "Alt text, keyboard shortcuts",
          onPress: () => router.push("/(auth)/(settings)/accessibility"),
        },
      ],
    },
    {
      id: "content",
      title: "Content & Media",
      showDivider: true,
      data: [
        {
          id: "saved-posts",
          iconName: "bookmark-outline",
          title: "Saved Posts",
          subtitle: "Your bookmarked content",
          onPress: () => console.log("Navigate to saved posts"),
        },
        {
          id: "drafts",
          iconName: "document-outline",
          title: "Drafts",
          subtitle: "Your unpublished posts",
          onPress: () => console.log("Navigate to drafts"),
        },
        {
          id: "media-storage",
          iconName: "cloud-download-outline",
          title: "Media & Storage",
          subtitle: "Image quality, cache settings",
          onPress: () => console.log("Navigate to media storage"),
        },
      ],
    },
    {
      id: "support",
      title: "Support & About",
      showDivider: true,
      data: [
        {
          id: "help",
          iconName: "help-circle-outline",
          title: "Help & Support",
          onPress: () => router.push("/(auth)/(settings)/help"),
        },
        {
          id: "about",
          iconName: "information-circle-outline",
          title: "About Spark",
          subtitle: "Version 1.0.0",
          onPress: () => router.push("/(auth)/(settings)/about"),
        },
        {
          id: "logout",
          iconName: "log-out-outline",
          title: "Log Out",
          isDestructive: true,
          onPress: signOutHandler,
        },
      ],
    },
  ];
  const [userMenu, setUserMenu] = useState<MenuSection[]>(currentUserSections);

  const onClose = () => setUserMenuVisible(false);
  const { handleFollowToggle, loading } = useFollowHandler();
  const followStatus = useQuery(api.follows.checkFollowStatus, {
    userId: userInfo?._id,
  });
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
            <Link href={editProfileRoute} asChild>
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

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setUserMenu(currentUserSections);
                setUserMenuVisible(true);
              }}
            >
              <Ionicons
                name="settings-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleFollowToggle(userInfo)}
              disabled={loading}
            >
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
                <Text style={styles.primaryButtonText}>
                  {followStatus?.isFollowing ? "Unfollow" : "Follow"}
                </Text>
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

            <TouchableOpacity
              style={styles.iconOnlyButton}
              onPress={() => {
                setUserMenu(otherUserSections);
                setUserMenuVisible(true);
              }}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomSheetModal
        visible={userMenuVisible}
        onClose={onClose}
        sections={userMenu}
        height="90%"
      />
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
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 4,
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
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: Colors.tintBlueLight,
    borderWidth: 1.5,
    borderColor: Colors.tintBlue,
    gap: 4,
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
