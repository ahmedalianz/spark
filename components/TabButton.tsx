import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabButton = ({
  activeTab,
  setActiveTab,
  tab,
  label,
  icon,
}: {
  activeTab: any;
  setActiveTab: any;
  tab: any;
  label: any;
  icon: any;
}) => {
  return (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={activeTab === tab ? Colors.primary : Colors.textTertiary}
      />
      <Text
        style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}
      >
        {label}
      </Text>
      {activeTab === tab && <View style={styles.tabIndicator} />}
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
  tabButtonActive: {
    backgroundColor: Colors.tintBlueLight,
  },
  tabLabel: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: "500",
    marginTop: 4,
    fontFamily: "DMSans_500Medium",
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
