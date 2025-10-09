import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabButton = ({
  activeTab,
  setActiveTab,
  tab,
  label,
  icon,
  colors,
}: {
  activeTab: any;
  setActiveTab: any;
  tab: any;
  label: any;
  icon: any;
  colors: any;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && { backgroundColor: colors.tintBlue },
      ]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={activeTab === tab ? colors.primary : colors.textTertiary}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: colors.textTertiary },
          activeTab === tab && {
            color: colors.primary,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
      {activeTab === tab && (
        <View
          style={[styles.tabIndicator, { backgroundColor: colors.primary }]}
        />
      )}
    </TouchableOpacity>
  );
};

export default TabButton;

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    position: "relative",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    fontFamily: "DMSans_500Medium",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 2,
  },
});
