import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

const useFollowHandler = ({ userId }: { userId: Id<"users"> }) => {
  const followStatus = useQuery(api.follows.checkFollowStatus, {
    userId,
  });
  const followUser = useMutation(api.follows.followUser);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (targetUser: Doc<"users">) => {
    setLoading(true);
    try {
      await followUser({
        userId: targetUser._id,
      });
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    followStatus,
    handleFollowToggle,
    loading,
  };
};

export default useFollowHandler;
