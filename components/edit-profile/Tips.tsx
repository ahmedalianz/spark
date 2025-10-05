import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Tips = ({ colors }: { colors: ColorsType }) => {
  return (
    <View
      style={[styles.tipsContainer, { backgroundColor: colors.tintBlueLight }]}
    >
      <Text style={[styles.tipsTitle, { color: colors.black }]}>
        Profile Tips
      </Text>
      <View style={styles.tip}>
        <Ionicons name="bulb-outline" size={16} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.textTertiary }]}>
          A good bio helps others understand who you are
        </Text>
      </View>
      <View style={styles.tip}>
        <Ionicons name="link-outline" size={16} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.textTertiary }]}>
          Share your website or portfolio to showcase your work
        </Text>
      </View>
    </View>
  );
};

export default Tips;

const styles = StyleSheet.create({
  tipsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    fontFamily: "DMSans_700Bold",
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "DMSans_400Regular",
  },
});
