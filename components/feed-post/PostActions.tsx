import { PostActionsProps } from "@/types";
import formatCount from "@/utils/formatCount";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PostActions: React.FC<PostActionsProps> = ({
  likeCount,
  commentCount,
  isLiked,
  scaleAnim,
  onLike,
  onComments,
  onShare,
  colors,
}) => {
  return (
    <View style={styles.actions}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isLiked && { backgroundColor: colors.borderLight },
          ]}
          onPress={onLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? colors.accentLike : colors.textTertiary}
          />
          <Text
            style={[
              styles.actionText,
              { color: colors.textTertiary },
              isLiked && { color: colors.accentLike },
            ]}
          >
            {formatCount(likeCount)}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.actionButton} onPress={onComments}>
        <Ionicons
          name="chatbubble-outline"
          size={22}
          color={colors.textTertiary}
        />
        <Text style={[styles.actionText, { color: colors.textTertiary }]}>
          {formatCount(commentCount)}
        </Text>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Feather name="send" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 60,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shareButton: {
    padding: 8,
    borderRadius: 16,
  },
});

export default PostActions;
