import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

type VisibilityOption = "public" | "friends" | "private";
type MessagePermission = "everyone" | "following" | "none";

const PrivacySettings = () => {
  const { colors } = useAppTheme();
  const [profileVisibility, setProfileVisibility] =
    useState<VisibilityOption>("public");
  const [postVisibility, setPostVisibility] =
    useState<VisibilityOption>("public");
  const [messagePermission, setMessagePermission] =
    useState<MessagePermission>("everyone");

  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const handleVisibilityChange = (
    type: "profile" | "post",
    value: VisibilityOption
  ) => {
    if (type === "profile") {
      setProfileVisibility(value);
    } else {
      setPostVisibility(value);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearSearchHistory = () => {
    Alert.alert(
      "Clear Search History",
      "Are you sure you want to clear all your search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Implement clear logic
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      "Download Your Data",
      "We'll prepare a copy of your data and send you a download link via email within 48 hours.",
      [{ text: "OK" }]
    );
  };

  const visibilityOptions: {
    value: VisibilityOption;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "public",
      label: "Public",
      icon: "earth",
      description: "Anyone can see",
    },
    {
      value: "friends",
      label: "Friends",
      icon: "people",
      description: "Only friends",
    },
    {
      value: "private",
      label: "Private",
      icon: "lock-closed",
      description: "Only you",
    },
  ];

  const messageOptions: {
    value: MessagePermission;
    label: string;
    description: string;
  }[] = [
    {
      value: "everyone",
      label: "Everyone",
      description: "Anyone can message you",
    },
    {
      value: "following",
      label: "Following",
      description: "Only people you follow",
    },
    { value: "none", label: "No One", description: "Turn off messages" },
  ];

  const VisibilitySelector = ({
    title,
    value,
    onChange,
  }: {
    title: string;
    value: VisibilityOption;
    onChange: (value: VisibilityOption) => void;
  }) => (
    <View style={styles.selectorContainer}>
      <Text style={[styles.selectorTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.optionsRow}>
        {visibilityOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.borderLight,
                },
                isSelected && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "08",
                },
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: colors.borderLighter },
                  isSelected && { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  { color: colors.textPrimary },
                  isSelected && { color: colors.primary },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  { color: colors.textTertiary },
                ]}
              >
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const SettingToggle = ({
    icon,
    title,
    subtitle,
    value,
    onChange,
    iconColor = colors.primary,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor?: string;
  }) => (
    <View style={[styles.toggleCard, { backgroundColor: colors.white }]}>
      <View style={styles.toggleContent}>
        <View
          style={[
            styles.toggleIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text
            style={[styles.toggleSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          onChange(val);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        trackColor={{ false: colors.borderLight, true: colors.primary + "50" }}
        thumbColor={value ? colors.primary : colors.white}
      />
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor = colors.primary,
    isDestructive = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    iconColor?: string;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: colors.white },
        isDestructive && { backgroundColor: colors.danger + "05" },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionContent}>
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: iconColor + "15" },
            isDestructive && { backgroundColor: colors.danger + "15" },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={isDestructive ? colors.danger : iconColor}
          />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[
              styles.actionTitle,
              { color: colors.textPrimary },
              isDestructive && { color: colors.danger },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.actionSubtitle, { color: colors.textSecondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Privacy & Safety
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Control who can see your content and interact with you
        </Text>
      </Animated.View>

      {/* Profile Visibility */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.section}
      >
        <VisibilitySelector
          title="Profile Visibility"
          value={profileVisibility}
          onChange={(val) => handleVisibilityChange("profile", val)}
        />
      </Animated.View>

      {/* Post Visibility */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.section}
      >
        <VisibilitySelector
          title="Default Post Visibility"
          value={postVisibility}
          onChange={(val) => handleVisibilityChange("post", val)}
        />
      </Animated.View>

      {/* Message Permissions */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Message Permissions
        </Text>
        <View style={styles.messageOptionsContainer}>
          {messageOptions.map((option) => {
            const isSelected = messagePermission === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.messageOption,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.borderLight,
                  },
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + "05",
                  },
                ]}
                onPress={() => {
                  setMessagePermission(option.value);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.messageOptionContent}>
                  <Text
                    style={[
                      styles.messageOptionLabel,
                      { color: colors.textPrimary },
                      isSelected && { color: colors.primary },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.messageOptionDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={[
                      styles.radioSelected,
                      { borderColor: colors.primary },
                    ]}
                  >
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                )}
                {!isSelected && (
                  <View
                    style={[styles.radio, { borderColor: colors.borderLight }]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Activity Settings */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Activity Settings
        </Text>
        <SettingToggle
          icon="eye-outline"
          title="Show Online Status"
          subtitle="Let others see when you're active"
          value={showOnlineStatus}
          onChange={setShowOnlineStatus}
        />
        <SettingToggle
          icon="checkmark-done-outline"
          title="Read Receipts"
          subtitle="Let others know when you've seen their messages"
          value={showReadReceipts}
          onChange={setShowReadReceipts}
        />
        <SettingToggle
          icon="pricetag-outline"
          title="Allow Tagging"
          subtitle="Let others tag you in posts"
          value={allowTagging}
          onChange={setAllowTagging}
        />
        <SettingToggle
          icon="pulse-outline"
          title="Show Activity Status"
          subtitle="Display your likes and comments publicly"
          value={showActivity}
          onChange={setShowActivity}
        />
      </Animated.View>

      {/* Discovery Settings */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Discovery
        </Text>
        <SettingToggle
          icon="search-outline"
          title="Searchable Profile"
          subtitle="Allow your profile to appear in search results"
          value={searchable}
          onChange={setSearchable}
          iconColor="#8B5CF6"
        />
      </Animated.View>

      {/* Data & Privacy Actions */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Data & Privacy
        </Text>
        <ActionButton
          icon="trash-outline"
          title="Clear Search History"
          subtitle="Remove all your recent searches"
          onPress={handleClearSearchHistory}
          iconColor="#F97316"
        />
        <ActionButton
          icon="download-outline"
          title="Download Your Data"
          subtitle="Get a copy of your information"
          onPress={handleDownloadData}
          iconColor="#10B981"
        />
        <ActionButton
          icon="shield-outline"
          title="Blocked Accounts"
          subtitle="Manage blocked users"
          onPress={() => console.log("Navigate to blocked accounts")}
          iconColor="#EC4899"
        />
        <ActionButton
          icon="time-outline"
          title="Muted Accounts"
          subtitle="View accounts you've muted"
          onPress={() => console.log("Navigate to muted accounts")}
          iconColor="#6366F1"
        />
      </Animated.View>

      {/* Danger Zone */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Danger Zone
        </Text>
        <ActionButton
          icon="close-circle-outline"
          title="Deactivate Account"
          subtitle="Temporarily disable your account"
          onPress={() => {
            Alert.alert(
              "Deactivate Account",
              "Your profile will be hidden and you can reactivate anytime by logging back in.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Deactivate", style: "destructive" },
              ]
            );
          }}
          isDestructive
        />
        <ActionButton
          icon="warning-outline"
          title="Delete Account"
          subtitle="Permanently delete your account and data"
          onPress={() => {
            Alert.alert(
              "Delete Account",
              "This action cannot be undone. All your data will be permanently deleted.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ]
            );
          }}
          isDestructive
        />
      </Animated.View>

      {/* Info Card */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(400)}
        style={[styles.infoCard, { backgroundColor: colors.primary + "10" }]}
      >
        <Ionicons name="information-circle" size={24} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Your privacy is important to us. Learn more about how we protect your
          data in our{" "}
          <Text style={[styles.infoLink, { color: colors.primary }]}>
            Privacy Policy
          </Text>
          .
        </Text>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default PrivacySettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },

  // Visibility Selector
  selectorContainer: {
    marginBottom: 8,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },

  // Message Options
  messageOptionsContainer: {
    gap: 12,
  },
  messageOption: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
  },
  messageOptionContent: {
    flex: 1,
  },
  messageOptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  messageOptionDescription: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Toggle Styles
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },

  // Action Button
  actionButton: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },

  // Info Card
  infoCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },
  infoLink: {
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  bottomSpacer: {
    height: 40,
  },
});
