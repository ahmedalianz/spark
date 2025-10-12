import { Doc } from "@/convex/_generated/dataModel";
import { ColorsType } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UserAvatar = ({
  userInfo,
  colors,
}: {
  userInfo: Doc<"users">;
  colors: ColorsType;
}) => {
  return (
    <Link asChild href={`/(auth)/(tabs)/profile`}>
      <TouchableOpacity>
        <View style={styles.userSection}>
          <Image
            source={{ uri: userInfo?.imageUrl as string }}
            style={[styles.avatar, { borderColor: colors.primary }]}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: colors.textSecondary }]}>
              {userInfo?.first_name} {userInfo?.last_name}
            </Text>
            <Text style={[styles.username, { color: colors.textTertiary }]}>
              @{userInfo?.email?.split("@")[0]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: "500",
  },
});
