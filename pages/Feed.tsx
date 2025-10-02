import { Post } from "@/components/feed-post";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { usePaginatedQuery, useQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CreatePost from "./CreatePost";

type FeedFilter = "all" | "following";

const Feed = () => {
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchResults, setSearchResults] = useState<Doc<"posts">[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const unreadCount =
    useQuery(api.notifications.getUnreadNotificationCount) || 0;
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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        headerOpacity.value = interpolate(
          scrollOffset.value,
          [0, 100],
          [1, 0.8],
          Extrapolate.CLAMP
        );
      }
    },
  });

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
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [0, 100],
          [0, -20],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

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
    <Animated.View
      entering={Platform.OS === "ios" ? undefined : undefined}
      style={styles.postContainer}
    >
      <Link href={`/(auth)/(modals)/post/${item._id}`} asChild>
        <TouchableOpacity activeOpacity={0.95}>
          <Post
            post={
              item as Doc<"posts"> & {
                author: Doc<"users">;
                userHasLiked: boolean;
              }
            }
          />
        </TouchableOpacity>
      </Link>
    </Animated.View>
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
            currentFilter === "all" && styles.activeFilterTabText,
          ]}
        >
          For You
        </Text>
        {currentFilter === "all" && <View style={styles.filterTabIndicator} />}
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
            currentFilter === "following" && styles.activeFilterTabText,
          ]}
        >
          Following
        </Text>
        {currentFilter === "following" && (
          <View style={styles.filterTabIndicator} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
      {/* Logo and Actions */}
      <View style={styles.topBar}>
        <Animated.View style={pullRefreshStyle}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </Animated.View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              showSearch && styles.headerButtonActive,
            ]}
            onPress={toggleSearch}
          >
            <Ionicons
              name={showSearch ? "close" : "search-outline"}
              size={24}
              color={showSearch ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(auth)/(tabs)/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.textSecondary}
            />
            {unreadCount > 0 && <View style={styles.notificationBadge} />}
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
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search posts, users, topics..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {(searchQuery.length > 0 || isSearching) && (
              <View style={styles.searchActions}>
                {isSearching ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <TouchableOpacity onPress={() => handleSearch("")}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {searchQuery.length > 0 && (
            <View style={styles.searchStats}>
              <Text style={styles.searchStatsText}>
                {searchResults.length} results for "{searchQuery}"
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Filter Tabs - only show when not searching */}
      {!showSearch && renderFilterTabs()}

      {/* Create Post Preview - only show when not searching */}
      {!showSearch && <CreatePost isPreview />}
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>
          {searchQuery.length > 0 ? "Searching..." : "Loading more posts..."}
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (displayStatus === "LoadingFirstPage") return null;

    // Different empty states for search vs feed
    if (searchQuery.length > 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try searching for different keywords or check your spelling
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => handleSearch("")}
          >
            <Text style={styles.emptyStateButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="chatbubbles-outline"
          size={64}
          color={Colors.textMuted}
        />
        <Text style={styles.emptyStateTitle}>
          {currentFilter === "following"
            ? "No posts from following"
            : "No posts yet"}
        </Text>
        <Text style={styles.emptyStateSubtitle}>
          {currentFilter === "following"
            ? "Follow some users to see their posts here"
            : "Be the first to start a conversation!"}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => router.push("/(auth)/(modals)/create-post")}
        >
          <Text style={styles.emptyStateButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      <View style={styles.container}>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={displayPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          // onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: top, paddingBottom: tabBarHeight + 20 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.white}
            />
          }
        />

        {/* Loading State */}
        {displayStatus === "LoadingFirstPage" && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>
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
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.white,
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
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerButtonActive: {
    backgroundColor: Colors.tintBlueLight,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentLike,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
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
    color: Colors.textMuted,
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
    color: Colors.textMuted,
  },
  activeFilterTabText: {
    color: Colors.textSecondary,
  },
  filterTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },
  postContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  separator: {
    height: 8,
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
    color: Colors.textMuted,
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Feed;
