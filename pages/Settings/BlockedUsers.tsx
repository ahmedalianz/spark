import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
} from "react-native-reanimated";

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  bio?: string;
  blockedAt: string;
  followerCount: number;
}

export default function BlockedUsersScreen() {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
      imageUrl: "https://i.pravatar.cc/150?img=1",
      bio: "Digital creator & photographer",
      blockedAt: "2024-09-15",
      followerCount: 1234,
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      imageUrl: "https://i.pravatar.cc/150?img=2",
      bio: "Tech enthusiast | Coffee lover",
      blockedAt: "2024-08-20",
      followerCount: 5678,
    },
    {
      id: "3",
      name: "Mike Johnson",
      username: "mikej",
      imageUrl: "https://i.pravatar.cc/150?img=3",
      blockedAt: "2024-07-10",
      followerCount: 892,
    },
    {
      id: "4",
      name: "Emily Brown",
      username: "emilybrown",
      imageUrl: "https://i.pravatar.cc/150?img=4",
      bio: "Travel blogger ✈️",
      blockedAt: "2024-06-25",
      followerCount: 3421,
    },
  ]);

  const handleUnblock = (userId: string, username: string) => {
    Alert.alert(
      "Unblock User",
      `Unblock @${username}? They'll be able to see your posts and interact with you again.`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: "Unblock",
          style: "default",
          onPress: () => {
            setBlockedUsers((prev) =>
              prev.filter((user) => user.id !== userId)
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleUnblockAll = () => {
    Alert.alert(
      "Unblock All Users",
      `Are you sure you want to unblock all ${blockedUsers.length} users? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock All",
          style: "destructive",
          onPress: () => {
            setBlockedUsers([]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const UserCard = ({ user }: { user: BlockedUser }) => (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={[
        styles.userCard,
        { backgroundColor: colors.white, shadowColor: colors.blackPure },
      ]}
    >
      <TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
        <Image
          source={{ uri: user.imageUrl }}
          style={[styles.avatar, { backgroundColor: colors.borderLighter }]}
        />
        <View style={styles.userDetails}>
          <Text
            style={[styles.userName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {user.name}
          </Text>
          <Text
            style={[styles.userUsername, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            @{user.username}
          </Text>
          {user.bio && (
            <Text
              style={[styles.userBio, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {user.bio}
            </Text>
          )}
          <View style={styles.userMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={14} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {formatFollowerCount(user.followerCount)} followers
              </Text>
            </View>
            <View
              style={[
                styles.metaDivider,
                { backgroundColor: colors.textTertiary },
              ]}
            />
            <Text style={[styles.blockedTime, { color: colors.textTertiary }]}>
              Blocked {formatDate(user.blockedAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.unblockButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleUnblock(user.id, user.username);
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.unblockButtonText, { color: colors.white }]}>
          Unblock
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Blocked Users",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Blocked Users
            </Text>
            {blockedUsers.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.unblockAllButton,
                  { backgroundColor: colors.danger + "10" },
                ]}
                onPress={handleUnblockAll}
              >
                <Text style={[styles.unblockAllText, { color: colors.danger }]}>
                  Unblock All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {blockedUsers.length} {blockedUsers.length === 1 ? "user" : "users"}{" "}
            blocked
          </Text>
        </Animated.View>

        {/* Search Bar */}
        {blockedUsers.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.searchContainer}
          >
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color={colors.textTertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search blocked users..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.emptyState}
          >
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: colors.borderLighter },
              ]}
            >
              <Ionicons
                name={searchQuery ? "search" : "ban"}
                size={72}
                color={colors.textTertiary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {searchQuery ? "No Results Found" : "No Blocked Users"}
            </Text>
            <Text
              style={[styles.emptyDescription, { color: colors.textSecondary }]}
            >
              {searchQuery
                ? "Try searching with a different name or username"
                : "When you block someone, they'll appear here. Blocked users can't see your posts or contact you."}
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <UserCard user={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Info Card */}
        {blockedUsers.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={[
              styles.infoCard,
              { backgroundColor: colors.primary + "10" },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {
                "Blocked users won't be notified. They can't see your profile, posts, or contact you."
              }
            </Text>
          </Animated.View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  unblockAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unblockAllText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // User Card
  userCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  blockedTime: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  unblockButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },

  // Info Card
  infoCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginLeft: 12,
    lineHeight: 18,
  },
});
