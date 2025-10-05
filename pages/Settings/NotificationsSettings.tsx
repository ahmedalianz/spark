import useAppTheme from "@/hooks/useAppTheme";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function NotificationsSettings() {
  const { colors } = useAppTheme();
  const { settings, updateSetting } = useUserSettings();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [localSettings, setLocalSettings] = useState({
    push: {
      likes: settings?.notifications?.push?.likes ?? true,
      comments: settings?.notifications?.push?.comments ?? true,
      follows: settings?.notifications?.push?.follows ?? true,
      mentions: settings?.notifications?.push?.mentions ?? true,
      reposts: settings?.notifications?.push?.reposts ?? true,
      directMessages: settings?.notifications?.push?.directMessages ?? true,
      storyReplies: settings?.notifications?.push?.storyReplies ?? true,
    },
    inApp: {
      badges: settings?.notifications?.inApp?.badges ?? true,
      sounds: settings?.notifications?.inApp?.sounds ?? true,
      previews: settings?.notifications?.inApp?.previews ?? true,
    },
    email: {
      securityAlerts: settings?.notifications?.email?.securityAlerts ?? true,
      productUpdates: settings?.notifications?.email?.productUpdates ?? false,
      weeklyDigest: settings?.notifications?.email?.weeklyDigest ?? false,
    },
  });

  const handleToggle = (category: string, key: string, value: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
    updateSetting("notifications", `${category}.${key}`, value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const NotificationToggle = ({
    icon,
    title,
    subtitle,
    value,
    onChange,
    disabled = false,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }) => (
    <View
      style={[
        styles.toggleCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.borderLighter,
        },
        disabled && styles.disabledCard,
      ]}
    >
      <View style={styles.toggleContent}>
        <View
          style={[
            styles.toggleIconContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={disabled ? colors.textTertiary : colors.textPrimary}
          />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text
            style={[
              styles.toggleTitle,
              { color: colors.textPrimary },
              disabled && { color: colors.textTertiary },
            ]}
          >
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
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.borderLight, true: colors.primary + "40" }}
        thumbColor={value ? colors.primary : colors.white}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.white }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Master Toggle */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.masterSection}
        >
          <View
            style={[
              styles.masterCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderLighter,
              },
            ]}
          >
            <View style={styles.masterContent}>
              <View
                style={[
                  styles.masterIconContainer,
                  { backgroundColor: colors.primary + "10" },
                ]}
              >
                <Ionicons
                  name={pushEnabled ? "notifications" : "notifications-off"}
                  size={24}
                  color={pushEnabled ? colors.primary : colors.textTertiary}
                />
              </View>
              <View style={styles.masterTextContainer}>
                <Text
                  style={[styles.masterTitle, { color: colors.textPrimary }]}
                >
                  Push Notifications
                </Text>
                <Text
                  style={[
                    styles.masterSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {pushEnabled
                    ? "You'll receive notifications"
                    : "All notifications are off"}
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => {
                setPushEnabled(val);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              trackColor={{
                false: colors.borderLight,
                true: colors.primary + "40",
              }}
              thumbColor={pushEnabled ? colors.primary : colors.white}
            />
          </View>
        </Animated.View>

        {/* Activity Notifications */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Activity
          </Text>
          <NotificationToggle
            icon="heart-outline"
            title="Likes"
            subtitle="When someone likes your post"
            value={localSettings.push.likes}
            onChange={(val) => handleToggle("push", "likes", val)}
            disabled={!pushEnabled}
          />
          <NotificationToggle
            icon="chatbubble-outline"
            title="Comments"
            subtitle="When someone comments on your post"
            value={localSettings.push.comments}
            onChange={(val) => handleToggle("push", "comments", val)}
            disabled={!pushEnabled}
          />
          <NotificationToggle
            icon="at-outline"
            title="Mentions"
            subtitle="When someone mentions you"
            value={localSettings.push.mentions}
            onChange={(val) => handleToggle("push", "mentions", val)}
            disabled={!pushEnabled}
          />
          <NotificationToggle
            icon="repeat-outline"
            title="Reposts"
            subtitle="When someone reposts your content"
            value={localSettings.push.reposts}
            onChange={(val) => handleToggle("push", "reposts", val)}
            disabled={!pushEnabled}
          />
        </Animated.View>

        {/* Social Notifications */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Social
          </Text>
          <NotificationToggle
            icon="person-add-outline"
            title="New Followers"
            subtitle="When someone follows you"
            value={localSettings.push.follows}
            onChange={(val) => handleToggle("push", "follows", val)}
            disabled={!pushEnabled}
          />
          <NotificationToggle
            icon="mail-outline"
            title="Direct Messages"
            subtitle="When you receive a message"
            value={localSettings.push.directMessages}
            onChange={(val) => handleToggle("push", "directMessages", val)}
            disabled={!pushEnabled}
          />
          <NotificationToggle
            icon="flash-outline"
            title="Story Replies"
            subtitle="When someone replies to your story"
            value={localSettings.push.storyReplies}
            onChange={(val) => handleToggle("push", "storyReplies", val)}
            disabled={!pushEnabled}
          />
        </Animated.View>

        {/* In-App Settings */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            In-App Settings
          </Text>
          <NotificationToggle
            icon="ellipse-outline"
            title="Badge Count"
            subtitle="Show unread count on app icon"
            value={localSettings.inApp.badges}
            onChange={(val) => handleToggle("inApp", "badges", val)}
          />
          <NotificationToggle
            icon="musical-notes-outline"
            title="Sounds"
            subtitle="Play sound for notifications"
            value={localSettings.inApp.sounds}
            onChange={(val) => handleToggle("inApp", "sounds", val)}
          />
          <NotificationToggle
            icon="eye-outline"
            title="Message Previews"
            subtitle="Show message content in notifications"
            value={localSettings.inApp.previews}
            onChange={(val) => handleToggle("inApp", "previews", val)}
          />
        </Animated.View>

        {/* Email Notifications */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Email Notifications
          </Text>
          <NotificationToggle
            icon="shield-checkmark-outline"
            title="Security Alerts"
            subtitle="Important security notifications"
            value={localSettings.email.securityAlerts}
            onChange={(val) => handleToggle("email", "securityAlerts", val)}
          />
          <NotificationToggle
            icon="sparkles-outline"
            title="Product Updates"
            subtitle="New features and improvements"
            value={localSettings.email.productUpdates}
            onChange={(val) => handleToggle("email", "productUpdates", val)}
          />
          <NotificationToggle
            icon="mail-open-outline"
            title="Weekly Digest"
            subtitle="Summary of your weekly activity"
            value={localSettings.email.weeklyDigest}
            onChange={(val) => handleToggle("email", "weeklyDigest", val)}
          />
        </Animated.View>

        {/* Quiet Hours */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quiet Hours
          </Text>
          <TouchableOpacity
            style={[
              styles.quietHoursCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderLighter,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.quietHoursContent}>
              <View
                style={[
                  styles.quietHoursIconContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.borderLight,
                  },
                ]}
              >
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={colors.textPrimary}
                />
              </View>
              <View style={styles.quietHoursText}>
                <Text
                  style={[
                    styles.quietHoursLabel,
                    { color: colors.textPrimary },
                  ]}
                >
                  Do Not Disturb
                </Text>
                <Text
                  style={[
                    styles.quietHoursDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Set up quiet hours to avoid interruptions
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 16,
  },

  // Master Section
  masterSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 24,
  },
  masterCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  masterContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  masterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  masterTextContainer: {
    flex: 1,
  },
  masterTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  masterSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },

  // Toggle Styles
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  disabledCard: {
    opacity: 0.5,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 16,
  },

  // Quiet Hours
  quietHoursCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  quietHoursContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  quietHoursIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  quietHoursText: {
    flex: 1,
  },
  quietHoursLabel: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  quietHoursDescription: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 16,
  },

  bottomSpacer: {
    height: 20,
  },
});
