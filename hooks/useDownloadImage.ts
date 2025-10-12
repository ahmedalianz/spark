import { useToast } from "@/store/toastStore";
import * as FileSystem from "expo-file-system";
import * as MediLibrary from "expo-media-library";
import { useCallback } from "react";

const useDownloadImage = () => {
  const { showToast } = useToast();

  const downloadImage = useCallback(async (uri: string) => {
    try {
      const { status } = await MediLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showToast("Photo library permission required", "error");
        return;
      }
      const fileUri = FileSystem.documentDirectory + `spark_${Date.now()}.jpg`;
      const { uri: mediaFile } = await FileSystem.downloadAsync(uri, fileUri);
      await MediLibrary.saveToLibraryAsync(mediaFile);
      await FileSystem.deleteAsync(mediaFile);
      showToast("Image saved to your photo gallery!", "success");
    } catch (error) {
      showToast("Failed to save image. Please try again.", "error");
      console.log(error);
    }
  }, []);
  return {
    downloadImage,
  };
};

export default useDownloadImage;
