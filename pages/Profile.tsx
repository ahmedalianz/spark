import { Id } from "@/convex/_generated/dataModel";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Post } from "@/components/feed-post";
import {
  ProfileEmpty,
  ProfileFirstHeader,
  ProfileFooter,
  ProfileHeader,
  ProfileStats,
} from "@/components/profile";
import TabButton from "@/components/TabButton";
import useProfile from "@/controllers/useProfile";
import useAppTheme from "@/hooks/useAppTheme";
import { PostWithAuthorDetails } from "@/types";
import { useCallback } from "react";

export default function Profile({ userId }: { userId?: Id<"users"> }) {
  const {
    posts,
    router,
    scrollY,
    activeTab,
    userInfo,
    isLoading,
    error,
    status,
    viewedUserInfo,
    isCurrentUserProfile,
    signOutHandler,
    setActiveTab,
    handleLoadMore,
  } = useProfile({ userId });

  const { colors } = useAppTheme();

  const renderEmptyComponent = useCallback(() => {
    return <ProfileEmpty activeTab={activeTab} colors={colors} />;
  }, [activeTab]);

  const renderFooter = useCallback(() => {
    return <ProfileFooter {...{ posts, status, handleLoadMore }} />;
  }, [status, posts, handleLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: PostWithAuthorDetails }) => (
      <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
        <TouchableOpacity
          style={[
            styles.postWrapper,
            { backgroundColor: colors.white, shadowColor: colors.blackPure },
          ]}
        >
          <Post post={item} colors={colors} />
        </TouchableOpacity>
      </Link>
    ),
    [colors]
  );

  const TabButtonWrapper = useCallback(
    ({ tab, icon, label }: { tab: string; icon: string; label: string }) => (
      <TabButton {...{ activeTab, setActiveTab, tab, label, icon, colors }} />
    ),
    [activeTab]
  );

  if (error) {
    router.replace("/(auth)/error");
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundLight }]}
    >
      <ProfileHeader
        {...{
          scrollY,
          userInfo,
          router,
          signOutHandler,
          isCurrentUserProfile,
          viewedUserInfo,
          colors,
        }}
      />

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          status === "LoadingFirstPage" ? null : renderEmptyComponent
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <>
            <ProfileFirstHeader {...{ router, signOutHandler, colors }} />

            <ProfileStats
              isLoading={isLoading}
              userInfo={userInfo}
              isCurrentUserProfile={isCurrentUserProfile}
              viewedUserInfo={viewedUserInfo}
              signOutHandler={signOutHandler}
              colors={colors}
            />

            {/* Tabs */}
            {isCurrentUserProfile && (
              <View
                style={[
                  styles.tabContainer,
                  {
                    backgroundColor: colors.white,
                    borderBottomColor: colors.borderLight,
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

            {/* Loading indicator for first page */}
            {status === "LoadingFirstPage" && (
              <View style={styles.firstPageLoading}>
                <ActivityIndicator color={colors.primary} size="large" />
                <Text
                  style={[styles.loadingText, { color: colors.textTertiary }]}
                >
                  Loading {activeTab}...
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  // Content Styles
  postWrapper: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  separator: {
    height: 12,
  },
  firstPageLoading: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
});
