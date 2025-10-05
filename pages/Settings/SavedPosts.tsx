import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface SavedPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    imageUrl: string;
  };
  imageUrl?: string;
  savedAt: string;
  likeCount: number;
  commentCount: number;
}

type FilterType = "all" | "with-media" | "text-only";

export default function SavedPosts() {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([
    {
      id: "1",
      content:
        "Just finished an amazing workout session! Feeling energized and ready to take on the day. 💪",
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        imageUrl: "https://i.pravatar.cc/150?img=45",
      },
      imageUrl: "https://picsum.photos/400/300?random=1",
      savedAt: "2024-09-28",
      likeCount: 234,
      commentCount: 45,
    },
    {
      id: "2",
      content:
        "The best way to predict the future is to create it. Start building your dreams today!",
      author: {
        name: "Mike Chen",
        username: "mikechen",
        imageUrl: "https://i.pravatar.cc/150?img=33",
      },
      savedAt: "2024-09-25",
      likeCount: 567,
      commentCount: 89,
    },
    {
      id: "3",
      content: "Sunset views from the rooftop. Nature never disappoints.",
      author: {
        name: "Emma Davis",
        username: "emmad",
        imageUrl: "https://i.pravatar.cc/150?img=47",
      },
      imageUrl: "https://picsum.photos/400/300?random=2",
      savedAt: "2024-09-20",
      likeCount: 892,
      commentCount: 123,
    },
    {
      id: "4",
      content:
        "Learning something new every day keeps the mind sharp. Today's lesson: TypeScript generics are actually pretty cool!",
      author: {
        name: "Alex Kumar",
        username: "alexk",
        imageUrl: "https://i.pravatar.cc/150?img=12",
      },
      savedAt: "2024-09-15",
      likeCount: 445,
      commentCount: 67,
    },
  ]);

  const handleUnsave = (postId: string, authorName: string) => {
    Alert.alert(
      "Unsave Post",
      `Remove post by ${authorName} from your saved items?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unsave",
          style: "destructive",
          onPress: () => {
            setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const FilterChip = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: FilterType;
    icon: string;
  }) => {
    const isSelected = filter === value;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor: colors.white,
            borderColor: colors.borderLight,
          },
          isSelected && {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
        ]}
        onPress={() => {
          setFilter(value);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon as any}
          size={16}
          color={isSelected ? colors.white : colors.textSecondary}
        />
        <Text
          style={[
            styles.filterChipText,
            { color: colors.textSecondary },
            isSelected && {
              color: colors.white,
              fontWeight: "600",
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const filteredPosts = savedPosts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "with-media" && post.imageUrl) ||
      (filter === "text-only" && !post.imageUrl);

    return matchesSearch && matchesFilter;
  });

  const SavedPostCard = ({ post }: { post: SavedPost }) => (
    <View style={[styles.postCard, { backgroundColor: colors.white }]}>
      {/* Author Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.authorInfo}>
          <Image
            source={{ uri: post.author.imageUrl }}
            style={[styles.avatar, { backgroundColor: colors.borderLighter }]}
          />
          <View style={styles.authorDetails}>
            <Text style={[styles.authorName, { color: colors.textPrimary }]}>
              {post.author.name}
            </Text>
            <Text
              style={[styles.authorUsername, { color: colors.textSecondary }]}
            >
              @{post.author.username}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={() => handleUnsave(post.id, post.author.name)}
        >
          <Ionicons name="bookmark" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={[styles.postContent, { color: colors.textPrimary }]}>
        {post.content}
      </Text>

      {/* Media */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={[styles.postImage, { backgroundColor: colors.borderLighter }]}
        />
      )}

      {/* Stats */}
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={16} color={colors.textTertiary} />
          <Text style={[styles.statText, { color: colors.textTertiary }]}>
            {post.likeCount}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={16} color={colors.textTertiary} />
          <Text style={[styles.statText, { color: colors.textTertiary }]}>
            {post.commentCount}
          </Text>
        </View>
        <Text style={[styles.savedDate, { color: colors.textTertiary }]}>
          Saved{" "}
          {new Date(post.savedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Saved Posts",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Saved Posts
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {savedPosts.length} {savedPosts.length === 1 ? "post" : "posts"}{" "}
            saved
          </Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.searchContainer}
        >
          <View style={[styles.searchBar, { backgroundColor: colors.white }]}>
            <Ionicons
              name="search"
              size={20}
              color={colors.textTertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search saved posts..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
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
        </Animated.View>

        {/* Filters */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.filtersContainer}
        >
          <FilterChip label="All" value="all" icon="albums" />
          <FilterChip label="With Media" value="with-media" icon="images" />
          <FilterChip label="Text Only" value="text-only" icon="text" />
        </Animated.View>

        {/* Posts List */}
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredPosts.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(300).duration(400)}
              style={styles.emptyState}
            >
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: colors.borderLighter },
                ]}
              >
                <Ionicons
                  name={searchQuery ? "search" : "bookmark-outline"}
                  size={64}
                  color={colors.textTertiary}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {searchQuery ? "No Results Found" : "No Saved Posts"}
              </Text>
              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {searchQuery
                  ? "Try searching with different keywords"
                  : "Posts you save will appear here for easy access later"}
              </Text>
            </Animated.View>
          ) : (
            filteredPosts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.delay(300 + index * 50).duration(400)}
              >
                <SavedPostCard post={post} />
              </Animated.View>
            ))
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Quick Actions */}
        {savedPosts.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[
              styles.quickActions,
              {
                borderTopColor: colors.borderLight,
                backgroundColor: colors.white,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert(
                  "Clear All",
                  "Remove all saved posts? This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear All",
                      style: "destructive",
                      onPress: () => {
                        setSavedPosts([]);
                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success
                        );
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[styles.actionButtonText, { color: colors.danger }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Post Card
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  authorUsername: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  unsaveButton: {
    padding: 8,
  },
  postContent: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  savedDate: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginLeft: "auto",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 21,
  },

  // Quick Actions
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  bottomSpacer: {
    height: 20,
  },
});
