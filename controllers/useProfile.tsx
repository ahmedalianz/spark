import { useRouter } from "expo-router";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ProfileTabs } from "@/types";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useCallback, useState } from "react";

const useProfile = ({ userId }: { userId?: Id<"users"> }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTabs>("posts");
  const { userInfo, isLoading, error } = useUserInfo();
  const viewedUserInfo = useQuery(api.users.getUserById, { userId });
  const isCurrentUserProfile =
    userId === undefined || (userId !== undefined && userId === userInfo?._id);

  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getUserPosts,
    {
      userId: userId || (userInfo?._id as Id<"users">),
      type: activeTab,
    },
    { initialNumItems: 10 }
  );

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  return {
    router,
    activeTab,
    userInfo,
    isLoading,
    error,
    status,
    posts,
    viewedUserInfo,
    isCurrentUserProfile,
    setActiveTab,
    handleLoadMore,
  };
};

export default useProfile;
