import { Doc, Id } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";
import { Router } from "expo-router";
import { RefObject } from "react";
import { Animated, RegisteredStyle, TextInput, ViewStyle } from "react-native";

// Base types that can be reused
export type BaseModalProps = {
  onDismiss?: () => void;
};

export type BasePostProps = BaseModalProps & {
  initialContent?: string;
};

export type EntityWithAuthor<T> = T & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};
export type FollowWithDetails = {
  user: Doc<"users">;
  _id: string;
  followerId: string;
  followingId: string;
  createdAt: number;
  updatedAt?: number;
  isFollowedByCurrentUser: boolean;
  isFollowing: boolean;
  isFollowedBy: boolean;
};
export type FollowTabType = "followers" | "following";
export type FormFieldsProps = {
  isOverLimit: boolean;
  bioCharacterCount: number;
  maxBioLength: number;
  bio: string;
  link: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
};
export type ProfilePictureProps = {
  isLoading: boolean;
  selectImage: () => void;
  selectedImage: ImagePicker.ImagePickerAsset | null;
  imageUrl: string | null;
};
export type ColorsType = Record<string, string>;
// Media related types
export type MediaFileType = "image" | "video";
export type EmptyFollowListProps = {
  searchQuery: string;
  activeTab: FollowTabType;
  colors: ColorsType;
};
export type FollowTabProps = {
  activeTab: FollowTabType;
  setActiveTab: (tabText: FollowTabType) => void;
  follows: FollowWithDetails[];
  title: string;
  colors: ColorsType;
};
export type MediaFile = ImagePicker.ImagePickerAsset & {
  id: string;
  type: MediaFileType;
  isUploading?: boolean;
  uploadProgress?: number;
};

export type MediaSelectionHandler = (type: "camera" | "library") => void;
export type MediaRemovalHandler = (id: string) => void;

// Post creation types
export type CreatePostProps = BasePostProps & {
  isPreview?: boolean;
  postId?: Id<"posts">;
};

export type CreatePostControllerProps = BasePostProps;

export type CreatePostHeaderProps = {
  handleCancel: () => void;
  handleSubmit: () => void;
  isUploading: boolean;
  uploadProgress: number;
  postContent: string;
  colors: ColorsType;
  mediaFiles: MediaFile[];
};

export type CreatePostInputProps = {
  postContent: string;
  handleContentChange: (text: string) => void;
  isExpanded: boolean;
  isPreview?: boolean;
  colors: ColorsType;
  setTextSelection: (selection: { start: number; end: number }) => void;
};
export type PostMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  isOwnPost: boolean;
  onMenuAction: (action: string) => void;
  author: string;
};
export type MediaFilesProps = {
  mediaFiles: MediaFile[];
  removeMedia: MediaRemovalHandler;
  selectMedia: MediaSelectionHandler;
  MAX_MEDIA_FILES: number;
  colors: ColorsType;
};
export type MediaPreviewProps = {
  removeMedia: MediaRemovalHandler;
  file: MediaFile;
  colors: ColorsType;
};
export type MenuItemProps = {
  id: string;
  iconName: string;
  iconLibrary?: "ionicons" | "feather";
  title: string;
  subtitle?: string;
  isDestructive?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
  testID?: string;
};

export type MenuSection = {
  id: string;
  title?: string;
  data: MenuItemProps[];
  showDivider?: boolean;
};

export type BottomSheetModalProps = {
  // Core props
  visible: boolean;
  onClose: () => void;
  sections: MenuSection[];

  // Customization props
  height?: number | string;
  closeOnBackdropPress?: boolean;
  closeOnActionPress?: boolean;
  animationType?: "slide" | "fade" | "none";
  animationDuration?: number;
  backdropOpacity?: number;

  // Style props
  containerStyle?: ViewStyle;
  sectionStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  dividerStyle?: ViewStyle;

  // Custom components
  renderFooter?: () => React.ReactNode;
  renderCustomItem?: (item: MenuItemProps, index: number) => React.ReactNode;
};

export type CreatePostActionsProps = Pick<
  MediaFilesProps,
  "mediaFiles" | "selectMedia" | "MAX_MEDIA_FILES"
> & {
  resetForm: () => void;
  colors: ColorsType;
};

// Comment related types
export type CommentWithAuthor = EntityWithAuthor<Doc<"comments">>;

export type CommentProps = {
  comment: CommentWithAuthor;
  index: number;
  commentInputRef: RefObject<TextInput | null>;
  setCommentText: (text: string) => void;
  setReplyingTo: (commentId: Id<"comments">) => void;
};

export type PostInputProps = {
  commentText: string;
  setCommentText: (text: string) => void;
  isSubmittingComment: boolean;
  replyingTo: Id<"comments"> | undefined;
  setReplyingTo: (id: Id<"comments"> | undefined) => void;
  commentInputRef: RefObject<TextInput | null>;
  animatedInputStyle: RegisteredStyle<ViewStyle>;
  submitComment: () => void;
};

// Profile types
export type EditProfileProps = {
  biostring: string;
  linkstring: string;
  imageUrl: string;
};
export type ProfileHeaderProps = {
  router: Router;
  scrollY: Animated.Value;
  userInfo: Doc<"users">;
  viewedUserInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  colors: ColorsType;
  signOutHandler: () => void;
};
export type PostActionsProps = {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  scaleAnim: Animated.Value;
  onLike: () => void;
  onComments: () => void;
  onShare: () => void;
  colors: ColorsType;
};
export type PostHeaderProps = {
  post: PostWithAuthorDetails;
  colors: ColorsType;
  onMenuPress: () => void;
};

export type PostMediaProps = {
  mediaFiles?: string[];
  likeCount: number;
  commentCount: number;
  colors: ColorsType;
};

export type PostEngagementProps = {
  likeCount: number;
  commentCount: number;
  onCommentsPress: () => void;
  colors: ColorsType;
};
export type ProfileStatsProps = {
  userInfo: Doc<"users">;
  viewedUserInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  colors: ColorsType;
  isLoading: boolean;
  signOutHandler: () => void;
};
export type UserInfoProps = {
  userInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  colors: ColorsType;
  signOutHandler: () => void;
};
export type ProfileTabs = "posts" | "reposts" | "tagged";
export type ProfileEmptyConfig = Record<
  ProfileTabs,
  {
    icon: any;
    title: string;
    subtitle: string;
    actionTitle: string;
    action: () => void;
  }
>;
// Post display types
export type PostWithAuthorDetails = EntityWithAuthor<Doc<"posts">>;

export type ImageViewerProps = {
  url: string;
  likeCount: string;
  commentCount: string;
};

// Icon types
export type IconType = {
  color: string;
  size: number;
  focused: boolean;
};

// Utility types for better type safety
export type TextSelection = {
  start: number;
  end: number;
};

export type UploadProgress = {
  isUploading: boolean;
  uploadProgress: number;
};
export type UserSettings = {
  notifications: {
    push: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      mentions: boolean;
      reposts: boolean;
      directMessages: boolean;
      storyReplies: boolean;
    };
    email: {
      securityAlerts: boolean;
      productUpdates: boolean;
      weeklyDigest: boolean;
    };
    inApp: {
      badges: boolean;
      sounds: boolean;
      previews: boolean;
    };
  };
  privacy: {
    account: "public" | "private";
    allowDirectMessages: "everyone" | "following" | "none";
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
    hideLikes: boolean;
    hideFollowers: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    fontSize: "small" | "medium" | "large";
    reduceMotion: boolean;
    highContrast: boolean;
  };
  feed: {
    algorithm: "chronological" | "recommended";
    showReposts: boolean;
    showQuotes: boolean;
    autoPlayVideos: boolean;
    contentLanguages: string[];
    sensitiveContent: boolean;
  };
  accessibility: {
    altTextReminders: boolean;
    keyboardShortcuts: boolean;
    screenReaderOptimized: boolean;
  };
  storage: {
    autoPlayVideos: "always" | "wifi" | "never";
    imageQuality: "low" | "medium" | "high";
    clearCacheOnExit: boolean;
    downloadOriginals: boolean;
  };
};
export type UploadError = {
  index: number;
  fileName: string;
  error: string;
};
