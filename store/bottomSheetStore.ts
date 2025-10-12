import { MenuSection } from "@/types";
import { Dimensions } from "react-native";
import { create } from "zustand";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
type ShowSheetProps = { sections: MenuSection[]; height?: string | number };
type BottomSheetState = {
  sections: MenuSection[];
  visible: boolean;
  height: string | number;
  showSheet: ({ sections, height }: ShowSheetProps) => void;
  hideSheet: () => void;
};
export const useBottomSheet = create<BottomSheetState>((set) => ({
  visible: false,
  sections: [],
  height: SCREEN_HEIGHT * 0.85,
  showSheet: ({ sections, height }: ShowSheetProps) => {
    set({ visible: true, sections, height });
  },
  hideSheet: () => set({ visible: false }),
}));
