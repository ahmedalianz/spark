import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const QuickActions = ({ colors }: { colors: ColorsType }) => {
  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity style={styles.quickActionButton}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.quickActionGradient}
        >
          <Ionicons name="add" size={20} color={colors.white} />
        </LinearGradient>
        <Text
          style={[
            styles.quickActionText,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Story
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View
          style={[
            styles.quickActionSecondary,
            {
              backgroundColor: colors.tintBlueLight,
              borderColor: colors.tintBlue,
            },
          ]}
        >
          <Ionicons name="camera-outline" size={20} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.quickActionText,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Photo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View
          style={[
            styles.quickActionSecondary,
            {
              backgroundColor: colors.tintBlueLight,
              borderColor: colors.tintBlue,
            },
          ]}
        >
          <Ionicons name="videocam-outline" size={20} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.quickActionText,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Video
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View
          style={[
            styles.quickActionSecondary,
            {
              backgroundColor: colors.tintBlueLight,
              borderColor: colors.tintBlue,
            },
          ]}
        >
          <Ionicons
            name="musical-notes-outline"
            size={20}
            color={colors.primary}
          />
        </View>
        <Text
          style={[
            styles.quickActionText,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Live
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    justifyContent: "space-around",
  },
  quickActionButton: {
    alignItems: "center",
    gap: 8,
  },
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,

    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
});
