import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const QuickActions = () => {
  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity style={styles.quickActionButton}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.quickActionGradient}
        >
          <Ionicons name="add" size={20} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.quickActionText}>Story</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionSecondary}>
          <Ionicons name="camera-outline" size={20} color={Colors.primary} />
        </View>
        <Text style={styles.quickActionText}>Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionSecondary}>
          <Ionicons name="videocam-outline" size={20} color={Colors.primary} />
        </View>
        <Text style={styles.quickActionText}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickActionButton}>
        <View style={styles.quickActionSecondary}>
          <Ionicons
            name="musical-notes-outline"
            size={20}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.quickActionText}>Live</Text>
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
    backgroundColor: Colors.tintBlueLight,
    borderWidth: 1,
    borderColor: Colors.tintBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
});
