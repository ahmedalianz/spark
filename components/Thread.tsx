import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ThreadProps = {
  thread: Doc<"threads"> & { creator: Doc<"users"> };
};

const Thread = ({ thread }: ThreadProps) => {
  const {
    content,
    mediaFiles,
    likeCount,
    commentCount,
    retweetCount,
    creator,
  } = thread;

  const likeThread = useMutation(api.threads.likeThread);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLike = async () => {
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await likeThread({ threadId: thread._id });
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLocalLikeCount(likeCount);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Avatar and User Info */}
      <View style={styles.header}>
        <Link href={`/feed/profile/${creator?._id}`} asChild>
          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: creator?.imageUrl }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.username}>
                  {creator?.first_name} {creator?.last_name}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.timestamp}>
                  · {formatTimeAgo(thread._creationTime)}
                </Text>
              </View>
              <Text style={styles.handle}>
                @{creator?.email?.split("@")[0]}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Thread Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{content}</Text>

        {/* Media Preview */}
        {mediaFiles && mediaFiles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaContainer}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH * 0.8}
          >
            {mediaFiles.map((imageUrl, index) => (
              <Link
                href={`/(auth)/(modals)/image/${encodeURIComponent(imageUrl)}?threadId=${thread._id}&likeCount=${localLikeCount}&commentCount=${commentCount}&retweetCount=${retweetCount}`}
                key={index}
                asChild
              >
                <TouchableOpacity style={styles.mediaWrapper}>
                  <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
                  <LinearGradient
                    colors={["transparent", Colors.black30]}
                    style={styles.mediaOverlay}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Engagement Stats */}
      {(localLikeCount > 0 || commentCount > 0 || retweetCount > 0) && (
        <View style={styles.statsBar}>
          <View style={styles.statsRow}>
            {localLikeCount > 0 && (
              <Text style={styles.statText}>
                {formatCount(localLikeCount)}{" "}
                {localLikeCount === 1 ? "like" : "likes"}
              </Text>
            )}
            {commentCount > 0 && (
              <Text style={styles.statText}>
                {formatCount(commentCount)}{" "}
                {commentCount === 1 ? "reply" : "replies"}
              </Text>
            )}
            {retweetCount > 0 && (
              <Text style={styles.statText}>
                {formatCount(retweetCount)} reposts
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.likedButton]}
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? Colors.like : Colors.textTertiary}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {formatCount(localLikeCount)}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={Colors.textTertiary}
          />
          <Text style={styles.actionText}>{formatCount(commentCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="repeat-outline"
            size={24}
            color={Colors.textTertiary}
          />
          <Text style={styles.actionText}>{formatCount(retweetCount)}</Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.shareButton}>
            <Feather name="send" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Thread;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.borderVeryLight,
  },

  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginRight: 4,
    fontFamily: "DMSans_700Bold",
  },
  timestamp: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 4,
    fontFamily: "DMSans_400Regular",
  },
  handle: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  moreButton: {
    padding: 4,
    borderRadius: 12,
  },
  content: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.black,
    marginBottom: 12,
    fontFamily: "DMSans_400Regular",
  },
  mediaContainer: {
    paddingRight: 20,
    gap: 12,
  },
  mediaWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  mediaImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 240,
    backgroundColor: Colors.borderVeryLight,
  },
  mediaOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  statsBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderVeryLight,
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
    backgroundColor: "#fff0f3",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  likedText: {
    color: Colors.like,
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
  bookmarkButton: {
    padding: 8,
    borderRadius: 16,
  },
});
