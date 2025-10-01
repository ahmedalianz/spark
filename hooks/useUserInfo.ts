import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";

export function useUserInfo() {
  const { user } = useUser();
  const clerkId = user?.id;
  const userInfo = useQuery(api.users.getUserByClerkId, {
    clerkId: clerkId as string,
  });
  return {
    userInfo,
    isLoading: !userInfo?._id,
    error: userInfo === null,
  };
}
