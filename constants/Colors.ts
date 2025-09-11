import { Platform, PlatformColor } from "react-native";

export const Colors = {
  // Primary Colors
  primary: "#667eea",
  primaryDark: "#764ba2",

  // Neutral Colors
  white: "#fff",
  black: "#1a1a1a",
  background: "#FDF8FF",
  lightBackground: "#fafafa",
  cardBackground: "#f5f5f5",

  // Text Colors
  textSecondary: "#333",
  textTertiary: "#666",
  textQuaternary: "#888",
  textMuted: "#999",
  textDisabled: "#ccc",

  // Border & Divider Colors
  border: "#acacac",
  borderLight: "#e0e0e0",
  borderVeryLight: "#f0f0f0",

  // Semantic Colors
  like: "#ff3b5c",

  // Special Colors
  blueTint: "#e6eafe",
  blueTintLight: "#f8f9ff",

  // Transparent Colors
  white20: "rgba(255, 255, 255, 0.2)",
  white30: "rgba(255, 255, 255, 0.3)",
  white10: "rgba(255, 255, 255, 0.1)",
  // Dark Colors
  black30: "rgba(0,0,0,0.3)",
  black70: "rgba(0, 0, 0, 0.7)",

  // Platform Specific (keep your existing)
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
