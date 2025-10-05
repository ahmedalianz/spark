import { EmptyList, Follower, Tab } from "@/components/FollowersFollowing";
import useFollowersFollowing from "@/controllers/useFollowersFollowing";
import useAppTheme from "@/hooks/useAppTheme";
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
  const { colors } = useAppTheme();
  const {
    followers,
    following,
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
      return <Follower following={item} colors={colors} />;
    },
    [colors]
  );
  const { top } = useSafeAreaInsets();
  if (
    followersStatus === "LoadingFirstPage" ||
    followingsStatus === "LoadingFirstPage"
  ) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={[
            styles.loadingText,
            {
              color: colors.textTertiary,
            },
          ]}
        >
          Loading connections...
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.white,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          follows={followers}
          title="Followers"
          colors={colors}
        />
        <Tab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          follows={following}
          title="Following"
          colors={colors}
        />
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.white,
            shadowColor: colors.blackPure,
            borderColor: colors.borderLighter,
          },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.textPrimary,
            },
          ]}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textTertiary}
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
          <EmptyList
            searchQuery={searchQuery}
            activeTab={activeTab}
            colors={colors}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContentContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});

export default FollowersFollowing;
