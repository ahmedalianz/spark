import { FollowTabProps, FollowTabType } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Tab = ({
  activeTab,
  setActiveTab,
  follows,
  title,
  colors,
}: FollowTabProps) => {
  const lowerCaseTitle = title.toLowerCase();
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === lowerCaseTitle && {
          borderBottomWidth: 3,
          borderBottomColor: colors.primary,
        },
      ]}
      onPress={() => setActiveTab(lowerCaseTitle as FollowTabType)}
    >
      <Text
        style={[
          styles.tabText,
          { color: colors.textTertiary },
          activeTab === lowerCaseTitle && {
            color: colors.primary,
            fontWeight: "700",
          },
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
  tabText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
