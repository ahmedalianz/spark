import { ProfileStatsProps } from "@/types";
import React from "react";
import { View } from "react-native";
import ProfileSkeleton from "./ProfileSkeleton";
import QuickActions from "./QuickActions";
import StatsSection from "./StatsSection";
import StoryHighlights from "./StoryHighlights";
import UserInfo from "./UserInfo";

const ProfileStats = ({
  isCurrentUserProfile,
  userInfo,
  isLoading,
  viewedUserInfo,
  colors,
}: ProfileStatsProps) => {
  return (
    <View
      style={{
        backgroundColor: colors.background,
      }}
    >
      {isLoading ? (
        <ProfileSkeleton colors={colors} />
      ) : (
        <>
          <UserInfo
            isCurrentUserProfile={isCurrentUserProfile}
            userInfo={isCurrentUserProfile ? userInfo : viewedUserInfo}
            colors={colors}
          />
          <StatsSection
            userInfo={isCurrentUserProfile ? userInfo : viewedUserInfo}
            viewedUserId={viewedUserInfo?._id}
            colors={colors}
          />
          {isCurrentUserProfile && (
            <>
              <QuickActions colors={colors} />
              <StoryHighlights colors={colors} />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default ProfileStats;
