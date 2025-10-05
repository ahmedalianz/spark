import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

type FeedSort = "algorithmic" | "chronological" | "following";
type ContentLanguage = "all" | "english" | "arabic" | "french";

export default function FeedPreferencesScreen() {
  const [feedSort, setFeedSort] = useState<FeedSort>("algorithmic");
  const [contentLanguage, setContentLanguage] =
    useState<ContentLanguage>("all");
  const [showReposts, setShowReposts] = useState(true);
  const [showLikedPosts, setShowLikedPosts] = useState(true);
  const [showRecommended, setShowRecommended] = useState(true);
  const [showTrending, setShowTrending] = useState(true);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);

  const FeedSortOption = ({
    icon,
    title,
    description,
    value,
    isSelected,
    onPress,
  }: {
    icon: string;
    title: string;
    description: string;
    value: FeedSort;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.sortOption, isSelected && styles.sortOptionSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sortOptionContent}>
        <View
          style={[
            styles.sortIconContainer,
            isSelected && styles.sortIconContainerSelected,
          ]}
        >
          <Ionicons
            name={icon as any}
            size={24}
            color={isSelected ? Colors.primary : Colors.textSecondary}
          />
        </View>
        <View style={styles.sortTextContainer}>
          <Text
            style={[styles.sortTitle, isSelected && styles.sortTitleSelected]}
          >
            {title}
          </Text>
          <Text style={styles.sortDescription}>{description}</Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={18} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  const LanguageChip = ({
    label,
    value,
    isSelected,
    onPress,
  }: {
    label: string;
    value: ContentLanguage;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.languageChip, isSelected && styles.languageChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.languageChipText,
          isSelected && styles.languageChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ToggleSetting = ({
    icon,
    title,
    subtitle,
    value,
    onChange,
    iconColor,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor: string;
  }) => (
    <View style={styles.toggleCard}>
      <View style={styles.toggleContent}>
        <View
          style={[
            styles.toggleIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          onChange(val);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        trackColor={{ false: Colors.borderLight, true: iconColor + "50" }}
        thumbColor={value ? iconColor : Colors.white}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed Preferences",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.headerTitle}>Feed Preferences</Text>
          <Text style={styles.headerSubtitle}>
            Customize what you see in your feed
          </Text>
        </Animated.View>

        {/* Feed Sort */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Feed Sort</Text>
          <Text style={styles.sectionDescription}>
            Choose how posts are ordered in your feed
          </Text>
          <FeedSortOption
            icon="sparkles"
            title="Algorithmic"
            description="Smart feed based on your interests"
            value="algorithmic"
            isSelected={feedSort === "algorithmic"}
            onPress={() => {
              setFeedSort("algorithmic");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <FeedSortOption
            icon="time-outline"
            title="Chronological"
            description="Latest posts first"
            value="chronological"
            isSelected={feedSort === "chronological"}
            onPress={() => {
              setFeedSort("chronological");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <FeedSortOption
            icon="people-outline"
            title="Following Only"
            description="Only from accounts you follow"
            value="following"
            isSelected={feedSort === "following"}
            onPress={() => {
              setFeedSort("following");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </Animated.View>

        {/* Content Language */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Content Language</Text>
          <Text style={styles.sectionDescription}>
            Select languages for your feed content
          </Text>
          <View style={styles.languageContainer}>
            <LanguageChip
              label="All Languages"
              value="all"
              isSelected={contentLanguage === "all"}
              onPress={() => {
                setContentLanguage("all");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <LanguageChip
              label="English"
              value="english"
              isSelected={contentLanguage === "english"}
              onPress={() => {
                setContentLanguage("english");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <LanguageChip
              label="العربية"
              value="arabic"
              isSelected={contentLanguage === "arabic"}
              onPress={() => {
                setContentLanguage("arabic");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <LanguageChip
              label="Français"
              value="french"
              isSelected={contentLanguage === "french"}
              onPress={() => {
                setContentLanguage("french");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>
        </Animated.View>

        {/* Content Visibility */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Content Visibility</Text>
          <ToggleSetting
            icon="repeat-outline"
            title="Show Reposts"
            subtitle="See posts shared by people you follow"
            value={showReposts}
            onChange={setShowReposts}
            iconColor="#10B981"
          />
          <ToggleSetting
            icon="heart-outline"
            title="Show Liked Posts"
            subtitle="See posts liked by people you follow"
            value={showLikedPosts}
            onChange={setShowLikedPosts}
            iconColor="#E4304F"
          />
          <ToggleSetting
            icon="compass-outline"
            title="Show Recommended"
            subtitle="Discover posts from accounts you don't follow"
            value={showRecommended}
            onChange={setShowRecommended}
            iconColor="#8B5CF6"
          />
          <ToggleSetting
            icon="flame-outline"
            title="Show Trending"
            subtitle="See what's popular right now"
            value={showTrending}
            onChange={setShowTrending}
            iconColor="#F97316"
          />
        </Animated.View>

        {/* Media Preferences */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Media Preferences</Text>
          <ToggleSetting
            icon="play-circle-outline"
            title="Autoplay Videos"
            subtitle="Videos start playing automatically"
            value={autoplayVideos}
            onChange={setAutoplayVideos}
            iconColor="#3B82F6"
          />
        </Animated.View>

        {/* Sensitive Content */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Sensitive Content</Text>
          <ToggleSetting
            icon="warning-outline"
            title="Show Sensitive Content"
            subtitle="Display potentially sensitive media"
            value={showSensitiveContent}
            onChange={setShowSensitiveContent}
            iconColor="#EF4444"
          />
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.infoCard}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.infoText}>
            These settings help personalize your feed. Changes may take a few
            moments to apply.
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
  },

  // Feed Sort Options
  sortOption: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  sortOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "08",
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.borderLighter,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sortIconContainerSelected: {
    backgroundColor: Colors.primary + "15",
  },
  sortTextContainer: {
    flex: 1,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  sortTitleSelected: {
    color: Colors.primary,
  },
  sortDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },
  checkCircle: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Language Chips
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  languageChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  languageChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languageChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
    fontFamily: "DMSans_600SemiBold",
  },
  languageChipTextSelected: {
    color: Colors.white,
  },

  // Toggle Settings
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.primary + "10",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },

  bottomSpacer: {
    height: 40,
  },
});
