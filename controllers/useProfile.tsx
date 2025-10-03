import { useRouter } from "expo-router";
import { Animated } from "react-native";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUserInfo } from "@/hooks/useUserInfo";
import { ProfileTabs } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useCallback, useRef, useState } from "react";

const useProfile = ({ userId }: { userId?: Id<"users"> }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<ProfileTabs>("posts");
  const { userInfo, isLoading, error } = useUserInfo();
  const viewedUserInfo = useQuery(api.users.getUserById, { userId });
  const isCurrentUserProfile =
    userId === undefined || (userId !== undefined && userId === userInfo?._id);
  const signOutHandler = useCallback(() => {
    signOut();
  }, [signOut]);

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
    scrollY,
    activeTab,
    userInfo,
    isLoading,
    error,
    status,
    posts,
    viewedUserInfo,
    isCurrentUserProfile,
    signOutHandler,
    setActiveTab,
    handleLoadMore,
  };
};

export default useProfile;
