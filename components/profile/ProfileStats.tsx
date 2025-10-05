import { ProfileStatsProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
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
  signOutHandler,
}: ProfileStatsProps) => {
  return (
    <View
      style={[
        styles.profileSection,
        {
          backgroundColor: colors.white,
          shadowColor: colors.blackPure,
        },
      ]}
    >
      {isLoading ? (
        <ProfileSkeleton colors={colors} />
      ) : (
        <UserInfo
          isCurrentUserProfile={isCurrentUserProfile}
          userInfo={isCurrentUserProfile ? userInfo : viewedUserInfo}
          signOutHandler={signOutHandler}
          colors={colors}
        />
      )}

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
    </View>
  );
};

export default ProfileStats;

const styles = StyleSheet.create({
  profileSection: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
