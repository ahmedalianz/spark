import { Post } from "@/components/feed-post";
import { api } from "@/convex/_generated/api";
import useAppTheme from "@/hooks/useAppTheme";
import { useUserInfo } from "@/hooks/useUserInfo";
import { FeedFilter, PostWithAuthor } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { usePaginatedQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Feed = () => {
  const { colors, barStyleColors } = useAppTheme();
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { top } = useSafeAreaInsets();
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const flatListRef = useRef<FlatList<PostWithAuthor>>(null);
  // Main feed posts query
  const {
    results: feedPosts,
    status: filterStatus,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getFeedPosts,
    { filter: currentFilter },
    { initialNumItems: 4 }
  );

  // Search query with debounced value
  const {
    results: searchResults,
    status: searchStatus,
    loadMore: loadMoreSearch,
  } = usePaginatedQuery(
    api.posts.searchPosts,
    debouncedSearchQuery.length > 1
      ? {
          query: debouncedSearchQuery.trim(),
          filters: {
            type: "post",
            visibility: "public",
          },
        }
      : "skip",
    { initialNumItems: 15 }
  );

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Determine which data to display
  const displayPosts = useMemo(() => {
    return searchQuery.length > 1 ? searchResults : feedPosts;
  }, [searchQuery, searchResults, feedPosts]);

  const displayStatus = searchQuery.length > 1 ? searchStatus : filterStatus;

  const onLoadMore = useCallback(async () => {
    if (
      ["LoadingFirstPage", "Exhausted", "LoadingMore"].includes(displayStatus)
    )
      return;

    try {
      if (searchQuery.length > 1) {
        await loadMoreSearch(10);
      } else {
        await loadMore(4);
      }
    } catch (error) {
      console.error("Load more error:", error);
    }
  }, [loadMore, loadMoreSearch, displayStatus, searchQuery]);

  const handleFilterChange = useCallback(
    (filter: FeedFilter) => {
      if (filter === currentFilter) return;

      setCurrentFilter(filter);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Scroll to top when changing filters
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

      // Clear search when changing filters
      if (searchQuery) {
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setShowSearch(false);
      }
    },
    [currentFilter, searchQuery]
  );

  const toggleSearch = useCallback(() => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);

    if (newShowSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setDebouncedSearchQuery("");
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [showSearch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const renderFilterTabs = useCallback(
    () => (
      <View style={styles.filterContainer}>
        {(["all", "following"] as FeedFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={styles.filterTab}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: colors.textTertiary },
                currentFilter === filter && {
                  color: colors.textPrimary,
                  fontWeight: "700",
                },
              ]}
            >
              {filter === "all" ? "For You" : "Following"}
            </Text>
            {currentFilter === filter && (
              <View
                style={[
                  styles.filterTabIndicator,
                  { backgroundColor: colors.primary },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    ),
    [colors, currentFilter, handleFilterChange]
  );

  const renderHeader = useCallback(
    () => (
      <View>
        {/* Logo and Actions */}
        <View style={[styles.topBar, { backgroundColor: colors.background }]}>
          <View>
            <Image
              source={
                barStyleColors === "light-content"
                  ? require("@/assets/images/spark.webp")
                  : require("@/assets/images/spark-empty.webp")
              }
              style={styles.logo}
            />
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.backgroundTertiary },
              ]}
              onPress={toggleSearch}
            >
              <Ionicons
                name={showSearch ? "close" : "search-outline"}
                size={20}
                color={showSearch ? colors.primary : colors.iconPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.backgroundTertiary },
              ]}
              onPress={() => router.push("/(auth)/(settings)/menu")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.iconPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            exiting={FadeOutUp.duration(200)}
            style={styles.searchContainer}
          >
            <View
              style={[
                styles.searchInputContainer,
                { backgroundColor: colors.backgroundTertiary },
              ]}
            >
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search posts, users, topics..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            {searchQuery.length > 1 && displayPosts.length > 0 && (
              <Text
                style={[styles.searchStatsText, { color: colors.textTertiary }]}
              >
                {displayPosts.length} result
                {displayPosts.length !== 1 ? "s" : ""}
              </Text>
            )}
          </Animated.View>
        )}

        {/* Filter Tabs - only show when not searching */}
        {!showSearch && renderFilterTabs()}

        {/* Create Post Preview - only show when not searching */}
        {!showSearch && (
          <Link href="/(auth)/(modals)/create-post" asChild>
            <TouchableOpacity style={styles.createPost}>
              <Image
                source={{ uri: userInfo?.imageUrl as string }}
                style={[styles.avatar, { borderColor: colors.border }]}
              />
              <View
                style={[
                  styles.createPostInput,
                  { backgroundColor: colors.backgroundTertiary },
                ]}
              >
                <Text
                  style={[styles.createPostText, { color: colors.textMuted }]}
                >
                  {"What's happening?"}
                </Text>
                <Ionicons
                  name="images-outline"
                  size={20}
                  color={colors.iconSecondary}
                />
              </View>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    ),
    [
      colors,
      barStyleColors,
      toggleSearch,
      showSearch,
      searchQuery,
      handleSearch,
      clearSearch,
      displayPosts.length,
      renderFilterTabs,
      userInfo?.imageUrl,
      router,
    ]
  );

  const renderFooter = useCallback(() => {
    if (displayStatus === "LoadingFirstPage" || searchQuery.length >= 2)
      return null;
    if (displayStatus === "LoadingMore") {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading more posts...
          </Text>
        </View>
      );
    }

    if (displayPosts.length > 0 && filterStatus !== "Exhausted") {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>
            Load More
          </Text>
        </TouchableOpacity>
      );
    }

    if (displayPosts.length > 0 && filterStatus === "Exhausted") {
      return (
        <View style={styles.endOfFeed}>
          <Ionicons name="checkmark-done" size={24} color={colors.textMuted} />
          <Text style={[styles.endOfFeedText, { color: colors.textMuted }]}>
            {"You're all caught up!"}
          </Text>
        </View>
      );
    }

    return null;
  }, [
    displayStatus,
    searchQuery.length,
    displayPosts.length,
    filterStatus,
    colors,
    onLoadMore,
  ]);

  const renderEmptyState = useCallback(() => {
    if (displayStatus === "LoadingFirstPage") {
      return (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            {searchQuery.length > 0 ? "Searching..." : "Loading your feed..."}
          </Text>
        </View>
      );
    }

    const isSearchEmpty = searchQuery.length > 1 && displayPosts.length === 0;

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name={isSearchEmpty ? "search-outline" : "chatbubbles-outline"}
          size={64}
          color={colors.textMuted}
        />
        <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>
          {isSearchEmpty
            ? "No results found"
            : currentFilter === "following"
              ? "No posts from following"
              : "No posts yet"}
        </Text>
        <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
          {isSearchEmpty
            ? "Try different keywords"
            : currentFilter === "following"
              ? "Follow users to see their posts"
              : "Be the first to post!"}
        </Text>
        {isSearchEmpty && (
          <TouchableOpacity
            style={[
              styles.emptyStateButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={clearSearch}
          >
            <Text
              style={[styles.emptyStateButtonText, { color: colors.white }]}
            >
              Clear Search
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    displayStatus,
    searchQuery.length,
    displayPosts.length,
    colors,
    currentFilter,
    clearSearch,
  ]);

  const keyExtractor = useCallback((item: PostWithAuthor) => item._id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 400,
      offset: 400 * index,
      index,
    }),
    []
  );
  const renderPost: ListRenderItem<PostWithAuthor> = useCallback(
    ({ item }) => (
      <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
        <TouchableOpacity activeOpacity={0.95}>
          <Post post={item} colors={colors} />
        </TouchableOpacity>
      </Link>
    ),
    [colors]
  );
  return (
    <>
      <StatusBar
        barStyle={barStyleColors}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={displayPosts}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: top, paddingBottom: tabBarHeight + 20 },
          ]}
          maxToRenderPerBatch={2}
          decelerationRate="fast"
          windowSize={3}
          initialNumToRender={3}
          getItemLayout={getItemLayout}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 18,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  searchStatsText: {
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 24,
  },
  filterTab: {
    position: "relative",
    paddingVertical: 6,
  },
  filterTabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  filterTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  createPost: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  createPostInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createPostText: {
    fontSize: 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingOverlay: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  endOfFeed: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  endOfFeedText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    fontSize: 14,
    fontWeight: "400",
    borderRadius: 12,
    padding: 16,
    textAlignVertical: "top",
    flex: 1,
  },
  loadMoreButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
});

export default Feed;
