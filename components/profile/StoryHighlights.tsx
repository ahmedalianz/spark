import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useAppTheme from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const StoryHighlights = () => {
  const [showHighlights, setShowHighlights] = useState(true);
  const { colors } = useAppTheme();

  const highlights = [
    { id: "1", title: "Travel", image: "🌍", count: 5 },
    { id: "2", title: "Work", image: "💼", count: 8 },
    { id: "3", title: "Food", image: "🍕", count: 12 },
    { id: "4", title: "Events", image: "🎉", count: 3 },
  ];

  return (
    <View
      style={[
        styles.highlightsContainer,
        { borderTopColor: colors.borderLight },
      ]}
    >
      <View style={styles.highlightsHeader}>
        <Text style={[styles.highlightsTitle, { color: colors.textPrimary }]}>
          Highlights
        </Text>
        <TouchableOpacity onPress={() => setShowHighlights(!showHighlights)}>
          <Ionicons
            name={showHighlights ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {showHighlights && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsList}
        >
          <TouchableOpacity style={styles.addHighlight}>
            <View
              style={[
                styles.addHighlightCircle,
                {
                  backgroundColor: colors.backgroundLight,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name="add" size={24} color={colors.textTertiary} />
            </View>
            <Text
              style={[styles.highlightLabel, { color: colors.textSecondary }]}
            >
              New
            </Text>
          </TouchableOpacity>

          {highlights.map((highlight) => (
            <TouchableOpacity key={highlight.id} style={styles.highlightItem}>
              <View
                style={[
                  styles.highlightCircle,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.highlightEmoji}>{highlight.image}</Text>
                <View
                  style={[
                    styles.highlightBadge,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <Text
                    style={[styles.highlightCount, { color: colors.white }]}
                  >
                    {highlight.count}
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.highlightLabel, { color: colors.textSecondary }]}
              >
                {highlight.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default StoryHighlights;

const styles = StyleSheet.create({
  highlightsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  highlightsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  highlightsTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  highlightsList: {
    paddingVertical: 8,
  },
  addHighlight: {
    alignItems: "center",
    marginRight: 20,
  },
  addHighlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  highlightItem: {
    alignItems: "center",
    marginRight: 20,
  },
  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  highlightEmoji: {
    fontSize: 24,
  },
  highlightBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  highlightCount: {
    fontSize: 10,
    fontWeight: "600",
  },
  highlightLabel: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
});
