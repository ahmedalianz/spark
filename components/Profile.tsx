import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@clerk/clerk-expo";
import { usePaginatedQuery } from "convex/react";
import { useCallback, useMemo, useRef, useState } from "react";
import ProfileLoader from "./ProfileLoader";
import Tabs, { tabEnum } from "./Tabs";
import Thread from "./Thread";
import { UserProfile } from "./UserProfile";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton?: boolean;
};

export default function Profile({
  userId,
  showBackButton = false,
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<tabEnum>("Threads");
  const [refreshing, setRefreshing] = useState(false);
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const { signOut } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Different queries based on active tab
  const threadsQuery = usePaginatedQuery(
    api.threads.getThreads,
    { userId: userId || userProfile?._id },
    { initialNumItems: 10 }
  );

  // Get the current active query based on tab
  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case "Threads":
        return threadsQuery;
      case "Replies":
      // return repliesQuery;
      case "Reposts":
      // return repostsQuery;
      default:
        return threadsQuery;
    }
  }, [activeTab, threadsQuery]);

  const { results, status, loadMore } = currentQuery;

  const handleTabChange = useCallback((tab: tabEnum) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // The queries will automatically refresh when the component re-renders
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const signOutHandler = useCallback(() => {
    signOut();
  }, [signOut]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 250],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const renderEmptyComponent = useCallback(() => {
    const emptyMessages = {
      Threads: {
        icon: "create-outline",
        title: "No threads yet",
        subtitle: "Share your first thought with the world",
      },
      Replies: {
        icon: "chatbubble-outline",
        title: "No replies yet",
        subtitle: "Join the conversation by replying to others",
      },
      Reposts: {
        icon: "repeat-outline",
        title: "No reposts yet",
        subtitle: "Share interesting content with your followers",
      },
    };

    const message = emptyMessages[activeTab];

    return (
      <View style={styles.emptyState}>
        <Ionicons name={message.icon as any} size={48} color="#c0c0c0" />
        <Text style={styles.emptyStateText}>{message.title}</Text>
        <Text style={styles.emptyStateSubtext}>{message.subtitle}</Text>
      </View>
    );
  }, [activeTab]);

  const renderFooter = useCallback(() => {
    if (status === "LoadingMore") {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      );
    }

    if (status === "CanLoadMore") {
      return (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.primary} />
        </TouchableOpacity>
      );
    }

    if (results && results.length > 0 && status === "Exhausted") {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>{"You've reached the end"}</Text>
        </View>
      );
    }

    return null;
  }, [status, results, handleLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <Link href={`/feed/${item._id}`} asChild>
        <TouchableOpacity style={styles.threadWrapper}>
          <Thread thread={item as Doc<"threads"> & { creator: Doc<"users"> }} />
        </TouchableOpacity>
      </Link>
    ),
    []
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.container}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.animatedHeader,
            { opacity: headerOpacity },
            Platform.OS === "android" && { backgroundColor: Colors.primary },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={100}
              tint="prominent"
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <View style={styles.headerContent}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={router.back}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={
                    Platform.OS === "android" ? Colors.white : Colors.black
                  }
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="web"
                  size={24}
                  color={
                    Platform.OS === "android" ? Colors.white : Colors.black
                  }
                />
              </TouchableOpacity>
            )}

            <Text
              style={[
                styles.headerTitle,
                {
                  color:
                    Platform.OS === "android" ? Colors.white : Colors.black,
                },
              ]}
            >
              {`${userProfile?.first_name} ${userProfile?.last_name}`}
            </Text>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons
                  name="logo-facebook"
                  size={22}
                  color={
                    Platform.OS === "android" ? Colors.white : Colors.black
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={signOutHandler}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={
                    Platform.OS === "android" ? Colors.white : Colors.black
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            status === "LoadingFirstPage" ? null : renderEmptyComponent
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={
            <>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroContent}>
                  {showBackButton ? (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={router.back}
                    >
                      <View style={styles.backButtonBackground}>
                        <Ionicons
                          name="chevron-back"
                          size={20}
                          color={Colors.white}
                        />
                      </View>
                      <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.iconButton}>
                      <View style={styles.iconButtonBackground}>
                        <MaterialCommunityIcons
                          name="web"
                          size={20}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  <View style={styles.heroActions}>
                    <TouchableOpacity style={styles.iconButton}>
                      <View style={styles.iconButtonBackground}>
                        <Ionicons
                          name="logo-facebook"
                          size={18}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={signOutHandler}
                    >
                      <View style={styles.iconButtonBackground}>
                        <Ionicons
                          name="log-out-outline"
                          size={18}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.profileSection}>
                {userId ? (
                  <UserProfile userId={userId} />
                ) : isLoading ? (
                  <ProfileLoader />
                ) : (
                  <UserProfile userId={userProfile?._id} />
                )}
              </View>

              <View style={styles.tabsContainer}>
                <Tabs onTabChange={handleTabChange} activeTab={activeTab} />
              </View>

              {/* Loading indicator for first page */}
              {status === "LoadingFirstPage" && (
                <View style={styles.firstPageLoading}>
                  <ActivityIndicator color={Colors.primary} size="large" />
                  <Text style={styles.loadingText}>
                    Loading {activeTab.toLowerCase()}...
                  </Text>
                </View>
              )}
            </>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBackground,
    flex: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 44,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButtonBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white20,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
    fontFamily: "DMSans_500Medium",
  },
  iconButton: {
    padding: 4,
  },
  iconButtonBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    backgroundColor: Colors.white,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsContainer: {
    backgroundColor: Colors.white,
  },
  threadWrapper: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textTertiary,
    marginTop: 16,
    fontFamily: "DMSans_500Medium",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    fontFamily: "DMSans_400Regular",
  },
  firstPageLoading: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: Colors.blueTintLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.blueTint,
    gap: 6,
  },
  loadMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    fontFamily: "DMSans_500Medium",
  },
  endMessage: {
    alignItems: "center",
    paddingVertical: 20,
  },
  endMessageText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: "DMSans_400Regular",
  },
});
