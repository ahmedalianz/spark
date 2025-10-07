import { PostEngagementProps } from "@/types";
import formatCount from "@/utils/formatCount";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostEngagement: React.FC<PostEngagementProps> = ({
  likeCount,
  commentCount,
  onCommentsPress,
  colors,
}) => {
  if (likeCount <= 0 && commentCount <= 0) return null;

  return (
    <View style={[styles.statsBar, { borderColor: colors.border }]}>
      <View style={styles.statsRow}>
        {likeCount > 0 && (
          <Text style={[styles.statText, { color: colors.textTertiary }]}>
            {formatCount(likeCount)} {likeCount === 1 ? "like" : "likes"}
          </Text>
        )}
        {commentCount > 0 && (
          <TouchableOpacity onPress={onCommentsPress}>
            <Text style={[styles.statTextClickable, { color: colors.primary }]}>
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
    paddingVertical: 8,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  statTextClickable: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
});

export default PostEngagement;
