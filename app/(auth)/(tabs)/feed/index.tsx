import Thread from "@/components/Thread";
import ThreadComposer from "@/components/ThreadComposer";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { usePaginatedQuery } from "convex/react";
import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FeedFilter = "all" | "following" | "trending" | "recent";

const Page = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.threads.getThreads,
    {},
    { initialNumItems: 10 }
  );

  const [refreshing, setRefreshing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>("all");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const searchInputRef = useRef<TextInput>(null);

  const isRefreshingValue = useSharedValue(0);

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

  const onLoadMore = useCallback(async () => {
    if (status === "LoadingMore" || loadingMore) return;

    setLoadingMore(true);
    Haptics.selectionAsync();

    try {
      await loadMore(5);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadMore, status, loadingMore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    isRefreshingValue.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate refresh - in real app, this would refetch data
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      Alert.alert("Error", "Failed to refresh feed");
    } finally {
      setRefreshing(false);
      isRefreshingValue.value = withSpring(0);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    console.log(`Searching for: ${query}`);
  };

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

  const renderThread = ({ item }: { item: Doc<"threads"> }) => (
    <Animated.View
      entering={Platform.OS === "ios" ? undefined : undefined}
      style={styles.threadContainer}
    >
      <Link href={`/feed/thread/${item._id}`} asChild>
        <TouchableOpacity activeOpacity={0.95}>
          <Thread thread={item as Doc<"threads"> & { creator: Doc<"users"> }} />
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
      {/* Logo and Search */}
      <View style={styles.topBar}>
        <Animated.View style={pullRefreshStyle}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={styles.logo}
          />
        </Animated.View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons
              name={showSearch ? "close" : "search-outline"}
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              /* TODO: Implement notifications */
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.textSecondary}
            />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <Animated.View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search threads, users, topics..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      <ThreadComposer isPreview />
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading more threads...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyStateTitle}>No threads yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Be the first to start a conversation!
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/(auth)/(modals)/create-thread")}
      >
        <Text style={styles.emptyStateButtonText}>Create Thread</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          data={results}
          renderItem={renderThread}
          keyExtractor={(item) => item._id}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            status === "LoadingFirstPage" ? null : renderEmptyState
          }
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
        {status === "LoadingFirstPage" && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your feed...</Text>
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
    width: 40,
    height: 40,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightBackground,
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
    backgroundColor: Colors.like,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightBackground,
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

  scrollContent: {
    flexGrow: 1,
  },
  threadContainer: {
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

export default Page;
