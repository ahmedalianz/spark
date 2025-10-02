import { MenuSection, PostMenuModalProps } from "@/types";
import BottomSheetModal from "../BottomSheetModal";

const PostMenuModal = ({
  visible,
  onClose,
  isOwnPost,
  onMenuAction,
  author,
}: PostMenuModalProps) => {
  const postSections: MenuSection[] = [
    {
      id: "actions",
      data: [
        {
          id: "save",
          iconName: "bookmark-outline",
          title: "Save post",
          subtitle: "Add this to your saved items",
          onPress: () => onMenuAction("save"),
        },
        ...(!isOwnPost
          ? [
              {
                id: "notifications",
                iconName: "notifications-outline",
                title: "Turn on notifications",
                subtitle: "Get notified about new activity",
                onPress: () => onMenuAction("notifications"),
              },
            ]
          : []),
        {
          id: "copyLink",
          iconName: "link-outline",
          title: "Copy link",
          onPress: () => onMenuAction("copyLink"),
        },
        ...(isOwnPost
          ? [
              {
                id: "edit",
                iconName: "create-outline",
                title: "Edit post",
                subtitle: "Update your post content",
                onPress: () => onMenuAction("edit"),
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
                onPress: () => onMenuAction("pin"),
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
                onPress: () => onMenuAction("snooze"),
              },
              {
                id: "hideAuthor",
                iconName: "eye-off-outline",
                title: `Hide all from ${author}`,
                subtitle: "Stop seeing their posts in your feed",
                onPress: () => onMenuAction("hideAuthor"),
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
                onPress: () => onMenuAction("viewStats"),
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
                onPress: () => onMenuAction("promote"),
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
                onPress: () => onMenuAction("report"),
              },
            ]
          : []),
        isOwnPost
          ? {
              id: "delete",
              iconName: "trash-outline",
              title: "Delete post",
              isDestructive: true,
              onPress: () => onMenuAction("delete"),
            }
          : {
              id: "block",
              iconName: "ban-outline",
              title: `Block ${author}`,
              subtitle: "You won't be able to see or contact each other",
              isDestructive: true,
              onPress: () => onMenuAction("block"),
            },
        ...(isOwnPost
          ? [
              {
                id: "archive",
                iconName: "archive-outline",
                title: "Archive post",
                subtitle: "Hide this post from your profile",
                onPress: () => onMenuAction("archive"),
              },
            ]
          : []),
      ],
    },
  ].filter((section) => section.data.length > 0);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      sections={postSections}
      height="70%"
    />
  );
};

export default PostMenuModal;
