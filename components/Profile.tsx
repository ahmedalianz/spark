import { Doc, Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "@/convex/_generated/api";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@clerk/clerk-expo";
import { usePaginatedQuery } from "convex/react";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileLoader from "./ProfileLoader";
import Tabs, { tabEnum } from "./Tabs";
import Thread from "./Threads";
import { UserProfile } from "./UserProfile";

type ProfileProps = {
  userId?: Id<"users">;
  showBackButton?: boolean;
};

export default function Profile({
  userId,
  showBackButton = false,
}: ProfileProps) {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<tabEnum>("Threads");
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const { signOut } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId || userProfile?._id },
    { initialNumItems: 10 }
  );

  const handleTabChange = (tab: tabEnum) => {
    setActiveTab(tab);
  };

  const signOutHandler = () => {
    signOut();
  };
  const headerOpacity = scrollY.interpolate({
    inputRange: [100, 400],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#667eea"
        translucent
      />
      <View style={[styles.container, { paddingTop: top }]}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.animatedHeader,
            { opacity: headerOpacity },
            Platform.OS === "android" && { backgroundColor: "#667eea" },
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
                  color={Platform.OS === "android" ? "#fff" : "#1a1a1a"}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.headerButton}>
                <MaterialCommunityIcons
                  name="web"
                  size={24}
                  color={Platform.OS === "android" ? "#fff" : "#1a1a1a"}
                />
              </TouchableOpacity>
            )}

            <Text
              style={[
                styles.headerTitle,
                {
                  color: Platform.OS === "android" ? "#fff" : "#1a1a1a",
                },
              ]}
            >
              Profile
            </Text>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons
                  name="logo-facebook"
                  size={22}
                  color={Platform.OS === "android" ? "#fff" : "#1a1a1a"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={signOutHandler}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={Platform.OS === "android" ? "#fff" : "#1a1a1a"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <FlatList
          data={results}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <Link href={`/feed/${item._id}`} asChild>
              <TouchableOpacity style={styles.threadWrapper}>
                <Thread
                  thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
                />
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="create-outline" size={48} color="#c0c0c0" />
              <Text style={styles.emptyStateText}>No threads yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Share your first thought with the world
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
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
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                      </View>
                      <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.iconButton}>
                      <View style={styles.iconButtonBackground}>
                        <MaterialCommunityIcons
                          name="web"
                          size={20}
                          color="#fff"
                        />
                      </View>
                    </TouchableOpacity>
                  )}

                  <View style={styles.heroActions}>
                    <TouchableOpacity style={styles.iconButton}>
                      <View style={styles.iconButtonBackground}>
                        <Ionicons name="logo-facebook" size={18} color="#fff" />
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
                          color="#fff"
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
                <Tabs onTabChange={handleTabChange} />
              </View>
            </>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
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
    paddingTop: 60, // Account for status bar and safe area
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: "#fff",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    backgroundColor: "#fff",
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
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  tabsContainer: {
    backgroundColor: "#fff",
  },
  threadWrapper: {
    backgroundColor: "#fff",
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
    color: "#666",
    marginTop: 16,
    fontFamily: "DMSans_500Medium",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "DMSans_400Regular",
  },
});
