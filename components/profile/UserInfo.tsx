import { api } from "@/convex/_generated/api";
import useFollowHandler from "@/hooks/useFollowHandler";
import { UserInfoProps } from "@/types";
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
  colors,
}: UserInfoProps) => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const onClose = () => setUserMenuVisible(false);

  const { handleFollowToggle, loading } = useFollowHandler();
  const followStatus = useQuery(api.follows.checkFollowStatus, {
    userId: userInfo?._id,
  });
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
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [userInfo]);

  const editProfileRoute: any = `/(auth)/(modals)/edit-profile?biostring=${
    userInfo?.bio ? encodeURIComponent(userInfo?.bio) : ""
  }&userId=${
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
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.avatarGradient}
          >
            <Image
              source={{ uri: userInfo?.imageUrl as string }}
              style={styles.avatar}
            />
          </LinearGradient>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {" "}
              {userInfo?.first_name} {userInfo?.last_name}
            </Text>
            {isCurrentUserProfile && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/(auth)/(settings)/menu")}
              >
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color={colors.iconPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.email, { color: colors.textTertiary }]}>
            {userInfo?.email}
          </Text>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text
          style={[styles.bio, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {userInfo?.bio || "✨ No bio yet"}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {isCurrentUserProfile ? (
          <View style={styles.buttonRow}>
            <Link href={editProfileRoute} asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.buttonGradient}
                >
                  <Ionicons
                    name="create-outline"
                    size={16}
                    color={colors.white}
                  />
                  <Text style={[styles.buttonText, { color: colors.white }]}>
                    Edit Profile
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleFollowToggle(userInfo)}
              disabled={loading}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.buttonGradient}
              >
                <Ionicons
                  name={
                    followStatus?.isFollowing
                      ? "person-remove"
                      : "person-add-outline"
                  }
                  size={16}
                  color={colors.white}
                />
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  {followStatus?.isFollowing ? "Following" : "Follow"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.backgroundTertiary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={colors.iconPrimary}
              />
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                {" "}
                Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.moreButton,
                { backgroundColor: colors.backgroundTertiary },
              ]}
              onPress={() => setUserMenuVisible(true)}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={colors.iconPrimary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomSheetModal
        visible={userMenuVisible}
        onClose={onClose}
        sections={otherUserSections}
        height="90%"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    flex: 1,
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  email: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    padding: 2,
    borderRadius: 32,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bioSection: {
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: "DMSans_400Regular",
  },
  websiteContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  websiteText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
  actionSection: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  primaryButton: {
    flex: 2,
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
  },
  secondaryButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
});

export default UserInfo;
