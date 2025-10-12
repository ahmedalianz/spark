import { useToast } from "@/store/toastStore";
import * as Clipboard from "expo-clipboard";

const useCopyText = () => {
  const { showToast } = useToast();

  const copyText = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
      showToast("Text copied to clipboard!", "info");
    } catch (error) {
      showToast("Failed to copy text", "error");
      console.error(error);
    }
  };
  return { copyText };
};

export default useCopyText;
