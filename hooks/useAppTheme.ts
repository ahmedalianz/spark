import { Colors, DarkColors } from "@/constants/Colors";
import { useThemeStore } from "@/store/themeStore";
import { useMemo } from "react";
import { Appearance } from "react-native";

const useAppTheme = () => {
  const { fontSizeScale, theme } = useThemeStore();
  let colors = {
    ...Colors,
  };
  const colorScheme = Appearance.getColorScheme();
  if (theme === "dark" || (theme === "system" && colorScheme === "dark")) {
    colors = {
      ...Colors,
      ...DarkColors,
    };
  }
  const FontSizes = useMemo(
    () => ({
      display: {
        large: 32 * fontSizeScale,
        medium: 28 * fontSizeScale,
        small: 24 * fontSizeScale,
      },
      title: {
        xlarge: 22 * fontSizeScale,
        large: 20 * fontSizeScale,
        medium: 18 * fontSizeScale,
      },
      body: {
        large: 17 * fontSizeScale,
        medium: 16 * fontSizeScale,
        small: 15 * fontSizeScale,
        xsmall: 14 * fontSizeScale,
        xxsmall: 13 * fontSizeScale,
      },
      caption: {
        medium: 12 * fontSizeScale,
        small: 11 * fontSizeScale,
      },
    }),
    [fontSizeScale]
  );
  return { colors, FontSizes };
};

export default useAppTheme;
