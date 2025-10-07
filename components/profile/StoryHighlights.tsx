import { ColorsType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const StoryHighlights = ({ colors }: { colors: ColorsType }) => {
  const [showHighlights, setShowHighlights] = useState(false);

  const highlights = [
    { id: "1", title: "Travel", emoji: "🌍", count: 5 },
    { id: "2", title: "Work", emoji: "💼", count: 8 },
    { id: "3", title: "Food", emoji: "🍕", count: 12 },
  ];

  if (!showHighlights && highlights.length === 0) return null;

  return (
    <View
      style={[
        styles.highlightsContainer,
        { borderTopColor: colors.borderLight },
      ]}
    >
      <TouchableOpacity
        style={styles.highlightsHeader}
        onPress={() => setShowHighlights(!showHighlights)}
      >
        <Text style={[styles.highlightsTitle, { color: colors.textPrimary }]}>
          Highlights
        </Text>
        <Ionicons
          name={showHighlights ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      {showHighlights && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsList}
          contentContainerStyle={styles.highlightsContent}
        >
          <TouchableOpacity style={styles.addHighlight}>
            <View
              style={[
                styles.highlightCircle,
                {
                  backgroundColor: colors.backgroundLight,
                  borderColor: colors.borderLight,
                  borderStyle: "dashed",
                },
              ]}
            >
              <Ionicons name="add" size={20} color={colors.textTertiary} />
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
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Text style={styles.highlightEmoji}>{highlight.emoji}</Text>
                {highlight.count > 0 && (
                  <View
                    style={[
                      styles.highlightBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[styles.highlightCount, { color: colors.white }]}
                    >
                      {highlight.count}
                    </Text>
                  </View>
                )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  highlightsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  highlightsTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "DMSans_600SemiBold",
  },
  highlightsList: {
    paddingVertical: 4,
  },
  highlightsContent: {
    paddingRight: 16,
  },
  addHighlight: {
    alignItems: "center",
    marginRight: 16,
  },
  highlightItem: {
    alignItems: "center",
    marginRight: 16,
  },
  highlightCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1.5,
    position: "relative",
  },
  highlightEmoji: {
    fontSize: 20,
  },
  highlightBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  highlightCount: {
    fontSize: 9,
    fontWeight: "700",
  },
  highlightLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
});
