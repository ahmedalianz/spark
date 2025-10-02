import { Colors } from "@/constants/Colors";
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
  signOutHandler,
}: ProfileStatsProps) => {
  return (
    <View style={styles.profileSection}>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <UserInfo
          isCurrentUserProfile={isCurrentUserProfile}
          userInfo={isCurrentUserProfile ? userInfo : viewedUserInfo}
          signOutHandler={signOutHandler}
        />
      )}

      <StatsSection
        userInfo={isCurrentUserProfile ? userInfo : viewedUserInfo}
        viewedUserId={viewedUserInfo?._id}
      />
      {isCurrentUserProfile && (
        <>
          <QuickActions />
          <StoryHighlights />
        </>
      )}
    </View>
  );
};

export default ProfileStats;

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: Colors.white,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    shadowColor: Colors.blackPure,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
