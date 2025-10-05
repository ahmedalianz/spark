import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
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

interface ExportRequest {
  id: string;
  date: string;
  status: "completed" | "processing" | "failed";
  size: string;
  downloadUrl?: string;
}

export default function DataExport() {
  const { colors } = useAppTheme();
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    posts: true,
    comments: true,
    likes: true,
    messages: false,
    media: true,
    profile: true,
    followers: true,
    following: true,
  });

  const [exportHistory, setExportHistory] = useState<ExportRequest[]>([
    {
      id: "1",
      date: "2024-09-15",
      status: "completed",
      size: "45 MB",
      downloadUrl: "https://download.spark.app/export1",
    },
    {
      id: "2",
      date: "2024-08-01",
      status: "completed",
      size: "38 MB",
      downloadUrl: "https://download.spark.app/export2",
    },
  ]);
  const handleDownload = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open link");
    });
  };
  const handleRequestExport = () => {
    const selectedCount =
      Object.values(selectedDataTypes).filter(Boolean).length;

    if (selectedCount === 0) {
      Alert.alert(
        "No Data Selected",
        "Please select at least one data type to export."
      );
      return;
    }

    Alert.alert(
      "Request Data Export",
      `You've selected ${selectedCount} data type(s). We'll prepare your export and send you an email with a download link within 48 hours.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Implement download logic
          },
        },
      ]
    );
  };

  const DataTypeToggle = ({
    icon,
    title,
    description,
    dataKey,
    iconColor,
  }: {
    icon: string;
    title: string;
    description: string;
    dataKey: keyof typeof selectedDataTypes;
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.dataTypeCard,
        { backgroundColor: colors.white, borderColor: colors.borderLight },
        selectedDataTypes[dataKey] && {
          borderColor: colors.primary,
          backgroundColor: colors.primary + "05",
        },
      ]}
      onPress={() => {
        setSelectedDataTypes((prev) => ({
          ...prev,
          [dataKey]: !prev[dataKey],
        }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.dataTypeContent}>
        <View
          style={[
            styles.dataTypeIconContainer,
            { backgroundColor: iconColor + "15" },
          ]}
        >
          <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.dataTypeTextContainer}>
          <Text style={[styles.dataTypeTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.dataTypeDescription,
              { color: colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.checkbox,
          { borderColor: colors.borderLight },
          selectedDataTypes[dataKey] && {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
        ]}
      >
        {selectedDataTypes[dataKey] && (
          <Ionicons name="checkmark" size={18} color={colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ExportHistoryItem = ({ request }: { request: ExportRequest }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "#10B981";
        case "processing":
          return "#F59E0B";
        case "failed":
          return "#EF4444";
        default:
          return colors.textTertiary;
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return "checkmark-circle";
        case "processing":
          return "time";
        case "failed":
          return "close-circle";
        default:
          return "ellipse";
      }
    };

    return (
      <View style={[styles.historyItem, { backgroundColor: colors.white }]}>
        <View style={styles.historyContent}>
          <View
            style={[
              styles.historyIconContainer,
              { backgroundColor: getStatusColor(request.status) + "15" },
            ]}
          >
            <Ionicons
              name={getStatusIcon(request.status) as any}
              size={24}
              color={getStatusColor(request.status)}
            />
          </View>
          <View style={styles.historyTextContainer}>
            <Text style={[styles.historyDate, { color: colors.textPrimary }]}>
              {new Date(request.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <View style={styles.historyMeta}>
              <Text
                style={[
                  styles.historyStatus,
                  { color: getStatusColor(request.status) },
                ]}
              >
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </Text>
              <Text style={[styles.historyDot, { color: colors.textTertiary }]}>
                •
              </Text>
              <Text
                style={[styles.historySize, { color: colors.textTertiary }]}
              >
                {request.size}
              </Text>
            </View>
          </View>
        </View>
        {request.status === "completed" && request.downloadUrl && (
          <TouchableOpacity
            style={[
              styles.downloadButton,
              { backgroundColor: colors.primary + "15" },
            ]}
            onPress={() => handleDownload(request.downloadUrl!)}
          >
            <Ionicons name="download" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Data Export",
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
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Download Your Data
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Request a copy of your information from Spark
          </Text>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.infoCard, { backgroundColor: colors.primary + "10" }]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {
              "Your data will be prepared as a downloadable file. We'll email you when it's ready (usually within 48 hours). The download link expires after 7 days."
            }
          </Text>
        </Animated.View>

        {/* Select Data Types */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Select Data to Export
          </Text>
          <DataTypeToggle
            icon="document-text"
            title="Posts"
            description="All your posts and captions"
            dataKey="posts"
            iconColor="#1877F2"
          />
          <DataTypeToggle
            icon="chatbubbles"
            title="Comments"
            description="Comments you've made"
            dataKey="comments"
            iconColor="#8B5CF6"
          />
          <DataTypeToggle
            icon="heart"
            title="Likes"
            description="Posts you've liked"
            dataKey="likes"
            iconColor="#E4304F"
          />
          <DataTypeToggle
            icon="mail"
            title="Messages"
            description="Your direct messages"
            dataKey="messages"
            iconColor="#EC4899"
          />
          <DataTypeToggle
            icon="images"
            title="Media"
            description="Photos and videos"
            dataKey="media"
            iconColor="#F97316"
          />
          <DataTypeToggle
            icon="person"
            title="Profile Information"
            description="Your profile details"
            dataKey="profile"
            iconColor="#10B981"
          />
          <DataTypeToggle
            icon="people"
            title="Followers"
            description="List of your followers"
            dataKey="followers"
            iconColor="#6366F1"
          />
          <DataTypeToggle
            icon="person-add"
            title="Following"
            description="Accounts you follow"
            dataKey="following"
            iconColor="#14B8A6"
          />
        </Animated.View>

        {/* Request Button */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.requestButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
            onPress={handleRequestExport}
          >
            <Ionicons name="download-outline" size={20} color={colors.white} />
            <Text style={[styles.requestButtonText, { color: colors.white }]}>
              Request Data Export
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Export History */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Export History
          </Text>
          {exportHistory.length > 0 ? (
            exportHistory.map((request) => (
              <ExportHistoryItem key={request.id} request={request} />
            ))
          ) : (
            <View
              style={[styles.emptyState, { backgroundColor: colors.white }]}
            >
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: colors.borderLighter },
                ]}
              >
                <Ionicons
                  name="folder-open"
                  size={48}
                  color={colors.textTertiary}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No Export History
              </Text>
              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Your data export requests will appear here
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Privacy Note */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={[styles.privacyCard, { backgroundColor: "#10B981" + "10" }]}
        >
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Your data export is encrypted and only accessible by you. We never
            share your personal information with third parties.
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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

  // Info Card
  infoCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },

  // Data Type Card
  dataTypeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
  },
  dataTypeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dataTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dataTypeTextContainer: {
    flex: 1,
  },
  dataTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  dataTypeDescription: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  // Request Button
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },

  // Export History
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  historyMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  historyStatus: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
  },
  historyDot: {
    fontSize: 13,
  },
  historySize: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty State
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },

  // Privacy Card
  privacyCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginLeft: 12,
  },

  bottomSpacer: {
    height: 40,
  },
});
