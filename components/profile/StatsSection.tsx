import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ColorsType } from "@/types";
import formatCount from "@/utils/formatCount";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StatsSection = ({
  userInfo,
  colors,
  viewedUserId,
}: {
  userInfo: Doc<"users">;
  viewedUserId?: Id<"users">;
  colors: ColorsType;
}) => {
  const router = useRouter();
  const mutualFollowers = useQuery(api.users.getMutualFollowers, {
    userId: viewedUserId,
  });

  const joinedDate = new Date(userInfo?.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const stats = [
    { value: userInfo?.postsCount, label: "Posts" },
    { value: formatCount(userInfo?.followersCount), label: "Followers" },
    { value: formatCount(userInfo?.followingsCount), label: "Following" },
  ];

  return (
    <View style={styles.statsContainer}>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statItem}
            onPress={() => index > 0 && router.push("/(auth)/(tabs)/followers")}
          >
            <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              {stat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Compact Info Cards */}
      <View style={styles.infoCards}>
        <View
          style={[styles.infoCard, { backgroundColor: colors.backgroundLight }]}
        >
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.textTertiary}
          />
          <Text style={[styles.infoCardText, { color: colors.textSecondary }]}>
            Joined {joinedDate}
          </Text>
        </View>

        {mutualFollowers && mutualFollowers.length > 0 && (
          <TouchableOpacity
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundLight },
            ]}
          >
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text
              style={[styles.infoCardText, { color: colors.textSecondary }]}
            >
              {mutualFollowers.length} mutual follower
              {mutualFollowers.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    paddingVertical: 4,
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
  infoCards: {
    flexDirection: "row",
    gap: 8,
  },
  infoCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    padding: 10,
  },
  infoCardText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    flex: 1,
  },
});
