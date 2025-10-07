import { Post } from "@/components/feed-post";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useAppTheme from "@/hooks/useAppTheme";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { usePaginatedQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeOutUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FeedFilter = "all" | "following";

const Feed = () => {
  const { colors, barStyleColors } = useAppTheme();
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchResults, setSearchResults] = useState<Doc<"posts">[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { top } = useSafeAreaInsets();
  const { userInfo } = useUserInfo();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const isRefreshingValue = useSharedValue(0);

  // Main feed posts query
  const {
    results: feedPosts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getFeedPosts,
    { filter: currentFilter },
    { initialNumItems: 10 }
  );
  //TODO: Search query - only runs when searching
  const searchQueryResult = usePaginatedQuery(
    api.posts.searchPosts,
    searchQuery.length > 0 ? { query: searchQuery.trim() } : "skip",
    { initialNumItems: 20 }
  );

  // Handle search with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, []);

  // Update search results when query completes
  useEffect(() => {
    if (searchQueryResult.results) {
      setSearchResults(searchQueryResult.results);
      setIsSearching(false);
    }
  }, [searchQueryResult.results]);

  const onLoadMore = useCallback(async () => {
    if (status === "LoadingMore" || loadingMore) return;

    setLoadingMore(true);
    Haptics.selectionAsync();

    try {
      if (searchQuery.length > 0) {
        await searchQueryResult.loadMore(10);
      } else {
        await loadMore(5);
      }
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadMore, searchQueryResult.loadMore, status, loadingMore, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    isRefreshingValue.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      Alert.alert("Error", "Failed to refresh feed");
    } finally {
      setRefreshing(false);
      isRefreshingValue.value = withSpring(0);
    }
  }, []);

  const handleFilterChange = (filter: FeedFilter) => {
    if (filter === currentFilter) return;

    setCurrentFilter(filter);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Clear search when changing filters
    if (searchQuery) {
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Determine which data to display
  const displayPosts = searchQuery.length > 0 ? searchResults : feedPosts;
  const displayStatus =
    searchQuery.length > 0 ? searchQueryResult.status : status;

  // Animated styles

  const pullRefreshStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          isRefreshingValue.value,
          [0, 1],
          [1, 1.15],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const renderPost = ({ item }: { item: Doc<"posts"> }) => (
    <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
      <TouchableOpacity>
        <Post
          post={
            item as Doc<"posts"> & {
              author: Doc<"users">;
              userHasLiked: boolean;
            }
          }
          colors={colors}
        />
      </TouchableOpacity>
    </Link>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterTab,
          currentFilter === "all" && styles.activeFilterTab,
        ]}
        onPress={() => handleFilterChange("all")}
      >
        <Text
          style={[
            styles.filterTabText,
            { color: colors.textTertiary },
            currentFilter === "all" && { color: colors.textPrimary },
          ]}
        >
          For You
        </Text>
        {currentFilter === "all" && (
          <View
            style={[
              styles.filterTabIndicator,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterTab,
          currentFilter === "following" && styles.activeFilterTab,
        ]}
        onPress={() => handleFilterChange("following")}
      >
        <Text
          style={[
            styles.filterTabText,
            { color: colors.textTertiary },
            currentFilter === "following" && { color: colors.textPrimary },
          ]}
        >
          Following
        </Text>
        {currentFilter === "following" && (
          <View
            style={[
              styles.filterTabIndicator,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Logo and Actions */}
      <View style={styles.topBar}>
        <Animated.View style={pullRefreshStyle}>
          <Image
            source={
              barStyleColors === "light-content"
                ? require("@/assets/images/spark.webp")
                : require("@/assets/images/spark-empty.webp")
            }
            style={styles.logo}
          />
        </Animated.View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
            <Ionicons
              name={showSearch ? "close" : "search-outline"}
              size={24}
              color={showSearch ? colors.primary : colors.iconPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(auth)/(settings)/menu")}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.iconPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOutUp.duration(200)}
          style={styles.searchContainer}
        >
          <View
            style={[
              styles.searchInputContainer,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.textMuted} />
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
            {(searchQuery.length > 0 || isSearching) && (
              <View style={styles.searchActions}>
                {isSearching ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <TouchableOpacity onPress={() => handleSearch("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {searchQuery.length > 0 && (
            <View style={styles.searchStats}>
              <Text
                style={[styles.searchStatsText, { color: colors.textTertiary }]}
              >
                {`${searchResults.length} results for "${searchQuery}"`}
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Filter Tabs - only show when not searching */}
      {!showSearch && renderFilterTabs()}

      {/* Create Post Preview - only show when not searching */}
      {!showSearch && (
        <Link href={`/(auth)/(modals)/create-post`} asChild>
          <TouchableOpacity style={styles.createPost}>
            <Image
              source={{ uri: userInfo?.imageUrl as string }}
              style={[styles.avatar, { backgroundColor: colors.border }]}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.backgroundTertiary,
                },
              ]}
              placeholder={"What's happening?"}
              placeholderTextColor={colors.textMuted}
              textAlignVertical="top"
              scrollEnabled={false}
              editable={false}
            />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );

  const renderFooter = () => {
    if (displayStatus === "LoadingFirstPage" || searchQuery.length >= 2)
      return null;

    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Loading more posts...
          </Text>
        </View>
      );
    }

    if (displayPosts.length > 0 && status !== "Exhausted") {
      return (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={onLoadMore}
          disabled={loadingMore}
        >
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>
            Load More
          </Text>
        </TouchableOpacity>
      );
    }

    if (displayPosts.length > 0 && status === "Exhausted") {
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
  };

  const renderEmptyState = () => {
    if (displayStatus === "LoadingFirstPage") return null;

    // Different empty states for search vs feed
    if (searchQuery.length >= 2) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.textMuted} />
          <Text
            style={[styles.emptyStateTitle, { color: colors.textSecondary }]}
          >
            No results found
          </Text>
          <Text
            style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}
          >
            Try searching for different keywords or check your spelling
          </Text>
          <TouchableOpacity
            style={[
              styles.emptyStateButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => handleSearch("")}
          >
            <Text
              style={[styles.emptyStateButtonText, { color: colors.white }]}
            >
              Clear Search
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="chatbubbles-outline"
          size={64}
          color={colors.textMuted}
        />
        <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>
          {currentFilter === "following"
            ? "No posts from following"
            : "No posts yet"}
        </Text>
        <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
          {currentFilter === "following"
            ? "Follow some users to see their posts here"
            : "Be the first to start a conversation!"}
        </Text>
        <TouchableOpacity
          style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(auth)/(modals)/create-post")}
        >
          <Text style={[styles.emptyStateButtonText, { color: colors.white }]}>
            Create Post
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={barStyleColors}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          data={displayPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          // onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: top, paddingBottom: tabBarHeight + 20 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.white}
            />
          }
        />

        {/* Loading State */}
        {displayStatus === "LoadingFirstPage" && (
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
        )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchActions: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchStats: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  searchStatsText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 24,
  },
  filterTab: {
    position: "relative",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeFilterTab: {
    // No additional background needed
  },
  filterTabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  createPost: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 24,
    borderWidth: 1,
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
  endOfFeed: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  endOfFeedText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
});

export default Feed;
