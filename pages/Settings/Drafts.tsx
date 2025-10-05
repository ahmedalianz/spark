import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
} from "react-native-reanimated";

interface Draft {
  id: string;
  content: string;
  mediaFiles?: string[];
  createdAt: string;
  lastModified: string;
}

export default function DraftsScreen() {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: "1",
      content:
        "Just finished an amazing workout session! Feeling energized and ready to take on the day. 💪 #fitness #motivation",
      mediaFiles: ["https://picsum.photos/400/300?random=1"],
      createdAt: "2024-10-01",
      lastModified: "2024-10-01",
    },
    {
      id: "2",
      content:
        "Thoughts on the new design trends for 2024? I'm loving the minimalist approach with bold typography. What do you think?",
      createdAt: "2024-09-28",
      lastModified: "2024-09-30",
    },
    {
      id: "3",
      content: "Beautiful sunset tonight 🌅",
      mediaFiles: [
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
      ],
      createdAt: "2024-09-25",
      lastModified: "2024-09-25",
    },
    {
      id: "4",
      content:
        "Coffee thoughts: Why does Monday coffee taste different than Friday coffee? 🤔☕",
      createdAt: "2024-09-20",
      lastModified: "2024-09-22",
    },
  ]);

  const handleDeleteDraft = (draftId: string) => {
    Alert.alert(
      "Delete Draft",
      "Are you sure you want to delete this draft? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
            setSelectedDrafts((prev) => prev.filter((id) => id !== draftId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Drafts",
      `Delete ${selectedDrafts.length} selected ${selectedDrafts.length === 1 ? "draft" : "drafts"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDrafts((prev) =>
              prev.filter((draft) => !selectedDrafts.includes(draft.id))
            );
            setSelectedDrafts([]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleEditDraft = (draft: Draft) => {
    // Navigate to create post screen with draft data
    console.log("Edit draft:", draft.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // router.push({ pathname: "/create-post", params: { draftId: draft.id } });
  };

  const toggleSelectDraft = (draftId: string) => {
    setSelectedDrafts((prev) =>
      prev.includes(draftId)
        ? prev.filter((id) => id !== draftId)
        : [...prev, draftId]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const selectAll = () => {
    if (selectedDrafts.length === filteredDrafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(filteredDrafts.map((draft) => draft.id));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const filteredDrafts = drafts.filter((draft) =>
    draft.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const DraftCard = ({ draft }: { draft: Draft }) => {
    const isSelected = selectedDrafts.includes(draft.id);
    const hasMedia = draft.mediaFiles && draft.mediaFiles.length > 0;

    return (
      <Animated.View
        entering={FadeInDown.duration(300)}
        exiting={FadeOut.duration(200)}
        layout={Layout.springify()}
      >
        <TouchableOpacity
          style={[
            styles.draftCard,
            { backgroundColor: colors.white },
            isSelected && {
              borderColor: colors.primary,
              backgroundColor: colors.primary + "05",
            },
          ]}
          onPress={() => handleEditDraft(draft)}
          onLongPress={() => toggleSelectDraft(draft.id)}
          activeOpacity={0.7}
        >
          {/* Selection Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleSelectDraft(draft.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.borderLight },
                isSelected && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={16} color={colors.white} />
              )}
            </View>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.draftContent}>
            <Text
              style={[styles.draftText, { color: colors.textPrimary }]}
              numberOfLines={3}
            >
              {draft.content}
            </Text>

            {/* Media Preview */}
            {hasMedia && (
              <View style={styles.mediaPreview}>
                {draft.mediaFiles!.slice(0, 3).map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={[
                      styles.mediaThumbnail,
                      { backgroundColor: colors.borderLighter },
                    ]}
                  />
                ))}
                {draft.mediaFiles!.length > 3 && (
                  <View
                    style={[
                      styles.moreMediaOverlay,
                      { backgroundColor: colors.blackPure + "80" },
                    ]}
                  >
                    <Text
                      style={[styles.moreMediaText, { color: colors.white }]}
                    >
                      +{draft.mediaFiles!.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Meta Info */}
            <View style={styles.draftMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.textTertiary}
                />
                <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                  {formatDate(draft.lastModified)}
                </Text>
              </View>
              {hasMedia && (
                <>
                  <View
                    style={[
                      styles.metaDivider,
                      { backgroundColor: colors.textTertiary },
                    ]}
                  />
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="images-outline"
                      size={14}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.textTertiary }]}
                    >
                      {draft.mediaFiles!.length}{" "}
                      {draft.mediaFiles!.length === 1 ? "photo" : "photos"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteDraft(draft.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Drafts",
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
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Drafts
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                {drafts.length} {drafts.length === 1 ? "draft" : "drafts"} saved
              </Text>
            </View>
            {selectedDrafts.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.deleteSelectedButton,
                  { backgroundColor: colors.danger },
                ]}
                onPress={handleDeleteSelected}
              >
                <Ionicons name="trash" size={18} color={colors.white} />
                <Text
                  style={[styles.deleteSelectedText, { color: colors.white }]}
                >
                  Delete ({selectedDrafts.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Search & Select All */}
        {drafts.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.controlsContainer}
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
                placeholder="Search drafts..."
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
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={selectAll}
            >
              <Ionicons
                name={
                  selectedDrafts.length === filteredDrafts.length
                    ? "checkbox"
                    : "square-outline"
                }
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.selectAllText, { color: colors.primary }]}>
                {selectedDrafts.length === filteredDrafts.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Drafts List */}
        {filteredDrafts.length === 0 ? (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.emptyState}
          >
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: colors.borderLighter },
              ]}
            >
              <Ionicons
                name={searchQuery ? "search" : "document-text-outline"}
                size={72}
                color={colors.textTertiary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {searchQuery ? "No Results Found" : "No Drafts Yet"}
            </Text>
            <Text
              style={[styles.emptyDescription, { color: colors.textSecondary }]}
            >
              {searchQuery
                ? "Try searching with different keywords"
                : "Your unfinished posts will be saved here automatically"}
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredDrafts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DraftCard draft={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Info Card */}
        {drafts.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={[
              styles.infoCard,
              { backgroundColor: colors.primary + "10" },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Tap a draft to continue editing. Long press to select multiple
              drafts.
            </Text>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  deleteSelectedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  deleteSelectedText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  controlsContainer: {
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  selectAllText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Draft Card
  draftCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "transparent",
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  draftContent: {
    flex: 1,
  },
  draftText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaPreview: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  moreMediaOverlay: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  moreMediaText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  draftMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },

  // Info Card
  infoCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginLeft: 12,
    lineHeight: 18,
  },
});
