import { Id } from "@/convex/_generated/dataModel";
import Post from "@/pages/Post";
import { useLocalSearchParams } from "expo-router";

const PostModal = () => {
  const { postId } = useLocalSearchParams<{
    postId: string;
  }>();

  return <Post postId={postId as Id<"posts">} />;
};

export default PostModal;
