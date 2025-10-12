import { api } from "@/convex/_generated/api";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useBottomSheet } from "@/store/bottomSheetStore";
import { MenuSection, PostWithAuthorDetails } from "@/types";
import { useMutation } from "convex/react";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated } from "react-native";

export const useFeedPost = (post: PostWithAuthorDetails) => {
  const router = useRouter();
  const { showSheet } = useBottomSheet();
  const { likeCount, userHasLiked, author } = post;
  const [isLiked, setIsLiked] = useState(!!userHasLiked);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const likePost = useMutation(api.posts.likePost);
  const deletePost = useMutation(api.posts.deletePost);
  const { userInfo } = useUserInfo();
  const isOwnPost = userInfo?._id === author._id;

  const handleLike = async () => {
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
      setIsLiked(!userHasLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenComments = () => {
    router.push(`/(auth)/(modals)/post/${post._id as string}`);
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
  const postSections: MenuSection[] = [
    {
      id: "actions",
      data: [
        {
          id: "save",
          iconName: "bookmark-outline",
          title: "Save post",
          subtitle: "Add this to your saved items",
          onPress: () => handleMenuAction("save"),
        },
        ...(!isOwnPost
          ? [
              {
                id: "notifications",
                iconName: "notifications-outline",
                title: "Turn on notifications",
                subtitle: "Get notified about new activity",
                onPress: () => handleMenuAction("notifications"),
              },
            ]
          : []),
        {
          id: "copyLink",
          iconName: "link-outline",
          title: "Copy link",
          onPress: () => handleMenuAction("copyLink"),
        },
        ...(isOwnPost
          ? [
              {
                id: "edit",
                iconName: "create-outline",
                title: "Edit post",
                subtitle: "Update your post content",
                onPress: () => handleMenuAction("edit"),
              },
            ]
          : []),
        ...(isOwnPost
          ? [
              {
                id: "pin",
                iconName: "pin-outline",
                title: "Pin to profile",
                subtitle: "Feature this post at the top of your profile",
                onPress: () => handleMenuAction("pin"),
              },
            ]
          : []),
      ],
    },
    ...(!isOwnPost
      ? [
          {
            id: "content-control",
            showDivider: true,
            data: [
              {
                id: "snooze",
                iconName: "time-outline",
                title: "Snooze for 30 days",
                subtitle: `Temporarily stop seeing posts from ${author}`,
                onPress: () => handleMenuAction("snooze"),
              },
              {
                id: "hideAuthor",
                iconName: "eye-off-outline",
                title: `Hide all from ${author}`,
                subtitle: "Stop seeing their posts in your feed",
                onPress: () => handleMenuAction("hideAuthor"),
              },
            ],
          },
        ]
      : []),
    {
      id: "analytics",
      showDivider: true,
      data: [
        ...(isOwnPost
          ? [
              {
                id: "viewStats",
                iconName: "stats-chart-outline",
                title: "View post analytics",
                subtitle: "See likes, views, and engagement",
                onPress: () => handleMenuAction("viewStats"),
              },
            ]
          : []),
        ...(isOwnPost
          ? [
              {
                id: "promote",
                iconName: "rocket-outline",
                title: "Promote this post",
                subtitle: "Reach more people",
                onPress: () => handleMenuAction("promote"),
              },
            ]
          : []),
      ],
    },
    {
      id: "moderation",
      showDivider: true,
      data: [
        ...(!isOwnPost
          ? [
              {
                id: "report",
                iconName: "flag-outline",
                title: `Report ${author}'s post`,
                subtitle: "We won't let them know who reported this",
                onPress: () => handleMenuAction("report"),
              },
            ]
          : []),
        isOwnPost
          ? {
              id: "delete",
              iconName: "trash-outline",
              title: "Delete post",
              isDestructive: true,
              onPress: () => handleMenuAction("delete"),
            }
          : {
              id: "block",
              iconName: "ban-outline",
              title: `Block ${author}`,
              subtitle: "You won't be able to see or contact each other",
              isDestructive: true,
              onPress: () => handleMenuAction("block"),
            },
        ...(isOwnPost
          ? [
              {
                id: "archive",
                iconName: "archive-outline",
                title: "Archive post",
                subtitle: "Hide this post from your profile",
                onPress: () => handleMenuAction("archive"),
              },
            ]
          : []),
      ],
    },
  ].filter((section) => section.data.length > 0);

  const handleShowSheet = () => {
    showSheet({ sections: postSections, height: "70%" });
  };
  return {
    likeCount,
    isLiked,
    scaleAnim,
    handleLike,
    handleOpenComments,
    handleShare,
    handleMenuAction,
    handleShowSheet,
  };
};
