import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
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
import ProfileLoader from "./ProfileLoader";

type UserProfileProps = {
  userId?: string;
};

export const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });
  const { userProfile } = useUserProfile();
  const isSelf = userProfile?._id === userId;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (profile) {
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
  }, [profile]);

  if (!profile) {
    return <ProfileLoader />;
  }

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

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
              {profile?.first_name} {profile?.last_name}
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#667eea" />
            </View>
          </View>
          <Text style={styles.email}>{profile?.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatFollowerCount(profile?.followersCount || 0)}
              </Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatFollowerCount(profile?.followingsCount || 0)}
              </Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.avatarGradient}
          >
            <Image
              source={{ uri: profile?.imageUrl as string }}
              style={styles.avatar}
            />
          </LinearGradient>
          <View style={styles.statusIndicator} />
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text style={styles.bio}>
          {profile?.bio || "✨ No bio yet - the mystery adds to the charm"}
        </Text>

        {profile?.websiteUrl && (
          <TouchableOpacity style={styles.websiteContainer}>
            <Ionicons name="link-outline" size={16} color="#667eea" />
            <Text style={styles.websiteText}>{profile.websiteUrl}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {isSelf ? (
          <View style={styles.buttonRow}>
            <Link
              href={`/(modal)/edit-profile?biostring=${
                profile?.bio ? encodeURIComponent(profile?.bio) : ""
              }&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : ""}&userId=${
                profile?._id
              }&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ""}`}
              asChild
            >
              <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.primaryButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="share-outline" size={18} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="person-add-outline" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Follow</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="chatbubble-outline" size={18} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconOnlyButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#667eea" />
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
    color: "#1a1a1a",
    fontFamily: "DMSans_700Bold",
  },
  verifiedBadge: {
    marginLeft: 6,
  },
  email: {
    fontSize: 15,
    color: "#666",
    marginBottom: 16,
    fontFamily: "DMSans_400Regular",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    fontFamily: "DMSans_700Bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontFamily: "DMSans_400Regular",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
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
    backgroundColor: "#f0f0f0",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4ade80",
    borderWidth: 3,
    borderColor: "#fff",
  },
  bioSection: {
    marginBottom: 24,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
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
    color: "#667eea",
    fontFamily: "DMSans_500Medium",
  },
  actionSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
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
    color: "#fff",
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
    backgroundColor: "#f8f9ff",
    borderWidth: 1.5,
    borderColor: "#e6eafe",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
    fontFamily: "DMSans_500Medium",
  },
  iconOnlyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8f9ff",
    borderWidth: 1.5,
    borderColor: "#e6eafe",
    alignItems: "center",
    justifyContent: "center",
  },
});
