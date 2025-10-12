import { EmptyList, Follower, Tab } from "@/components/FollowersFollowing";
import useFollowersFollowing from "@/controllers/useFollowersFollowing";
import useAppTheme from "@/hooks/useAppTheme";
import { FollowTabType, FollowWithDetails } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
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
    currentStatus,
    setActiveTab,
    setSearchQuery,
    onLoadMore,
  } = useFollowersFollowing({ initialTab });
  const renderUserItem = useCallback(
    ({ item }: { item: FollowWithDetails }) => {
      return <Follower following={item} colors={colors} />;
    },
    [colors]
  );
  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const ApproximateUserItemHeight = 68;
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ApproximateUserItemHeight,
      offset: ApproximateUserItemHeight * index,
      index,
    }),
    []
  );
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: colors.backgroundSecondary,
        },
      ]}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.background,
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
            backgroundColor: colors.backgroundTertiary,
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
        onEndReached={onLoadMore}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContentContainer,
          {
            paddingBottom: tabBarHeight + 20,
            backgroundColor: colors.background,
          },
        ]}
        ListEmptyComponent={
          <EmptyList
            searchQuery={searchQuery}
            activeTab={activeTab}
            colors={colors}
            followStatus={currentStatus}
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContentContainer: {
    flexGrow: 1,
  },
});

export default FollowersFollowing;
