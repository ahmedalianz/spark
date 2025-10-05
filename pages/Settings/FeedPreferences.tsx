import useAppTheme from "@/hooks/useAppTheme";
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
  const { colors } = useAppTheme();
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
      style={[
        styles.sortOption,
        {
          backgroundColor: colors.white,
          borderColor: colors.borderLight,
        },
        isSelected && {
          borderColor: colors.primary,
          backgroundColor: colors.primary + "08",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sortOptionContent}>
        <View
          style={[
            styles.sortIconContainer,
            { backgroundColor: colors.borderLighter },
            isSelected && { backgroundColor: colors.primary + "15" },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={24}
            color={isSelected ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.sortTextContainer}>
          <Text
            style={[
              styles.sortTitle,
              { color: colors.textPrimary },
              isSelected && { color: colors.primary },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[styles.sortDescription, { color: colors.textSecondary }]}
          >
            {description}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark" size={18} color={colors.white} />
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
      style={[
        styles.languageChip,
        {
          backgroundColor: colors.white,
          borderColor: colors.borderLight,
        },
        isSelected && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.languageChipText,
          { color: colors.textSecondary },
          isSelected && { color: colors.white },
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
    <View style={[styles.toggleCard, { backgroundColor: colors.white }]}>
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
          <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text
            style={[styles.toggleSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          onChange(val);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        trackColor={{ false: colors.borderLight, true: iconColor + "50" }}
        thumbColor={value ? iconColor : colors.white}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed Preferences",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Feed Preferences
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Customize what you see in your feed
          </Text>
        </Animated.View>

        {/* Feed Sort */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Feed Sort
          </Text>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Content Language
          </Text>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Content Visibility
          </Text>
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Media Preferences
          </Text>
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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Sensitive Content
          </Text>
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
          style={[styles.infoCard, { backgroundColor: colors.primary + "10" }]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
  },

  // Feed Sort Options
  sortOption: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  sortOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sortTextContainer: {
    flex: 1,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  sortDescription: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  checkCircle: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
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
    borderWidth: 2,
  },
  languageChipText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  // Toggle Settings
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },

  // Info Card
  infoCard: {
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
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },

  bottomSpacer: {
    height: 40,
  },
});
