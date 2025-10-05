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

interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const loginSessions: LoginSession[] = [
    {
      id: "1",
      device: "iPhone 14 Pro",
      location: "Cairo, Egypt",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      location: "Cairo, Egypt",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "3",
      device: "Chrome on Windows",
      location: "Alexandria, Egypt",
      lastActive: "2 days ago",
      isCurrent: false,
    },
  ];

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "You will be redirected to the password change screen.",
      [{ text: "OK" }]
    );
  };

  const handleSetup2FA = () => {
    if (twoFactorEnabled) {
      Alert.alert(
        "Disable Two-Factor Authentication",
        "Are you sure you want to disable 2FA? Your account will be less secure.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => {
              setTwoFactorEnabled(false);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Enable Two-Factor Authentication",
        "We'll guide you through setting up 2FA for enhanced security.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              // Navigate to 2FA setup
              console.log("Navigate to 2FA setup");
            },
          },
        ]
      );
    }
  };

  const handleEndSession = (sessionId: string, deviceName: string) => {
    Alert.alert("End Session", `End session on ${deviceName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Session",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Implement end session logic
        },
      },
    ]);
  };

  const handleEndAllSessions = () => {
    Alert.alert(
      "End All Sessions",
      "This will log you out from all devices except this one. You'll need to log in again on those devices.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End All",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const SecurityToggle = ({
    icon,
    title,
    subtitle,
    value,
    onChange,
    iconColor = Colors.primary,
    badge,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor?: string;
    badge?: string;
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
          <View style={styles.titleRow}>
            <Text style={styles.toggleTitle}>{title}</Text>
          </View>
          <Text style={styles.toggleSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          onChange(val);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        trackColor={{ false: Colors.borderLight, true: iconColor + "50" }}
        thumbColor={value ? iconColor : Colors.white}
      />
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor = Colors.primary,
    showArrow = true,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    iconColor?: string;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionContent}>
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>{title}</Text>
          {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.textTertiary}
        />
      )}
    </TouchableOpacity>
  );

  const SessionCard = ({ session }: { session: LoginSession }) => (
    <View
      style={[
        styles.sessionCard,
        session.isCurrent && styles.currentSessionCard,
      ]}
    >
      <View style={styles.sessionIcon}>
        <Ionicons
          name={
            session.device.includes("iPhone") ||
            session.device.includes("Android")
              ? "phone-portrait"
              : session.device.includes("Mac") ||
                  session.device.includes("Windows")
                ? "laptop"
                : "desktop"
          }
          size={24}
          color={session.isCurrent ? Colors.primary : Colors.textSecondary}
        />
      </View>
      <View style={styles.sessionInfo}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionDevice}>{session.device}</Text>
          {session.isCurrent && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current</Text>
            </View>
          )}
        </View>
        <View style={styles.sessionDetails}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.textTertiary}
          />
          <Text style={styles.sessionLocation}>{session.location}</Text>
          <Text style={styles.sessionDot}>•</Text>
          <Text style={styles.sessionTime}>{session.lastActive}</Text>
        </View>
      </View>
      {!session.isCurrent && (
        <TouchableOpacity
          style={styles.endSessionButton}
          onPress={() => handleEndSession(session.id, session.device)}
        >
          <Ionicons name="close-circle" size={24} color={Colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>Security</Text>
        <Text style={styles.headerSubtitle}>
          Keep your account safe and secure
        </Text>
      </Animated.View>

      {/* Security Status Card */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.statusCard}
      >
        <View style={styles.statusIconContainer}>
          <Ionicons
            name={twoFactorEnabled ? "shield-checkmark" : "shield-outline"}
            size={32}
            color={twoFactorEnabled ? "#10B981" : "#F97316"}
          />
        </View>
        <Text style={styles.statusTitle}>
          {twoFactorEnabled ? "Account is Secured" : "Enhance Your Security"}
        </Text>
        <Text style={styles.statusSubtitle}>
          {twoFactorEnabled
            ? "Two-factor authentication is active"
            : "Enable 2FA for better protection"}
        </Text>
        {!twoFactorEnabled && (
          <TouchableOpacity
            style={styles.statusButton}
            onPress={handleSetup2FA}
          >
            <Text style={styles.statusButtonText}>Enable 2FA</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Authentication Methods */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Authentication</Text>
        <SecurityToggle
          icon="shield-checkmark-outline"
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          value={twoFactorEnabled}
          onChange={handleSetup2FA}
          iconColor="#10B981"
          badge="Recommended"
        />
        <SecurityToggle
          icon="finger-print-outline"
          title="Biometric Login"
          subtitle="Use Face ID or fingerprint"
          value={biometricEnabled}
          onChange={setBiometricEnabled}
          iconColor="#8B5CF6"
        />
        <ActionButton
          icon="key-outline"
          title="Change Password"
          subtitle="Update your password regularly"
          onPress={handleChangePassword}
          iconColor="#F97316"
        />
      </Animated.View>

      {/* Security Alerts */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Security Alerts</Text>
        <SecurityToggle
          icon="notifications-outline"
          title="Login Alerts"
          subtitle="Get notified of new logins"
          value={loginAlerts}
          onChange={setLoginAlerts}
          iconColor="#EC4899"
        />
      </Animated.View>

      {/* Active Sessions */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          <TouchableOpacity onPress={handleEndAllSessions}>
            <Text style={styles.endAllText}>End All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionDescription}>
          {"Manage devices where you're logged in"}
        </Text>
        <View style={styles.sessionsContainer}>
          {loginSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </View>
      </Animated.View>

      {/* Additional Security */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Additional Security</Text>
        <ActionButton
          icon="time-outline"
          title="Login History"
          subtitle="View all login attempts"
          onPress={() => console.log("Navigate to login history")}
          iconColor="#6366F1"
        />
        <ActionButton
          icon="shield-outline"
          title="Authorized Apps"
          subtitle="Manage third-party access"
          onPress={() => console.log("Navigate to authorized apps")}
          iconColor="#14B8A6"
        />
        <ActionButton
          icon="mail-outline"
          title="Email Verification"
          subtitle="Verify your email address"
          onPress={() => console.log("Navigate to email verification")}
          iconColor="#F59E0B"
        />
      </Animated.View>

      {/* Security Tips */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={styles.tipsCard}
      >
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={24} color="#F59E0B" />
          <Text style={styles.tipsTitle}>Security Tips</Text>
        </View>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.tipText}>Use a strong, unique password</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.tipText}>Enable two-factor authentication</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.tipText}>Review active sessions regularly</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.tipText}>{"Don't share your password"}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default SecuritySettings;

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
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
  },
  endAllText: {
    fontSize: 15,
    color: Colors.danger,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  // Status Card
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 32,
    alignItems: "center",
    shadowColor: Colors.blackPure,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.borderLighter,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_600SemiBold",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
  },
  toggleSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },
  badge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderTopStartRadius: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_600SemiBold",
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
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },

  // Session Styles
  sessionsContainer: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  currentSessionCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.borderLighter,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
  },
  currentBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_600SemiBold",
  },
  sessionDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionLocation: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },
  sessionDot: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  sessionTime: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontFamily: "DMSans_400Regular",
  },
  endSessionButton: {
    padding: 8,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: "DMSans_400Regular",
    flex: 1,
  },

  bottomSpacer: {
    height: 40,
  },
});
