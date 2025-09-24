import { Id } from "@/convex/_generated/dataModel";
import Comments from "@/pages/Comments";
import { useLocalSearchParams } from "expo-router";

const PostCommentsModal = () => {
  const { postId } = useLocalSearchParams<{
    postId: string;
  }>();

  return <Comments postId={postId as Id<"posts">} />;
};

export default PostCommentsModal;
