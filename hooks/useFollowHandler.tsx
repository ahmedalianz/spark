import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

const useFollowHandler = () => {
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
    handleFollowToggle,
    loading,
  };
};

export default useFollowHandler;
