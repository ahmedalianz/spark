import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open link");
    });
  };

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Choose how you'd like to contact us", [
      {
        text: "Email",
        onPress: () => handleOpenLink("mailto:support@spark.app"),
      },
      {
        text: "Chat",
        onPress: () => console.log("Open chat"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const HelpCard = ({
    icon,
    title,
    description,
    onPress,
    iconColor,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={styles.helpCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.helpCardContent}>
        <View
          style={[
            styles.helpIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpTitle}>{title}</Text>
          <Text style={styles.helpDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
    </TouchableOpacity>
  );

  const FAQItem = ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => {
          setIsExpanded(!isExpanded);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={Colors.textSecondary}
          />
        </View>
        {isExpanded && <Text style={styles.faqAnswer}>{answer}</Text>}
      </TouchableOpacity>
    );
  };
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.container, { paddingTop: top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.headerTitle}>How can we help?</Text>
        <Text style={styles.headerSubtitle}>Find answers and get support</Text>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.section}
      >
        <HelpCard
          icon="chatbubbles"
          title="Contact Support"
          description="Get help from our team"
          onPress={handleContactSupport}
          iconColor="#1877F2"
        />
        <HelpCard
          icon="book"
          title="Help Center"
          description="Browse articles and guides"
          onPress={() => handleOpenLink("https://help.spark.app")}
          iconColor="#8B5CF6"
        />
        <HelpCard
          icon="people"
          title="Community Forum"
          description="Connect with other users"
          onPress={() => handleOpenLink("https://community.spark.app")}
          iconColor="#10B981"
        />
        <HelpCard
          icon="videocam"
          title="Video Tutorials"
          description="Watch step-by-step guides"
          onPress={() => console.log("Open tutorials")}
          iconColor="#F97316"
        />
      </Animated.View>

      {/* Popular Topics */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Popular Topics</Text>
        <View style={styles.topicsContainer}>
          {[
            { title: "Getting Started", icon: "rocket" },
            { title: "Account Settings", icon: "person" },
            { title: "Privacy & Security", icon: "shield-checkmark" },
            { title: "Posting Content", icon: "create" },
            { title: "Notifications", icon: "notifications" },
            { title: "Billing", icon: "card" },
          ].map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={styles.topicChip}
              onPress={() => console.log(`Open ${topic.title}`)}
            >
              <Ionicons
                name={topic.icon as any}
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.topicText}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* FAQs */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Frequently Asked</Text>
        <FAQItem
          question="How do I reset my password?"
          answer="Go to Settings > Security > Change Password. You'll need to verify your email address before creating a new password."
        />
        <FAQItem
          question="How do I make my account private?"
          answer="Navigate to Settings > Privacy & Safety > Profile Visibility and select 'Private'. Only approved followers will see your posts."
        />
        <FAQItem
          question="Can I recover deleted posts?"
          answer="Deleted posts are permanently removed after 30 days. Within that period, you can find them in Settings > Content > Drafts."
        />
        <FAQItem
          question="How do I report inappropriate content?"
          answer="Tap the three dots on any post and select 'Report'. Choose the reason and our team will review it within 24 hours."
        />
      </Animated.View>

      {/* Contact Info */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        style={styles.contactCard}
      >
        <Text style={styles.contactTitle}>Still need help?</Text>
        <Text style={styles.contactDescription}>
          Our support team is available 24/7
        </Text>
        <View style={styles.contactMethods}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleOpenLink("mailto:support@spark.app")}
          >
            <Ionicons name="mail" size={20} color={Colors.white} />
            <Text style={styles.contactButtonText}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactButton, styles.contactButtonSecondary]}
            onPress={() => handleOpenLink("https://twitter.com/spark")}
          >
            <Ionicons name="logo-twitter" size={20} color={Colors.primary} />
            <Text style={styles.contactButtonTextSecondary}>Tweet Us</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },

  // Help Card
  helpCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helpCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
  },

  // Topics
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    fontFamily: "DMSans_500Medium",
  },

  // FAQ
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: "DMSans_600SemiBold",
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "DMSans_400Regular",
    marginTop: 12,
    lineHeight: 20,
  },

  // Contact Card
  contactCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: "DMSans_400Regular",
    marginBottom: 20,
    opacity: 0.9,
  },
  contactMethods: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white + "20",
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactButtonSecondary: {
    backgroundColor: Colors.white,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "DMSans_600SemiBold",
  },
  contactButtonTextSecondary: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "DMSans_600SemiBold",
  },

  bottomSpacer: {
    height: 40,
  },
});
