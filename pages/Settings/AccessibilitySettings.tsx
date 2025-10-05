import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
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

export default function AccessibilityScreen() {
  const { colors } = useAppTheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [increaseContrast, setIncreaseContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [autoAltText, setAutoAltText] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [audioDescriptions, setAudioDescriptions] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [buttonShapes, setButtonShapes] = useState(false);
  const [textSize, setTextSize] = useState(1);

  const ToggleSetting = ({
    icon,
    title,
    subtitle,
    value,
    onChange,
    iconColor,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor: string;
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
        trackColor={{ false: colors.borderLight, true: iconColor + "50" }}
        thumbColor={value ? iconColor : colors.white}
      />
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    iconColor: string;
  }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: colors.white }]}
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
          <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text
            style={[styles.actionSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  const getTextSizeLabel = (value: number) => {
    if (value < 0.5) return "Smallest";
    if (value < 1) return "Small";
    if (value < 1.5) return "Default";
    if (value < 2) return "Large";
    return "Largest";
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Accessibility",
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
            Accessibility
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Features to make Spark easier to use
          </Text>
        </Animated.View>

        {/* Visual Adjustments */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Visual
          </Text>

          {/* Text Size Slider */}
          <View style={[styles.sliderCard, { backgroundColor: colors.white }]}>
            <View style={styles.sliderHeader}>
              <View
                style={[
                  styles.sliderIconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Ionicons name="text" size={22} color={colors.primary} />
              </View>
              <View style={styles.sliderTextContainer}>
                <Text
                  style={[styles.sliderTitle, { color: colors.textPrimary }]}
                >
                  Text Size
                </Text>
                <Text style={[styles.sliderValue, { color: colors.primary }]}>
                  {getTextSizeLabel(textSize)}
                </Text>
              </View>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2}
              step={0.5}
              value={textSize}
              onValueChange={setTextSize}
              onSlidingComplete={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.borderLight}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text
                style={[styles.sliderLabel, { color: colors.textTertiary }]}
              >
                A
              </Text>
              <Text
                style={[
                  styles.sliderLabel,
                  styles.sliderLabelLarge,
                  { color: colors.textTertiary },
                ]}
              >
                A
              </Text>
            </View>
          </View>

          <ToggleSetting
            icon="flash-outline"
            title="Reduce Motion"
            subtitle="Minimize animations and transitions"
            value={reduceMotion}
            onChange={setReduceMotion}
            iconColor="#F97316"
          />
          <ToggleSetting
            icon="contrast-outline"
            title="Increase Contrast"
            subtitle="Make colors more distinct"
            value={increaseContrast}
            onChange={setIncreaseContrast}
            iconColor="#8B5CF6"
          />
          <ToggleSetting
            icon="shapes-outline"
            title="Button Shapes"
            subtitle="Add borders to buttons for clarity"
            value={buttonShapes}
            onChange={setButtonShapes}
            iconColor="#10B981"
          />
        </Animated.View>

        {/* Screen Reader */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Screen Reader
          </Text>
          <ToggleSetting
            icon="volume-high-outline"
            title="Screen Reader Support"
            subtitle="Optimize for VoiceOver & TalkBack"
            value={screenReader}
            onChange={setScreenReader}
            iconColor="#3B82F6"
          />
          <ToggleSetting
            icon="image-outline"
            title="Automatic Alt Text"
            subtitle="AI-generated descriptions for images"
            value={autoAltText}
            onChange={setAutoAltText}
            iconColor="#EC4899"
          />
        </Animated.View>

        {/* Media Accessibility */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Media
          </Text>
          <ToggleSetting
            icon="chatbox-ellipses-outline"
            title="Captions"
            subtitle="Show captions for videos"
            value={captionsEnabled}
            onChange={setCaptionsEnabled}
            iconColor="#6366F1"
          />
          <ToggleSetting
            icon="mic-outline"
            title="Audio Descriptions"
            subtitle="Narration for video content"
            value={audioDescriptions}
            onChange={setAudioDescriptions}
            iconColor="#14B8A6"
          />
        </Animated.View>

        {/* Interaction */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Interaction
          </Text>
          <ToggleSetting
            icon="keypad-outline"
            title="Keyboard Shortcuts"
            subtitle="Navigate with keyboard commands"
            value={keyboardShortcuts}
            onChange={setKeyboardShortcuts}
            iconColor="#F59E0B"
          />
          <ActionButton
            icon="list-outline"
            title="Keyboard Shortcuts List"
            subtitle="View all available shortcuts"
            onPress={() => console.log("Show shortcuts")}
            iconColor="#8B5CF6"
          />
        </Animated.View>

        {/* Resources */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Resources
          </Text>
          <ActionButton
            icon="document-text-outline"
            title="Accessibility Guide"
            subtitle="Learn about accessibility features"
            onPress={() => console.log("Open guide")}
            iconColor="#10B981"
          />
          <ActionButton
            icon="help-circle-outline"
            title="Report an Issue"
            subtitle="Help us improve accessibility"
            onPress={() => console.log("Report issue")}
            iconColor="#EF4444"
          />
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={[styles.infoCard, { backgroundColor: colors.primary + "10" }]}
        >
          <Ionicons name="heart" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {
              "We're committed to making Spark accessible to everyone. Your feedback helps us improve."
            }
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

  // Slider Card
  sliderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sliderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sliderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sliderTextContainer: {
    flex: 1,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 2,
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  sliderLabelLarge: {
    fontSize: 20,
  },

  // Toggle Settings
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

  bottomSpacer: {
    height: 40,
  },
});
