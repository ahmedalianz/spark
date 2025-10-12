import { Colors } from "@/constants/Colors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";
import { RefObject } from "react";
import { Animated, RegisteredStyle, TextInput, ViewStyle } from "react-native";

/* -------------------------------------------------------------------------- */
/*                                   SHARED                                   */
/* -------------------------------------------------------------------------- */

export type ColorsType = Record<keyof typeof Colors, string>;

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

export type IconType = {
  color: string;
  size: number;
  focused: boolean;
  colors: ColorsType;
};

export type TextSelection = {
  start: number;
  end: number;
};

export type UploadProgress = {
  isUploading: boolean;
  uploadProgress: number;
};

export type UploadError = {
  index: number;
  fileName: string;
  error: string;
};

/* -------------------------------------------------------------------------- */
/*                                   FOLLOW                                   */
/* -------------------------------------------------------------------------- */

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
export type PaginationStatue =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Exhausted";
export type EmptyFollowListProps = {
  searchQuery: string;
  activeTab: FollowTabType;
  colors: ColorsType;
  followStatus: PaginationStatue;
};

export type FollowTabProps = {
  activeTab: FollowTabType;
  setActiveTab: (tabText: FollowTabType) => void;
  follows: FollowWithDetails[];
  title: string;
  colors: ColorsType;
};

/* -------------------------------------------------------------------------- */
/*                                   PROFILE                                  */
/* -------------------------------------------------------------------------- */

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

export type FormFieldsProps = {
  isOverLimit: boolean;
  bioCharacterCount: number;
  maxBioLength: number;
  bio: string;
  link: string;
  colors: ColorsType;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  setLink: React.Dispatch<React.SetStateAction<string>>;
};

export type ProfilePictureProps = {
  isLoading: boolean;
  selectedImage: ImagePicker.ImagePickerAsset | null;
  imageUrl?: string | null;
  colors: ColorsType;
  selectImage: () => void;
};

export type EditProfileProps = {
  biostring: string;
  imageUrl: string;
};

export type ProfileStatsProps = {
  userInfo: Doc<"users">;
  viewedUserInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  colors: ColorsType;
  isLoading: boolean;
};

export type UserInfoProps = {
  userInfo: Doc<"users">;
  isCurrentUserProfile: boolean;
  colors: ColorsType;
};
export type CreateAccountProps = {
  onSuccess?: (userData: any) => void;
  onCancel?: () => void;
};

export type CreateAccountFormData = {
  name: string;
  username: string;
  email: string;
  bio: string;
  link: string;
};

export type CreateAccountErrors = {
  name?: string;
  username?: string;
  email?: string;
  link?: string;
};

export type CreateAccountFormFieldsProps = {
  isOverLimit: boolean;
  bioCharacterCount: number;
  maxBioLength: number;
  formData: CreateAccountFormData;
  errors: CreateAccountErrors;
  setFormData: React.Dispatch<React.SetStateAction<CreateAccountFormData>>;
  setFieldError: (field: keyof CreateAccountErrors, error: string) => void;
  colors: ColorsType;
};

export type CreateAccountProfilePictureProps = {
  isLoading: boolean;
  selectImage: () => void;
  selectedImage: ImagePicker.ImagePickerAsset | null;
  colors: ColorsType;
};
/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export type PostWithAuthorDetails = EntityWithAuthor<Doc<"posts">>;

export type CreatePostProps = BasePostProps & {
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
  colors: ColorsType;
  setTextSelection: (selection: TextSelection) => void;
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

export type PostMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  isOwnPost: boolean;
  onMenuAction: (action: string) => void;
  author: string;
};

/* -------------------------------------------------------------------------- */
/*                                   Notifications                            */
/* -------------------------------------------------------------------------- */
export type NotificationType =
  | "system"
  | "like"
  | "comment"
  | "reply"
  | "repost"
  | "follow"
  | "mention"
  | "post_share";

export type NotificationWithDetails = EntityWithAuthor<Doc<"notifications">>;
/* -------------------------------------------------------------------------- */
/*                                   COMMENT                                  */
/* -------------------------------------------------------------------------- */

export type CommentWithAuthor = EntityWithAuthor<Doc<"comments">>;

export type CommentProps = {
  comment: CommentWithAuthor;
  index: number;
  commentInputRef: RefObject<TextInput | null>;
  colors: ColorsType;
  setCommentText: (text: string) => void;
  setReplyingTo: (commentId: Id<"comments">) => void;
};

export type PostInputProps = {
  commentText: string;
  isSubmittingComment: boolean;
  replyingTo: Id<"comments"> | undefined;
  commentInputRef: RefObject<TextInput | null>;
  animatedInputStyle: RegisteredStyle<ViewStyle>;
  colors: ColorsType;
  setCommentText: (text: string) => void;
  setReplyingTo: (id: Id<"comments"> | undefined) => void;
  submitComment: () => void;
};

/* -------------------------------------------------------------------------- */
/*                                   MEDIA                                    */
/* -------------------------------------------------------------------------- */

export type MediaFileType = "image" | "video";

export type MediaFile = ImagePicker.ImagePickerAsset & {
  id: string;
  type: MediaFileType;
  isUploading?: boolean;
  uploadProgress?: number;
};

export type MediaSelectionHandler = (type: "camera" | "library") => void;

export type MediaRemovalHandler = (id: string) => void;

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

export type CreatePostActionsProps = Pick<
  MediaFilesProps,
  "mediaFiles" | "selectMedia" | "MAX_MEDIA_FILES"
> & {
  resetForm: () => void;
  colors: ColorsType;
};

/* -------------------------------------------------------------------------- */
/*                                   MENU                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                  Feed                                      */
/* -------------------------------------------------------------------------- */
export type FeedFilter = "all" | "following";

export type PostWithAuthor = Doc<"posts"> & {
  author: Doc<"users">;
  userHasLiked: boolean;
  userHasReposted?: boolean;
  userHasBookmarked?: boolean;
};
/* -------------------------------------------------------------------------- */
/*                                  SETTINGS                                  */
/* -------------------------------------------------------------------------- */

export type UserSettings = {
  notifications: {
    push: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      mentions: boolean;
      reposts: boolean;
      posts: boolean;
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

/* -------------------------------------------------------------------------- */
/*                                MISC DISPLAY                                */
/* -------------------------------------------------------------------------- */

export type ImageViewerProps = {
  url: string;
  likeCount: string;
  commentCount: string;
};
export type ActionButtonProps = {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
  colors: ColorsType;
  title: string;
};
