import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ColorsType } from "@/types";
import formatCount from "@/utils/formatCount";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";

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
    year: "numeric",
    month: "long",
  });

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statButton}>
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {userInfo?.postsCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
            Posts
          </Text>
        </View>

        <TouchableOpacity
          style={styles.statButton}
          onPress={() => router.push("/(auth)/(tabs)/followers")}
        >
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {formatCount(userInfo?.followersCount)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
            Followers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statButton}
          onPress={() => router.push("/(auth)/(tabs)/followers")}
        >
          <Text style={[styles.statNumber, { color: colors.textPrimary }]}>
            {formatCount(userInfo?.followingsCount)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info Cards */}
      <View style={styles.infoCards}>
        <View
          style={[styles.infoCard, { backgroundColor: colors.backgroundLight }]}
        >
          <View style={styles.infoCardContent}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textTertiary}
            />
            <Text
              style={[styles.infoCardText, { color: colors.textSecondary }]}
            >
              Joined {joinedDate}
            </Text>
          </View>
        </View>

        {mutualFollowers && mutualFollowers.length > 0 && (
          <TouchableOpacity
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundLight },
            ]}
          >
            <View style={styles.infoCardContent}>
              <Ionicons
                name="people-outline"
                size={16}
                color={colors.primary}
              />
              <Text
                style={[styles.infoCardText, { color: colors.textSecondary }]}
              >
                Followed by {mutualFollowers?.[0]?.first_name}
                {mutualFollowers.length > 1 &&
                  ` +${mutualFollowers.length - 1} others`}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "DMSans_400Regular",
  },
  infoCards: {
    gap: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 12,
  },
  infoCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoCardText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
});
