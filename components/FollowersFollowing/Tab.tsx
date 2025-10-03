import { Colors } from "@/constants/Colors";
import { FollowTabProps, FollowTabType } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Tab = ({ activeTab, setActiveTab, follows, title }: FollowTabProps) => {
  const lowerCaseTitle = title.toLowerCase();
  return (
    <TouchableOpacity
      style={[styles.tab, activeTab === lowerCaseTitle && styles.activeTab]}
      onPress={() => setActiveTab(lowerCaseTitle as FollowTabType)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === lowerCaseTitle && styles.activeTabText,
        ]}
      >
        {title} {follows && `(${follows.length})`}
      </Text>
    </TouchableOpacity>
  );
};

export default Tab;

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
