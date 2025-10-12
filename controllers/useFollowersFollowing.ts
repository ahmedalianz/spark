import { api } from "@/convex/_generated/api";
import { FollowTabType, FollowWithDetails } from "@/types";
import { usePaginatedQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";

const useFollowersFollowing = ({
  initialTab,
}: {
  initialTab?: FollowTabType;
}) => {
  const [activeTab, setActiveTab] = useState<FollowTabType>(
    initialTab || "followers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const {
    results: followers,
    status: followersStatus,
    loadMore: loadMoreFollowers,
  } = usePaginatedQuery(api.follows.getFollowers, {}, { initialNumItems: 20 });

  const {
    results: following,
    status: followingsStatus,
    loadMore: loadMoreFollowing,
  } = usePaginatedQuery(api.follows.getFollowing, {}, { initialNumItems: 20 });

  const filterUsers = useCallback(
    (users: FollowWithDetails[]) => {
      if (!searchQuery) return users;
      return users.filter((follow) => {
        const query = searchQuery.toLowerCase();

        return (
          follow?.user?.first_name?.toLowerCase().startsWith(query) ||
          follow?.user?.last_name?.toLowerCase().startsWith(query) ||
          follow?.user?.username?.toLowerCase().startsWith(query)
        );
      });
    },
    [searchQuery]
  );

  const currentData = useMemo(
    () =>
      activeTab === "followers"
        ? filterUsers(followers || [])
        : filterUsers(following || []),
    [activeTab, followers, following, filterUsers]
  );
  const currentStatus = useMemo(
    () => (activeTab === "followers" ? followersStatus : followingsStatus),
    [activeTab, followersStatus, followingsStatus]
  );
  const onLoadMore = useCallback(() => {
    if (
      ["LoadingFirstPage", "Exhausted", "LoadingMore"].includes(currentStatus)
    )
      return;
    if (activeTab === "followers") {
      loadMoreFollowers(15);
    } else {
      loadMoreFollowing(15);
    }
  }, [currentStatus, activeTab, loadMoreFollowers, loadMoreFollowing]);
  return {
    followers,
    following,
    activeTab,
    searchQuery,
    currentData,
    currentStatus,
    setActiveTab,
    setSearchQuery,
    onLoadMore,
  };
};

export default useFollowersFollowing;
