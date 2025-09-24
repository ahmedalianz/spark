import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import formatCount from "@/utils/formatCount";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { memo, useRef, useState } from "react";
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

type PostProps = {
  post: Doc<"posts"> & { author: Doc<"users">; userHasLiked: boolean };
};

const Post = ({ post }: PostProps) => {
  const { content, mediaFiles, likeCount, commentCount, author, userHasLiked } =
    post;

  const router = useRouter();

  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(!!userHasLiked);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const likePost = useMutation(api.posts.likePost);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await likePost({ postId: post._id });
    } catch (error) {
      setIsLiked(isLiked);
      setLocalLikeCount(likeCount);
    }
  };

  const handleComment = () => {
    router.push(`/(auth)/(modals)/post-comments/${post._id as string}`);
    Haptics.selectionAsync();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href={`/(auth)/feed-profile/${author?._id}`} asChild>
          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: author?.imageUrl }} style={styles.avatar} />
            </View>
            <View style={styles.userDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.username}>
                  {author?.first_name} {author?.last_name}
                </Text>
                <Text style={styles.timestamp}>
                  · {formatTimeAgo(post._creationTime)}
                </Text>
              </View>
              <Text style={styles.handle}>@{author?.email?.split("@")[0]}</Text>
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

      {/* Post Content */}
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
                href={`/(auth)/(modals)/image/${encodeURIComponent(imageUrl)}?&likeCount=${localLikeCount}&commentCount=${commentCount}`}
                key={index}
                asChild
              >
                <TouchableOpacity style={styles.mediaWrapper}>
                  <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
                  <LinearGradient
                    colors={["transparent", Colors.blackPure]}
                    style={styles.mediaOverlay}
                  />
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Engagement Stats */}
      {(localLikeCount > 0 || commentCount > 0) && (
        <View style={styles.statsBar}>
          <View style={styles.statsRow}>
            {localLikeCount > 0 && (
              <Text style={styles.statText}>
                {formatCount(localLikeCount)}{" "}
                {localLikeCount === 1 ? "like" : "likes"}
              </Text>
            )}
            {commentCount > 0 && (
              <TouchableOpacity onPress={handleComment}>
                <Text style={styles.statTextClickable}>
                  {formatCount(commentCount)}{" "}
                  {commentCount === 1 ? "comment" : "comments"}
                </Text>
              </TouchableOpacity>
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
              color={isLiked ? Colors.accentLike : Colors.textTertiary}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {formatCount(localLikeCount)}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={Colors.textTertiary}
          />
          <Text style={styles.actionText}>{formatCount(commentCount)}</Text>
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

export default memo(Post);

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
    backgroundColor: Colors.borderLighter,
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
    backgroundColor: Colors.borderLighter,
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
