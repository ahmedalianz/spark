import { Platform, PlatformColor } from "react-native";

export const Colors = {
  // Primary Colors
  primary: "#667eea",
  primaryDark: "#764ba2",
  primaryDarker: "#1a365d",
  primaryLight: "#a8b4ff",

  // Neutral Colors
  white: "#fff",
  black: "#1a1a1a",
  blackDark: "#111",
  blackPure: "#000",
  background: "#FDF8FF",
  backgroundLight: "#fafafa",
  backgroundCard: "#f5f5f5",
  backgroundSecondary: "#F8F9FA",
  // Text Colors
  textPrimary: "#1a1a1a",
  textSecondary: "#333",
  textTertiary: "#666",
  textQuaternary: "#888",
  textMuted: "#999",
  textDisabled: "#ccc",

  // Border & Divider Colors
  border: "#acacac",
  borderLight: "#e0e0e0",
  borderLighter: "#f0f0f0",
  borderDisabled: "#c0c0c0",
  borderSecondary: "#fff0f3",
  borderTertiary: "#f1f3f4",
  borderBackground: "#e1e5e9",

  // Semantic Colors
  accentLike: "#ff3b5c",
  iconContainer: "#f8f9fa",
  iconBackground: "#e9ecef",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  error: "#EF4444",
  online: "#00C851",
  danger: "#ff3b5c",
  // Special Colors
  tintBlue: "#e6eafe",
  tintBlueLight: "#f8f9ff",

  // Transparent Colors
  transparentWhite10: "rgba(255, 255, 255, 0.1)",
  transparentWhite20: "rgba(255, 255, 255, 0.2)",
  transparentWhite30: "rgba(255, 255, 255, 0.3)",
  transparentWhite70: "rgba(255, 255, 255, 0.7)",
  transparentWhite80: "rgba(255, 255, 255, 0.8)",
  transparentWhite90: "rgba(255, 255, 255, 0.9)",

  transparentBlack04: "rgba(0,0,0,0.04)",
  transparentBlack08: "rgba(0,0,0,0.08)",
  transparentBlack15: "rgba(0,0,0,0.15)",
  transparentBlack30: "rgba(0,0,0,0.3)",
  transparentBlack50: "rgba(0,0,0,0.5)",
  transparentBlack70: "rgba(0, 0, 0, 0.7)",

  // Splash Colors
  splashColor1: "#3a94d8ff",
  splashColor2: "#b8c6edff",
  splashColor3: "#042561ff",
};
export const DarkColors = {
  // Primary Colors (same as light theme for consistency)
  primary: "#667eea",
  primaryDark: "#764ba2",
  primaryDarker: "#1a365d",
  primaryLight: "#a8b4ff",

  // Neutral Colors - Dark backgrounds
  white: "#0a0a0a", // Dark background becomes "white"
  black: "#f5f5f5", // Light text becomes "black"
  blackDark: "#ffffff",
  blackPure: "#ffffff",
  background: "#0f0f15", // Deep dark blue-gray
  backgroundLight: "#1a1a23", // Slightly lighter dark
  backgroundCard: "#1e1e28", // Card backgrounds
  backgroundSecondary: "#151520", // Secondary backgrounds

  // Text Colors - Light text on dark
  textPrimary: "#f5f5f7", // Primary text - almost white
  textSecondary: "#b0b0b8", // Secondary text - light gray
  textTertiary: "#8a8a93", // Tertiary text - medium gray
  textQuaternary: "#6a6a73", // Quaternary text - darker gray
  textMuted: "#5a5a63", // Muted text
  textDisabled: "#4a4a53", // Disabled text

  // Border & Divider Colors - Subtle dark borders
  border: "#3a3a45", // Main borders
  borderLight: "#2a2a35", // Light borders
  borderLighter: "#252530", // Lightest borders
  borderDisabled: "#353540", // Disabled borders
  borderSecondary: "#2a2535", // Secondary borders
  borderTertiary: "#252530", // Tertiary borders
  borderBackground: "#2a2a35", // Border backgrounds

  // Semantic Colors - Adjusted for dark mode
  accentLike: "#ff6b8b", // Brighter pink for better contrast
  iconContainer: "#1a1a23", // Dark icon containers
  iconBackground: "#252530", // Dark icon backgrounds
  success: "#34d399", // Brighter green
  warning: "#fbbf24", // Brighter yellow
  info: "#60a5fa", // Brighter blue
  error: "#f87171", // Brighter red
  online: "#10b981", // Online indicator
  danger: "#ff6b8b", // Danger - brighter pink

  // Special Colors - Dark variants
  tintBlue: "#1e1e38", // Dark blue tint
  tintBlueLight: "#252540", // Lighter dark blue tint

  // Transparent Colors - Adjusted for dark backgrounds
  transparentWhite10: "rgba(10, 10, 15, 0.1)",
  transparentWhite20: "rgba(10, 10, 15, 0.2)",
  transparentWhite30: "rgba(10, 10, 15, 0.3)",
  transparentWhite70: "rgba(10, 10, 15, 0.7)",
  transparentWhite80: "rgba(10, 10, 15, 0.8)",
  transparentWhite90: "rgba(10, 10, 15, 0.9)",

  transparentBlack04: "rgba(245, 245, 245, 0.04)",
  transparentBlack08: "rgba(245, 245, 245, 0.08)",
  transparentBlack15: "rgba(245, 245, 245, 0.15)",
  transparentBlack30: "rgba(245, 245, 245, 0.3)",
  transparentBlack50: "rgba(245, 245, 245, 0.5)",
  transparentBlack70: "rgba(245, 245, 245, 0.7)",

  // Splash Colors - Dark variants
  splashColor1: "#1a4a7a", // Darker blue
  splashColor2: "#2a3a5a", // Darker purple-blue
  splashColor3: "#0a1a3a", // Darker navy

  // Platform Specific (same as light)
  ...Platform.select({
    ios: {
      submit: PlatformColor("systemBlueColor"),
    },
    android: {
      submit: PlatformColor("@android:color/system_primary_light"),
    },
    default: { submit: "#667eea" }, // Use primary color as fallback
  }),
};
