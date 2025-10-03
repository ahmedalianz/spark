import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Tips = () => {
  return (
    <View style={styles.tipsContainer}>
      <Text style={styles.tipsTitle}>Profile Tips</Text>
      <View style={styles.tip}>
        <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
        <Text style={styles.tipText}>
          A good bio helps others understand who you are
        </Text>
      </View>
      <View style={styles.tip}>
        <Ionicons name="link-outline" size={16} color={Colors.primary} />
        <Text style={styles.tipText}>
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
    backgroundColor: Colors.tintBlueLight,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
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
    color: Colors.textTertiary,
    lineHeight: 20,
    fontFamily: "DMSans_400Regular",
  },
});
