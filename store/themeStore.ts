import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSizeScale: number;
  setFontSizeScale: (scale: number) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // initial state
      theme: "system",
      fontSizeScale: 1,

      // setters
      setTheme: (theme: Theme) => set({ theme }),
      setFontSizeScale: (fontSizeScale: number) => set({ fontSizeScale }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
