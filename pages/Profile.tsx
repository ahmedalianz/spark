import { Id } from "@/convex/_generated/dataModel";
import { Link } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { Post } from "@/components/feed-post";
import {
  ProfileEmpty,
  ProfileFooter,
  ProfileStats,
} from "@/components/profile";
import TabButton from "@/components/TabButton";
import useProfile from "@/controllers/useProfile";
import useAppTheme from "@/hooks/useAppTheme";
import { PostWithAuthorDetails, ProfileTabs } from "@/types";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile({ userId }: { userId?: Id<"users"> }) {
  const {
    posts,
    router,
    activeTab,
    userInfo,
    isLoading,
    error,
    status,
    viewedUserInfo,
    isCurrentUserProfile,
    setActiveTab,
    handleLoadMore,
  } = useProfile({ userId });
  const { colors } = useAppTheme();
  const { top } = useSafeAreaInsets();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const renderEmptyComponent = useCallback(() => {
    return <ProfileEmpty {...{ activeTab, status, colors }} />;
  }, [activeTab, status, colors]);

  const renderFooter = useCallback(() => {
    return <ProfileFooter {...{ posts, status }} />;
  }, [status, posts]);

  const renderItem = useCallback(
    ({ item }: { item: PostWithAuthorDetails }) => (
      <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
        <TouchableOpacity>
          <Post post={item} colors={colors} />
        </TouchableOpacity>
      </Link>
    ),
    [colors]
  );

  const TabButtonWrapper = useCallback(
    ({
      tab,
      icon,
      label,
    }: {
      tab: ProfileTabs;
      icon: string;
      label: string;
    }) => (
      <TabButton {...{ activeTab, setActiveTab, tab, label, icon, colors }} />
    ),
    [activeTab, setActiveTab, colors]
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: 400, offset: 400 * index, index }),
    []
  );
  if (error) {
    router.replace("/(auth)/error");
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <FlatList
        data={posts}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <>
            <ProfileStats
              isLoading={isLoading}
              userInfo={userInfo}
              isCurrentUserProfile={isCurrentUserProfile}
              viewedUserInfo={viewedUserInfo}
              colors={colors}
            />

            {/* Tabs */}
            {isCurrentUserProfile && (
              <View
                style={[
                  styles.tabContainer,
                  {
                    backgroundColor: colors.backgroundTertiary,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <TabButtonWrapper
                  tab="posts"
                  icon="grid-outline"
                  label="Posts"
                />
                <TabButtonWrapper
                  tab="reposts"
                  icon="chatbubble-outline"
                  label="Reposts"
                />
                <TabButtonWrapper
                  tab="tagged"
                  icon="pricetag-outline"
                  label="Tagged"
                />
              </View>
            )}
          </>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom:
            status === "LoadingFirstPage" ? 0 : bottomTabBarHeight + 20,
        }}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={3}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
});
