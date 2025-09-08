import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export type tabEnum = "Threads" | "Reposts" | "Replies";
type TabsProps = {
  onTabChange: (tab: tabEnum) => void;
};

const Tabs = ({ onTabChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState("Threads");
  const tabs: tabEnum[] = ["Threads", "Replies", "Reposts"];
  const handleTabPress = (tab: tabEnum) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => handleTabPress(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 12,
  },
  tabText: {
    color: Colors.border,
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },

  activeTab: {
    borderBottomColor: "black",
  },
});

export default Tabs;
