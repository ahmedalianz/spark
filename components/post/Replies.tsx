import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { usePaginatedQuery } from "convex/react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, { FadeInUp, Layout } from "react-native-reanimated";

const Replies = ({ parentCommentId }: { parentCommentId: Id<"comments"> }) => {
  const {
    results: replies,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.replies.getReplies,
    { parentCommentId },
    { initialNumItems: 5 }
  );

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      layout={Layout.springify()}
    >
      {replies.map((reply, replyIndex: number) => (
        <Animated.View
          key={reply._id}
          entering={FadeInUp.delay(replyIndex * 30).springify()}
          style={styles.replyContainer}
        >
          {/* Reply connector line */}
          <View style={styles.replyLine} />

          {/* Reply content */}
          <View style={styles.replyContent}>
            <View style={styles.replyHeader}>
              <Image
                source={{
                  uri:
                    reply.author?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${reply.author?.first_name}+${reply.author?.last_name}&background=random`,
                }}
                style={styles.replyAvatar}
              />
              <View style={styles.replyHeaderContent}>
                <View style={styles.replyUserRow}>
                  <Text style={styles.replyUsername} numberOfLines={1}>
                    {reply.author?.first_name} {reply.author?.last_name}
                  </Text>
                  <Text style={styles.replyTime}>
                    · {formatTimeAgo(reply._creationTime)}
                  </Text>
                </View>
                <Text style={styles.replyText}>{reply.content}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      ))}

      {/* Load more replies if available */}
      {status === "CanLoadMore" && (
        <TouchableOpacity
          style={styles.loadMoreReplies}
          onPress={() => loadMore(5)}
        >
          <View style={styles.replyLine} />
          <Text style={styles.loadMoreText}>Load more replies</Text>
        </TouchableOpacity>
      )}

      {status === "LoadingMore" && (
        <View style={styles.loadingMoreReplies}>
          <View style={styles.replyLine} />
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading more replies...</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default Replies;

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 4,
    paddingLeft: 38, // Align with comment content
  },
  replyLine: {
    width: 2,
    backgroundColor: Colors.borderLight,
    marginRight: 12,
    alignSelf: "stretch",
  },
  replyContent: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderLighter,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  replyHeaderContent: {
    flex: 1,
    gap: 3,
  },
  replyUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flexWrap: "wrap",
  },
  replyUsername: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    maxWidth: "60%",
  },
  replyTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  loadMoreReplies: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 4,
    paddingLeft: 38,
    paddingVertical: 8,
  },
  loadMoreText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 12,
  },
  loadingMoreReplies: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginBottom: 4,
    paddingLeft: 38,
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
  },
});
