import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuickActions = ({ colors }: { colors: ColorsType }) => {
  const actions = [
    { icon: "add", label: "Story", gradient: true },
    { icon: "camera-outline", label: "Photo" },
    { icon: "videocam-outline", label: "Video" },
    { icon: "musical-notes-outline", label: "Live" },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      {actions.map((action, index) => (
        <TouchableOpacity key={index} style={styles.quickActionButton}>
          {action.gradient ? (
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.quickActionGradient}
            >
              <Ionicons
                name={action.icon as any}
                size={18}
                color={colors.white}
              />
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.quickActionSecondary,
                {
                  backgroundColor: colors.backgroundTertiary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={18}
                color={colors.iconPrimary}
              />
            </View>
          )}
          <Text
            style={[
              styles.quickActionText,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    justifyContent: "space-between",
  },
  quickActionButton: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  quickActionGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionSecondary: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
});
