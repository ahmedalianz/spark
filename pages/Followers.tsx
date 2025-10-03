import Follower from "@/components/Follower";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { FollowWithDetails } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery } from "convex/react";
import React, { useCallback, useMemo, useState } from "react";
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
    loadMore: loadMoreFollowers,
  } = usePaginatedQuery(api.follows.getFollowers, {}, { initialNumItems: 15 });

  const {
    results: following,
    status: followingsStatus,
    loadMore: loadMoreFollowing,
  } = usePaginatedQuery(api.follows.getFollowing, {}, { initialNumItems: 15 });

  const filterUsers = useCallback(
    (users: FollowWithDetails[]) => {
      if (!searchQuery) return users;
      return users.filter((follow) => {
        const query = searchQuery.toLowerCase();

        return (
          follow?.user?.first_name?.toLowerCase().startsWith(query) ||
          follow?.user?.last_name?.toLowerCase().startsWith(query) ||
          follow?.user?.username?.toLowerCase().startsWith(query)
        );
      });
    },
    [searchQuery]
  );

  const currentData = useMemo(
    () =>
      activeTab === "followers"
        ? filterUsers(followers || [])
        : filterUsers(following || []),
    [activeTab, followers, following, filterUsers]
  );

  const renderUserItem = useCallback(
    ({ item }: { item: FollowWithDetails }) => {
      return <Follower following={item} />;
    },
    []
  );

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
        onEndReached={
          activeTab === "followers"
            ? () => loadMoreFollowers(15)
            : () => loadMoreFollowing(15)
        }
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
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowColor: Colors.blackPure,
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
    paddingTop: 8,
    paddingBottom: 20,
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
