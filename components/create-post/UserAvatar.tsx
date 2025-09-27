import { Colors } from "@/constants/Colors";
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const UserAvatar = ({ userInfo }: { userInfo: Doc<"users"> }) => {
  return (
    <View style={styles.userSection}>
      <Image
        source={{ uri: userInfo?.imageUrl as string }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>
          {userInfo?.first_name} {userInfo?.last_name}
        </Text>
        <Text style={styles.username}>@{userInfo?.email?.split("@")[0]}</Text>
      </View>
    </View>
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
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
});
