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
import { Colors } from "@/constants/Colors";
import useProfile from "@/controllers/useProfile";
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
    signOutHandler,
    setActiveTab,
    handleLoadMore,
  } = useProfile({ userId });

  const renderEmptyComponent = useCallback(() => {
    return <ProfileEmpty activeTab={activeTab} />;
  }, [activeTab]);

  const renderFooter = useCallback(() => {
    return <ProfileFooter {...{ posts, status, handleLoadMore }} />;
  }, [status, posts, handleLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: PostWithAuthorDetails }) => (
      <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
        <TouchableOpacity style={styles.postWrapper}>
          <Post post={item} />
        </TouchableOpacity>
      </Link>
    ),
    []
  );

  const TabButtonWrapper = useCallback(
    ({ tab, icon, label }: { tab: string; icon: string; label: string }) => (
      <TabButton {...{ activeTab, setActiveTab, tab, label, icon }} />
    ),
    [activeTab]
  );
  if (error) {
    return <View style={styles.container}></View>;
  }
  return (
    <View style={styles.container}>
      <ProfileHeader {...{ scrollY, userInfo, router, signOutHandler }} />

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
            <ProfileFirstHeader {...{ router, signOutHandler }} />

            <ProfileStats
              isLoading={isLoading}
              userInfo={userInfo}
              isViewingOtherUser={!!userId}
            />

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TabButtonWrapper tab="posts" icon="grid-outline" label="Posts" />
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

            {/* Loading indicator for first page */}
            {status === "LoadingFirstPage" && (
              <View style={styles.firstPageLoading}>
                <ActivityIndicator color={Colors.primary} size="large" />
                <Text style={styles.loadingText}>Loading {activeTab}...</Text>
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
    backgroundColor: Colors.backgroundLight,
    flex: 1,
  },
  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  // Content Styles
  postWrapper: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 20,
    shadowColor: Colors.blackPure,
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
