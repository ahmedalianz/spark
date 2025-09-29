import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";

export function useUserInfo({ userId }: { userId?: Id<"users"> }) {
  const { user } = useUser();
  const clerkId = user?.id;
  const viewUserInfo = useQuery(api.users.getUserById, { userId });
  const userInfo = useQuery(api.users.getUserByClerkId, {
    clerkId: clerkId as string,
  });
  return {
    userInfo: userId ? viewUserInfo : userInfo,
    isLoading: !userInfo?._id,
    error: userInfo === null,
  };
}
