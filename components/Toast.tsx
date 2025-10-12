import useAppTheme from "@/hooks/useAppTheme";
import { useToast } from "@/store/toastStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Toast: React.FC = () => {
  const { message, type, visible } = useToast();
  const { colors } = useAppTheme();
  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "info":
        return colors.background;
      default:
        return colors.success;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return colors.white;
      case "error":
        return colors.white;
      case "info":
        return colors.textPrimary;
      default:
        return colors.white;
    }
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "info":
        return "information-circle";
      default:
        return "checkmark-circle";
    }
  };

  return (
    <View
      style={[
        styles.toastContainer,
        {
          backgroundColor: getBackgroundColor(),
          shadowColor: colors.blackPure,
        },
      ]}
    >
      <Ionicons name={getIconName()} size={20} color={getTextColor()} />
      <Text style={[styles.toastText, { color: getTextColor() }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  toastText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    textAlign: "center",
    flex: 1,
  },
});

export default Toast;
