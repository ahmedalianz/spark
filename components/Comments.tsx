import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { View } from "react-native";
import Thread from "./Threads";

interface CommentsProps {
  threadId: Id<"threads">;
}

const Comments = ({ threadId }: CommentsProps) => {
  const comments = useQuery(api.threads.getThreadComments, {
    threadId,
  });

  return (
    <View>
      {comments?.map((comment) => (
        <Thread
          key={comment._id}
          thread={comment as Doc<"threads"> & { creator: Doc<"users"> }}
        />
      ))}
    </View>
  );
};
export default Comments;
