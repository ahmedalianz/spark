import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const FormGuidance = ({ colors }: { colors: ColorsType }) => {
  const tips = [
    {
      icon: "shield-checkmark-outline",
      text: "Your information is secure and encrypted",
    },
    {
      icon: "people-outline",
      text: "Connect with like-minded individuals",
    },
    {
      icon: "rocket-outline",
      text: "Start your journey with personalized features",
    },
  ];

  return (
    <View
      style={[
        styles.guidanceContainer,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <Text style={[styles.guidanceTitle, { color: colors.primary }]}>
        Why Join Us?
      </Text>

      <View style={styles.tipsList}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name={tip.icon as any} size={18} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              {tip.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  guidanceContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  guidanceTitle: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
});

export default FormGuidance;
