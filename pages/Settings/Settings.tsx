import useAppTheme from "@/hooks/useAppTheme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const settingsSections = [
    {
      id: "account",
      title: "Account",
      data: [
        {
          id: "edit-profile",
          iconName: "person-outline",
          title: "Edit Profile",
          onPress: () => router.push("/(auth)/(modals)/edit-profile"),
        },
        {
          id: "privacy",
          iconName: "lock-closed-outline",
          title: "Privacy & Safety",
          subtitle: "Manage your privacy settings",
          onPress: () => router.push("/(auth)/(settings)/privacy"),
        },
        {
          id: "security",
          iconName: "shield-checkmark-outline",
          title: "Security",
          subtitle: "Two-factor authentication, login history",
          onPress: () => router.push("/(auth)/(settings)/security"),
        },
        {
          id: "blocked-users",
          iconName: "ban-outline",
          title: "Blocked Users",
          subtitle: "Manage blocked accounts",
          onPress: () => router.push("/(auth)/(settings)/blocked-users"),
        },
      ],
    },
    {
      id: "preferences",
      title: "Preferences",
      data: [
        {
          id: "notifications",
          iconName: "notifications-outline",
          title: "Notifications",
          subtitle: "Push, email, and in-app notifications",
          onPress: () => router.push("/(auth)/(settings)/notifications"),
        },
        {
          id: "feed-preferences",
          iconName: "newspaper-outline",
          title: "Feed Preferences",
          subtitle: "Algorithm, content languages",
          onPress: () => router.push("/(auth)/(settings)/feed-preferences"),
        },
        {
          id: "appearance",
          iconName: "color-palette-outline",
          title: "Appearance",
          subtitle: "Theme, font size, reduce motion",
          onPress: () => router.push("/(auth)/(settings)/appearance"),
        },
        {
          id: "accessibility",
          iconName: "accessibility-outline",
          title: "Accessibility",
          subtitle: "Alt text, keyboard shortcuts",
          onPress: () => router.push("/(auth)/(settings)/accessibility"),
        },
      ],
    },
    {
      id: "content",
      title: "Content & Media",
      data: [
        {
          id: "saved-posts",
          iconName: "bookmark-outline",
          title: "Saved Posts",
          subtitle: "Your bookmarked content",
          onPress: () => router.push("/(auth)/(settings)/saved-posts"),
        },
        {
          id: "drafts",
          iconName: "document-outline",
          title: "Drafts",
          subtitle: "Your unpublished posts",
          onPress: () => router.push("/(auth)/(settings)/drafts"),
        },
      ],
    },
    {
      id: "support",
      title: "Support & About",
      data: [
        {
          id: "help",
          iconName: "help-circle-outline",
          title: "Help & Support",
          onPress: () => router.push("/(auth)/(settings)/help"),
        },
        {
          id: "data-export",
          iconName: "download-outline",
          title: "Data Export",
          subtitle: "Download your data",
          onPress: () => router.push("/(auth)/(settings)/data-export"),
        },
        {
          id: "about",
          iconName: "information-circle-outline",
          title: "About Spark",
          subtitle: "Version 1.0.0",
          onPress: () => router.push("/(auth)/(settings)/about"),
        },
      ],
    },
  ];
  const { signOut } = useAuth();

  const signOutHandler = useCallback(() => {
    signOut();
  }, [signOut]);

  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: top },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Preview */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.white,
              shadowColor: colors.blackPure,
            },
          ]}
        >
          <View style={styles.profileInfo}>
            <View
              style={[styles.avatar, { backgroundColor: colors.primaryLight }]}
            >
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                John Doe
              </Text>
              <Text
                style={[styles.profileEmail, { color: colors.textTertiary }]}
              >
                john.doe@example.com
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: colors.backgroundLight },
            ]}
            onPress={() => router.push("/(auth)/(modals)/edit-profile")}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View style={styles.sectionsContainer}>
          {settingsSections.map((section, sectionIndex) => (
            <View key={section.id} style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                {section.title}
              </Text>

              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: colors.white,
                    shadowColor: colors.blackPure,
                  },
                ]}
              >
                {section.data.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      itemIndex < section.data.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.borderLight,
                      },
                    ]}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.primary + "15" },
                        ]}
                      >
                        <Ionicons
                          name={item.iconName as any}
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.menuItemText}>
                        <Text
                          style={[
                            styles.menuItemTitle,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {item.subtitle && (
                          <Text
                            style={[
                              styles.menuItemSubtitle,
                              { color: colors.textTertiary },
                            ]}
                          >
                            {item.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.white,
              shadowColor: colors.blackPure,
            },
          ]}
          onPress={signOutHandler}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Log Out
            </Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          Spark App v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileCard: {
    margin: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  versionText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginTop: 24,
  },
});
