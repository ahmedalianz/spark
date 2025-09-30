import { api } from "@/convex/_generated/api";
import { PostWithAuthorDetails } from "@/types";
import { useMutation } from "convex/react";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated } from "react-native";

export const useFeedPost = (post: PostWithAuthorDetails) => {
  const router = useRouter();
  const { likeCount, userHasLiked, author } = post;

  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(!!userHasLiked);
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const likePost = useMutation(api.posts.likePost);
  const deletePost = useMutation(api.posts.deletePost);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLocalLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

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
      // Revert on error
      setIsLiked(!newIsLiked);
      setLocalLikeCount(likeCount);
    }
  };

  const handleOpenComments = () => {
    router.push(`/(auth)/(modals)/post/${post._id as string}`);
    Haptics.selectionAsync();
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(`https://yourapp.com/post/${post._id}`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleReportPost = () => {
    Alert.alert("Report Post", "Why are you reporting this post?", [
      { text: "Spam", onPress: () => reportPost("spam") },
      { text: "Harassment", onPress: () => reportPost("harassment") },
      { text: "Inappropriate", onPress: () => reportPost("inappropriate") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const reportPost = async (reason: string) => {
    // Implement report functionality
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePost({ postId: post._id });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            } catch (error) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  const handleShare = () => {
    // Implement native sharing
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleMuteAuthor = () => {
    Alert.alert(
      "Mute Author",
      `You won't see posts from ${author?.first_name} ${author?.last_name} in your feed.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mute", style: "destructive" },
      ]
    );
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "save":
        console.log("Save post");
        break;
      case "report":
        handleReportPost();
        break;
      case "notifications":
        console.log("Turn on notifications");
        break;
      case "copyLink":
        handleCopyLink();
        break;
      case "snooze":
      case "hideAuthor":
        handleMuteAuthor();
        break;
      case "delete":
        handleDeletePost();
        break;
      case "block":
        Alert.alert(
          "Block User",
          `Are you sure you want to block ${author?.first_name} ${author?.last_name}?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Block", style: "destructive" },
          ]
        );
        break;
    }
  };

  return {
    localLikeCount,
    isLiked,
    menuVisible,
    scaleAnim,
    setMenuVisible,
    handleLike,
    handleOpenComments,
    handleShare,
    handleMenuAction,
  };
};
