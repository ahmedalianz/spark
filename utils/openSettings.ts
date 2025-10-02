import { Alert, Linking, Platform } from "react-native";

export const openDeviceSettings = async () => {
  try {
    if (Platform.OS === "ios") {
      // iOS - opens general settings
      await Linking.openURL("App-Prefs:");
    } else {
      // Android - opens device settings
      await Linking.openSettings();
    }
  } catch (error) {
    console.error("Failed to open device settings:", error);
    fallbackToManualSettings();
  }
};

const fallbackToManualSettings = () => {
  Alert.alert(
    "Open Settings",
    "Please go to Settings > Apps > Spark to enable permissions.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => Linking.openSettings(),
      },
    ]
  );
};
