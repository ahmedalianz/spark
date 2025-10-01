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

// Media related types
export type MediaFileType = "image" | "video";

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
  mediaFiles: MediaFile[];
};

export type CreatePostInputProps = {
  postContent: string;
  handleContentChange: (text: string) => void;
  isExpanded: boolean;
  isPreview?: boolean;
  setTextSelection: (selection: { start: number; end: number }) => void;
};

export type MediaFilesProps = {
  mediaFiles: MediaFile[];
  removeMedia: MediaRemovalHandler;
  selectMedia: MediaSelectionHandler;
  MAX_MEDIA_FILES: number;
};
export type MediaPreviewProps = {
  removeMedia: MediaRemovalHandler;
  file: MediaFile;
};

export type CreatePostActionsProps = Pick<
  MediaFilesProps,
  "mediaFiles" | "selectMedia" | "MAX_MEDIA_FILES"
> & {
  resetForm: () => void;
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
