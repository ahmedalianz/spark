import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Router } from "expo-router";

const ProfileFirstHeader = ({
  router,
  signOutHandler,
}: {
  router: Router;
  signOutHandler: () => void;
}) => {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark, Colors.primaryDarker]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroGradient}
    >
      <View style={styles.heroContent}>
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
          <View style={styles.backButtonBackground}>
            <Ionicons name="chevron-back" size={18} color={Colors.white} />
          </View>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.heroActionButton}
            onPress={signOutHandler}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ProfileFirstHeader;

const styles = StyleSheet.create({
  heroGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButtonBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.transparentWhite20,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
    fontFamily: "DMSans_500Medium",
  },
  heroActions: {
    flexDirection: "row",
  },
  heroActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.transparentWhite20,
    justifyContent: "center",
    alignItems: "center",
  },
});
