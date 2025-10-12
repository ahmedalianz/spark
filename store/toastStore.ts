import { create } from "zustand";
type MessageType = "info" | "success" | "error";
export type ToastState = {
  message: string;
  type: MessageType;
  showToast: (message: string, type?: MessageType) => void;
  visible: boolean;
  hideToast: () => void;
};
export const useToast = create<ToastState>((set) => ({
  message: "",
  type: "info",
  visible: false,
  showToast: (message: string, type?: MessageType) => {
    set({ visible: true, message, type });
    setTimeout(() => set({ visible: false }), 3000);
  },
  hideToast: () => set({ visible: false }),
}));
