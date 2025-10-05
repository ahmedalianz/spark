import { ColorsType } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProfileSkeleton({ colors }: { colors: ColorsType }) {
  return (
    <View style={styles.loadingMainContainer}>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View
            style={[
              styles.loadingLine,
              { width: "60%", backgroundColor: colors.borderLighter },
            ]}
          />
          <View
            style={[
              styles.loadingLine,
              { backgroundColor: colors.borderLighter },
            ]}
          />
          <View
            style={[
              styles.loadingLine,
              { width: "60%", backgroundColor: colors.borderLighter },
            ]}
          />
        </View>
        <View
          style={[
            styles.loadingAvatar,
            { backgroundColor: colors.borderLighter },
          ]}
        />
      </View>
      <View
        style={[
          styles.loadingBioLine,
          { backgroundColor: colors.borderLighter },
        ]}
      />
      <View style={styles.buttonsContainer}>
        <View
          style={[
            styles.loadingButton,
            { backgroundColor: colors.borderLighter },
          ]}
        />
        <View
          style={[
            styles.loadingButton,
            { backgroundColor: colors.borderLighter },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingMainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  loadingContent: {
    flex: 1,
    gap: 8,
  },
  loadingLine: {
    height: 16,
    borderRadius: 8,
    width: "80%",
  },
  loadingBioLine: {
    height: 16,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 60,
  },
  loadingButton: {
    height: 45,
    borderRadius: 12,
    width: "48%",
  },
});
