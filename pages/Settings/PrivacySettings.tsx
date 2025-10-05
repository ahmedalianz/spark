import { Colors } from "@/constants/Colors";
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
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.optionsRow}>
        {visibilityOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => onChange(option.value)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  isSelected && styles.optionIconContainerSelected,
                ]}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={isSelected ? Colors.primary : Colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
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
    iconColor = Colors.primary,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor?: string;
  }) => (
    <View style={styles.toggleCard}>
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
          <Text style={styles.toggleTitle}>{title}</Text>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          onChange(val);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        trackColor={{ false: Colors.borderLight, true: Colors.primary + "50" }}
        thumbColor={value ? Colors.primary : Colors.white}
      />
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor = Colors.primary,
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
        isDestructive && styles.actionButtonDestructive,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionContent}>
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: iconColor + "15" },
            isDestructive && styles.actionIconContainerDestructive,
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={isDestructive ? Colors.danger : iconColor}
          />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[
              styles.actionTitle,
              isDestructive && styles.actionTitleDestructive,
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>Privacy & Safety</Text>
        <Text style={styles.headerSubtitle}>
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
        <Text style={styles.sectionTitle}>Message Permissions</Text>
        <View style={styles.messageOptionsContainer}>
          {messageOptions.map((option) => {
            const isSelected = messagePermission === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.messageOption,
                  isSelected && styles.messageOptionSelected,
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
                      isSelected && styles.messageOptionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.messageOptionDescription}>
                    {option.description}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                )}
                {!isSelected && <View style={styles.radio} />}
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
        <Text style={styles.sectionTitle}>Activity Settings</Text>
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
        <Text style={styles.sectionTitle}>Discovery</Text>
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
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
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
        <Text style={styles.sectionTitle}>Danger Zone</Text>
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
        style={styles.infoCard}
      >
        <Ionicons name="information-circle" size={24} color={Colors.primary} />
        <Text style={styles.infoText}>
          Your privacy is important to us. Learn more about how we protect your
          data in our <Text style={styles.infoLink}>Privacy Policy</Text>.
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
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "08",
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.borderLighter,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionIconContainerSelected: {
    backgroundColor: Colors.primary + "15",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },

  // Message Options
  messageOptionsContainer: {
    gap: 12,
  },
  messageOption: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  messageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
  },
  messageOptionContent: {
    flex: 1,
  },
  messageOptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  messageOptionLabelSelected: {
    color: Colors.primary,
  },
  messageOptionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },

  // Toggle Styles
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
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
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },

  // Action Button
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtonDestructive: {
    backgroundColor: Colors.danger + "05",
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
  actionIconContainerDestructive: {
    backgroundColor: Colors.danger + "15",
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  actionTitleDestructive: {
    color: Colors.danger,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.primary + "10",
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
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },
  infoLink: {
    color: Colors.primary,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  bottomSpacer: {
    height: 40,
  },
});
