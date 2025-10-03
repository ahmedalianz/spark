import { EmptyList, Follower, Tab } from "@/components/FollowersFollowing";
import { Colors } from "@/constants/Colors";
import useFollowersFollowing from "@/controllers/useFollowersFollowing";
import { FollowTabType, FollowWithDetails } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FollowersFollowingProps = {
  initialTab?: FollowTabType;
};

const FollowersFollowing = (
  { initialTab }: FollowersFollowingProps = {
    initialTab: "followers",
  }
) => {
  const {
    activeTab,
    searchQuery,
    currentData,
    followersStatus,
    followingsStatus,
    setActiveTab,
    setSearchQuery,
    loadMoreFollowers,
    loadMoreFollowing,
  } = useFollowersFollowing({ initialTab });
  const renderUserItem = useCallback(
    ({ item }: { item: FollowWithDetails }) => {
      return <Follower following={item} />;
    },
    []
  );
  const { top } = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.tabContainer}>
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          follows={followers}
          title="Followers"
        />
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          follows={followers}
          title="Following"
        />
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
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <EmptyList searchQuery={searchQuery} activeTab={activeTab} />
        }
      />
    </View>
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
});

export default FollowersFollowing;
