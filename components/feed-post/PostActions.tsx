import { Colors } from "@/constants/Colors";
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

interface PostActionsProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  scaleAnim: Animated.Value;
  onLike: () => void;
  onComments: () => void;
  onShare: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  likeCount,
  commentCount,
  isLiked,
  scaleAnim,
  onLike,
  onComments,
  onShare,
}) => {
  return (
    <View style={styles.actions}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.actionButton, isLiked && styles.likedButton]}
          onPress={onLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? Colors.accentLike : Colors.textTertiary}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {formatCount(likeCount)}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.actionButton} onPress={onComments}>
        <Ionicons
          name="chatbubble-outline"
          size={22}
          color={Colors.textTertiary}
        />
        <Text style={styles.actionText}>{formatCount(commentCount)}</Text>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Feather name="send" size={20} color={Colors.textTertiary} />
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
  likedButton: {
    backgroundColor: Colors.borderSecondary,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  likedText: {
    color: Colors.accentLike,
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
