import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { usePaginatedQuery } from "convex/react";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, { FadeInUp, Layout } from "react-native-reanimated";

const Replies = ({
  parentCommentId,
  colors,
}: {
  parentCommentId: Id<"comments">;
  colors: any;
}) => {
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
      entering={FadeInUp.duration(200)}
      layout={Layout.duration(200)}
    >
      {replies.map((reply, replyIndex: number) => (
        <Animated.View
          key={reply._id}
          entering={FadeInUp.delay(replyIndex * 20)}
          style={styles.replyContainer}
        >
          <View style={styles.replyMain}>
            <View
              style={[
                styles.replyLine,
                { backgroundColor: colors.borderPrimary },
              ]}
            />
            <Link
              asChild
              href={`/(auth)/(modals)/feed-profile/${reply?.author?._id}`}
            >
              <TouchableOpacity>
                <Image
                  source={{
                    uri:
                      reply.author?.imageUrl ||
                      `https://ui-avatars.com/api/?name=${reply.author?.first_name}+${reply.author?.last_name}&background=random`,
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </Link>
            <View style={styles.replyContent}>
              <Link
                asChild
                href={`/(auth)/(modals)/feed-profile/${reply?.author?._id}`}
              >
                <TouchableOpacity style={styles.replyHeader}>
                  <Text
                    style={[styles.authorName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {reply.author?.first_name} {reply.author?.last_name}
                  </Text>
                  <Text
                    style={[styles.replyTime, { color: colors.textTertiary }]}
                  >
                    {formatTimeAgo(reply._creationTime)}
                  </Text>
                </TouchableOpacity>
              </Link>
              <Text style={[styles.replyText, { color: colors.textPrimary }]}>
                {reply.content}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}

      {/* Load more replies */}
      {status === "CanLoadMore" && (
        <TouchableOpacity
          style={styles.loadMoreContainer}
          onPress={() => loadMore(5)}
        >
          <View
            style={[
              styles.replyLine,
              { backgroundColor: colors.borderPrimary },
            ]}
          />
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>
            Load more replies
          </Text>
        </TouchableOpacity>
      )}

      {status === "LoadingMore" && (
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.replyLine,
              { backgroundColor: colors.borderPrimary },
            ]}
          />
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textTertiary }]}>
            Loading replies...
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default Replies;

const styles = StyleSheet.create({
  replyContainer: {
    paddingLeft: 44, // avatar width (32) + margin (12)
    paddingRight: 16,
    paddingVertical: 8,
  },
  replyMain: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  replyLine: {
    width: 2,
    height: "100%",
    marginRight: 12,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  replyTime: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
  replyText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "DMSans_400Regular",
  },
  loadMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    marginLeft: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
});
