import Follower from "@/components/Follower";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "followers" | "following";

type FollowersFollowingScreenProps = {
  initialTab?: TabType;
};

// Replace with actual navigation prop type if necessary
const FollowersFollowingScreen = (
  { initialTab }: FollowersFollowingScreenProps = {
    initialTab: "followers",
  }
) => {
  const [activeTab, setActiveTab] = useState<TabType>(
    initialTab || "followers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const {
    results: followers,
    status: followersStatus,
    loadMore,
  } = usePaginatedQuery(api.follows.getFollowers, {}, { initialNumItems: 15 });
  const { results: following, status: followingsStatus } = usePaginatedQuery(
    api.follows.getFollowing,
    {},
    { initialNumItems: 15 }
  );

  // Filter users based on search query
  const filterUsers = (users: any[]) =>
    users?.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const currentData =
    activeTab === "followers" ? filterUsers(followers) : filterUsers(following);

  const renderUserItem = ({ item: user }: { item: Doc<"users"> }) => {
    return <Follower user={user} />;
  };

  if (
    followersStatus === "LoadingFirstPage" ||
    followingsStatus === "LoadingFirstPage"
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading connections...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "followers" && styles.activeTab]}
          onPress={() => setActiveTab("followers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followers" && styles.activeTabText,
            ]}
          >
            Followers {followers && `(${followers.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "following" && styles.activeTab]}
          onPress={() => setActiveTab("following")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "following" && styles.activeTabText,
            ]}
          >
            Following {following && `(${following.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* User List */}
      <FlatList
        data={currentData}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        // Add padding to offset the floating search bar
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="people-outline"
              size={64}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyStateText}>
              {searchQuery ? "No users found" : `No ${activeTab} yet`}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {!searchQuery && activeTab === "followers"
                ? "When someone follows you, they'll appear here."
                : !searchQuery && activeTab === "following"
                  ? "Users you follow will appear here."
                  : "Try adjusting your search terms."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textTertiary,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14, // Slightly reduced padding
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3, // Thicker underline for emphasis
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "700", // Bolder text for active tab
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLighter,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  listContentContainer: {
    paddingTop: 8, // Add a little space before the first item
    paddingBottom: 20, // Add space at the bottom of the list
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default FollowersFollowingScreen;
