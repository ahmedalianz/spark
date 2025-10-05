import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";

const Error = () => {
  const { colors } = useAppTheme();
  const router = useRouter();
  return (
    <View
      style={[
        styles.errorContainer,
        { backgroundColor: colors.backgroundLight },
      ]}
    >
      <Ionicons name="alert-circle-outline" size={48} color={colors.primary} />
      <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
        Oops! Something went wrong
      </Text>
      <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
        {"We couldn’t load This Screen. Please try again."}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={() => router.replace(`/(auth)/(tabs)/feed`)}
      >
        <Text style={[styles.retryButtonText, { color: colors.white }]}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
});
