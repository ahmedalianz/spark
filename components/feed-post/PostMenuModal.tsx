import { MenuSection, PostMenuModalProps } from "@/types";
import BottomSheetModal from "../BottomSheetModal";

const PostMenuModal = ({
  visible,
  onClose,
  isOwnPost,
  onMenuAction,
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
        {
          id: "notifications",
          iconName: "notifications-outline",
          title: "Turn on notifications",
          subtitle: "Get notified about new activity",
          onPress: () => onMenuAction("notifications"),
        },
        {
          id: "copyLink",
          iconName: "link-outline",
          title: "Copy link",
          onPress: () => onMenuAction("copyLink"),
        },
      ],
    },
    {
      id: "content-control",
      showDivider: true,
      data: [
        {
          id: "snooze",
          iconName: "time-outline",
          title: "Snooze for 30 days",
          subtitle: "Temporarily stop seeing posts from this author",
          onPress: () => onMenuAction("snooze"),
        },
        {
          id: "hideAuthor",
          iconName: "eye-off-outline",
          title: "Hide all from this author",
          subtitle: "Stop seeing their posts in your feed",
          onPress: () => onMenuAction("hideAuthor"),
        },
      ],
    },
    {
      id: "moderation",
      showDivider: true,
      data: [
        {
          id: "report",
          iconName: "flag-outline",
          title: "Report post",
          subtitle: "We won't let them know who reported this",
          onPress: () => onMenuAction("report"),
        },
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
              title: "Block this author",
              subtitle: "You won't be able to see or contact each other",
              isDestructive: true,
              onPress: () => onMenuAction("block"),
            },
      ],
    },
  ];

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
