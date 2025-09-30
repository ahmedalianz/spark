import { Colors } from "@/constants/Colors";
import formatCount from "@/utils/formatCount";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PostEngagementProps {
  likeCount: number;
  commentCount: number;
  onCommentsPress: () => void;
}

const PostEngagement: React.FC<PostEngagementProps> = ({
  likeCount,
  commentCount,
  onCommentsPress,
}) => {
  if (likeCount <= 0 && commentCount <= 0) return null;

  return (
    <View style={styles.statsBar}>
      <View style={styles.statsRow}>
        {likeCount > 0 && (
          <Text style={styles.statText}>
            {formatCount(likeCount)} {likeCount === 1 ? "like" : "likes"}
          </Text>
        )}
        {commentCount > 0 && (
          <TouchableOpacity onPress={onCommentsPress}>
            <Text style={styles.statTextClickable}>
              {formatCount(commentCount)}{" "}
              {commentCount === 1 ? "comment" : "comments"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  statsBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLighter,
    paddingVertical: 8,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  statTextClickable: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: "DMSans_500Medium",
  },
});
export default PostEngagement;
