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

  // Platform Specific
  ...Platform.select({
    ios: {
      submit: PlatformColor("systemBlueColor"),
    },
    android: {
      submit: PlatformColor("@android:color/system_primary_light"),
    },
    default: { submit: "black" },
  }),
};
