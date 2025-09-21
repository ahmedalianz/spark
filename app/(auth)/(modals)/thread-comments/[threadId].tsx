import Comments from "@/components/Comments";
import { Id } from "@/convex/_generated/dataModel";
import { useLocalSearchParams } from "expo-router";

const ThreadCommentsModal = () => {
  const { threadId } = useLocalSearchParams<{
    threadId: string;
  }>();

  return <Comments threadId={threadId as Id<"posts">} />;
};

export default ThreadCommentsModal;
