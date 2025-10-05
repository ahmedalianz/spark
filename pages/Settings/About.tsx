import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function AboutScreen() {
  const appVersion = "1.0.0";
  const buildNumber = "2024.10.01";
  const { colors } = useAppTheme();
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const LinkCard = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={[styles.linkCard, { backgroundColor: colors.white }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.linkContent}>
        <View
          style={[
            styles.linkIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.linkTextContainer}>
          <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.linkSubtitle, { color: colors.textSecondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const TeamMember = ({
    name,
    role,
    image,
  }: {
    name: string;
    role: string;
    image: string;
  }) => (
    <View style={[styles.teamMember, { backgroundColor: colors.white }]}>
      <Image
        source={{ uri: image }}
        style={[
          styles.teamMemberImage,
          { backgroundColor: colors.borderLighter },
        ]}
      />
      <Text style={[styles.teamMemberName, { color: colors.textPrimary }]}>
        {name}
      </Text>
      <Text style={[styles.teamMemberRole, { color: colors.textSecondary }]}>
        {role}
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "About Spark",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon & Info */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.appHeader}>
          <View style={styles.appIconContainer}>
            <View
              style={[
                styles.appIcon,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.blackPure,
                },
              ]}
            >
              <Ionicons name="flash" size={48} color={colors.white} />
            </View>
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            Spark
          </Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            Connect, Share, Inspire
          </Text>
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.textTertiary }]}>
              Version {appVersion}
            </Text>
            <Text style={[styles.versionDot, { color: colors.textTertiary }]}>
              •
            </Text>
            <Text style={[styles.versionText, { color: colors.textTertiary }]}>
              Build {buildNumber}
            </Text>
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            About Spark
          </Text>
          <View
            style={[styles.descriptionCard, { backgroundColor: colors.white }]}
          >
            <Text
              style={[styles.descriptionText, { color: colors.textSecondary }]}
            >
              Spark is a modern social platform designed to help you connect
              with friends, share moments, and discover inspiring content. Built
              with privacy and user experience at its core.
            </Text>
          </View>
        </Animated.View>

        {/* Links */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Legal & Policies
          </Text>
          <LinkCard
            icon="document-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => handleOpenLink("https://spark.app/terms")}
            iconColor="#1877F2"
          />
          <LinkCard
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => handleOpenLink("https://spark.app/privacy")}
            iconColor="#10B981"
          />
          <LinkCard
            icon="people"
            title="Community Guidelines"
            subtitle="Rules for a safe community"
            onPress={() => handleOpenLink("https://spark.app/guidelines")}
            iconColor="#8B5CF6"
          />
          <LinkCard
            icon="briefcase"
            title="Licenses"
            subtitle="Open source acknowledgments"
            onPress={() => console.log("Open licenses")}
            iconColor="#F59E0B"
          />
        </Animated.View>

        {/* Social Links */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Connect With Us
          </Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
              onPress={() => handleOpenLink("https://twitter.com/spark")}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
              onPress={() => handleOpenLink("https://facebook.com/spark")}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
              onPress={() => handleOpenLink("https://instagram.com/spark")}
            >
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor: colors.white,
                  shadowColor: colors.blackPure,
                },
              ]}
              onPress={() =>
                handleOpenLink("https://linkedin.com/company/spark")
              }
            >
              <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Team */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Meet the Team
          </Text>
          <View style={styles.teamContainer}>
            <TeamMember
              name="Ahmed Ali"
              role="Founder & CEO"
              image="https://i.pravatar.cc/150?img=12"
            />
            <TeamMember
              name="Sarah Johnson"
              role="Head of Product"
              image="https://i.pravatar.cc/150?img=45"
            />
            <TeamMember
              name="Mike Chen"
              role="Lead Engineer"
              image="https://i.pravatar.cc/150?img=33"
            />
            <TeamMember
              name="Emma Davis"
              role="Head of Design"
              image="https://i.pravatar.cc/150?img=47"
            />
          </View>
        </Animated.View>

        {/* Credits */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.creditsCard}
        >
          <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
            Made with ❤️ in Cairo, Egypt
          </Text>
          <Text style={[styles.creditsSubtext, { color: colors.textTertiary }]}>
            © 2024 Spark Inc. All rights reserved.
          </Text>
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
  appHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    marginBottom: 12,
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  versionText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  versionDot: {
    fontSize: 14,
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

  // Description
  descriptionCard: {
    borderRadius: 16,
    padding: 20,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
  },

  // Link Card
  linkCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  linkTextContainer: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },

  // Social
  socialContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Team
  teamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  teamMember: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  teamMemberImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
    textAlign: "center",
  },
  teamMemberRole: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },

  // Credits
  creditsCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  creditsText: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },

  bottomSpacer: {
    height: 40,
  },
});
