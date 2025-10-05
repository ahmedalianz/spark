import useAppTheme from "@/hooks/useAppTheme";
import { Theme, useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FontSize = "small" | "medium" | "large" | "extra-large";
const scales: Record<string, number> = {
  small: 0.8,
  medium: 1,
  large: 1.2,
  "extra-large": 1.4,
};

const AppearanceScreen = () => {
  const { fontSizeScale, theme, setFontSizeScale, setTheme } = useThemeStore();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);
  const [selectedFontSize, setSelectedFontSize] = useState<FontSize>(
    Object.keys(scales).find((key) => scales[key] === fontSizeScale) as FontSize
  );
  const { colors, FontSizes } = useAppTheme();

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFontSizeSelect = (size: FontSize) => {
    setSelectedFontSize(size);
    setFontSizeScale(scales[size]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const themes: {
    value: Theme;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: "sunny",
      description: "Classic light theme",
    },
    {
      value: "dark",
      label: "Dark",
      icon: "moon",
      description: "Easy on the eyes",
    },
    {
      value: "system",
      label: "Auto",
      icon: "contrast",
      description: "Match system",
    },
  ];

  const fontSizes: { value: FontSize; label: string; preview: number }[] = [
    { value: "small", label: "Small", preview: FontSizes.body.xsmall },
    { value: "medium", label: "Medium", preview: FontSizes.body.medium },
    { value: "large", label: "Large", preview: FontSizes.title.medium },
    {
      value: "extra-large",
      label: "Extra Large",
      preview: FontSizes.title.large,
    },
  ];
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            {
              color: colors.textPrimary,
              fontSize: FontSizes.display.large,
            },
          ]}
        >
          Appearance
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color: colors.textSecondary,
              fontSize: FontSizes.body.medium,
            },
          ]}
        >
          Customize how Spark looks and feels
        </Text>
      </Animated.View>

      {/* Theme Selection */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.section}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: FontSizes.title.large,
            },
          ]}
        >
          Theme
        </Text>
        <View style={styles.themeContainer}>
          {themes.map((theme, index) => {
            const isSelected = selectedTheme === theme.value;
            return (
              <TouchableOpacity
                key={theme.value}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: colors.white,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.borderLight,
                  },
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + "08",
                  },
                ]}
                onPress={() => handleThemeSelect(theme.value)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.themeIconContainer,
                    {
                      backgroundColor: isSelected
                        ? colors.primary + "15"
                        : colors.borderLighter,
                    },
                  ]}
                >
                  <Ionicons
                    name={theme.icon as any}
                    size={28}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.themeLabel,
                    {
                      color: isSelected ? colors.primary : colors.textPrimary,
                      fontSize: FontSizes.body.medium,
                    },
                  ]}
                >
                  {theme.label}
                </Text>
                <Text
                  style={[
                    styles.themeDescription,
                    {
                      color: colors.textTertiary,
                      fontSize: FontSizes.caption.medium,
                    },
                  ]}
                >
                  {theme.description}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.checkBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Font Size */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.section}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: FontSizes.title.large,
            },
          ]}
        >
          Font Size
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: colors.textSecondary,
              fontSize: FontSizes.body.xsmall,
            },
          ]}
        >
          Make text easier to read
        </Text>
        <View style={styles.fontSizeContainer}>
          {fontSizes.map((font) => {
            const isSelected = selectedFontSize === font.value;
            return (
              <TouchableOpacity
                key={font.value}
                style={[
                  styles.fontSizeCard,
                  {
                    backgroundColor: colors.white,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.borderLight,
                  },
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + "08",
                  },
                ]}
                onPress={() => handleFontSizeSelect(font.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.fontSizePreview,
                    {
                      fontSize: font.preview,
                      color: isSelected ? colors.primary : colors.textTertiary,
                    },
                  ]}
                >
                  Aa
                </Text>
                <Text
                  style={[
                    styles.fontSizeLabel,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
                      fontSize: FontSizes.caption.medium,
                    },
                  ]}
                >
                  {font.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Font Preview */}
        <View style={[styles.previewCard, { backgroundColor: colors.white }]}>
          <Text
            style={[
              styles.previewText,
              {
                fontSize:
                  fontSizes.find((f) => f.value === selectedFontSize)
                    ?.preview || FontSizes.body.medium,
                color: colors.textPrimary,
              },
            ]}
          >
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>
      </Animated.View>

      {/* Preview Section */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400)}
        style={styles.section}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: FontSizes.title.large,
            },
          ]}
        >
          Preview
        </Text>
        <View
          style={[styles.previewContainer, { backgroundColor: colors.white }]}
        >
          <View style={styles.previewPost}>
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewAvatar,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View style={styles.previewUserInfo}>
                <Text
                  style={[
                    styles.previewUsername,
                    {
                      color: colors.textPrimary,
                      fontSize: FontSizes.body.medium,
                    },
                  ]}
                >
                  Ahmed Ali
                </Text>
                <Text
                  style={[
                    styles.previewTimestamp,
                    {
                      color: colors.textTertiary,
                      fontSize: FontSizes.body.xxsmall,
                    },
                  ]}
                >
                  2h ago
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.previewPostText,
                {
                  fontSize:
                    fontSizes.find((f) => f.value === selectedFontSize)
                      ?.preview || FontSizes.body.medium,
                  color: colors.textPrimary,
                },
              ]}
            >
              This is how your posts will look with your selected appearance
              settings.
            </Text>
            <View style={styles.previewActions}>
              <View style={styles.previewActionButton}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.previewActionText,
                    {
                      color: colors.textSecondary,
                      fontSize: FontSizes.body.xsmall,
                    },
                  ]}
                >
                  42
                </Text>
              </View>
              <View style={styles.previewActionButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.previewActionText,
                    {
                      color: colors.textSecondary,
                      fontSize: FontSizes.body.xsmall,
                    },
                  ]}
                >
                  12
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default AppearanceScreen;

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
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: "DMSans_400Regular",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
  },

  // Theme Styles
  themeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  themeCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
  },
  themeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  themeLabel: {
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  themeDescription: {
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Font Size Styles
  fontSizeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  fontSizeCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  fontSizePreview: {
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  fontSizeLabel: {
    fontFamily: "DMSans_500Medium",
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  previewText: {
    fontFamily: "DMSans_400Regular",
    lineHeight: 24,
  },

  // Preview Styles
  previewContainer: {
    borderRadius: 16,
    padding: 16,
  },
  previewPost: {
    gap: 12,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  previewUserInfo: {
    flex: 1,
  },
  previewUsername: {
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  previewTimestamp: {
    fontFamily: "DMSans_400Regular",
  },
  previewPostText: {
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
  },
  previewActions: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 8,
  },
  previewActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewActionText: {
    fontFamily: "DMSans_500Medium",
  },
  bottomSpacer: {
    height: 40,
  },
});
