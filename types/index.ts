import { Doc, Id } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native";

export type CreatePostProps = {
  isPreview?: boolean;
  postId?: Id<"posts">;
  onDismiss?: () => void;
  initialContent?: string;
};

export type MediaFile = ImagePicker.ImagePickerAsset & {
  id: string;
  type: "image" | "video";
  isUploading?: boolean;
  uploadProgress?: number;
};
export type CreatePostControllerProps = {
  onDismiss?: () => void;
  initialContent?: string;
};
export type ImageViewerProps = {
  url: string;
  likeCount: string;
  commentCount: string;
};
export type EditProfileProps = {
  biostring: string;
  linkstring: string;
  imageUrl: string;
};
export type CreatePostHeaderProps = {
  handleCancel: () => void;
  handleSubmit: () => void;
  isUploading: boolean;
  uploadProgress: number;
  postContent: string;
  mediaFiles: MediaFile[];
};
export type MediaPreviewProps = {
  file: MediaFile;
  removeMedia: (id: string) => void;
};
export type CommentProps = {
  comment: Doc<"comments"> & {
    author: Doc<"users">;
    userHasLiked?: boolean;
  };
  index: number;
  commentInputRef: React.RefObject<TextInput | null>;
  setCommentText: (text: string) => void;
  setReplyingTo: (commentId: Id<"comments">) => void;
};
export type PostWithAuthorDetails = Doc<"posts"> & {
  author: Doc<"users">;
  userHasLiked?: boolean;
};
export type PostInputProps = {
  commentText: string;
  setCommentText: (text: string) => void;
  isSubmittingComment: boolean;
  replyingTo: Id<"comments"> | undefined;
  setReplyingTo: (id: Id<"comments"> | undefined) => void;
  commentInputRef: any;
  animatedInputStyle: any;
  submitComment: () => void;
};
export type IconType = {
  color: string;
  size: number;
  focused: boolean;
};
export type tabEnum = "Posts" | "Reposts";
export type TabsProps = {
  onTabChange: (tab: tabEnum) => void;
  activeTab?: tabEnum;
};
