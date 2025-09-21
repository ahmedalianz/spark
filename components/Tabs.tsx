import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type tabEnum = "Threads" | "Reposts";
interface TabsProps {
  onTabChange: (tab: tabEnum) => void;
  activeTab?: tabEnum;
}

const Tabs: React.FC<TabsProps> = ({ onTabChange, activeTab = "Threads" }) => {
  const tabs: tabEnum[] = ["Threads", "Reposts"];
  const tabWidth = SCREEN_WIDTH / tabs.length;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: activeIndex * tabWidth,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1.05,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [activeTab, tabWidth, translateX, scale]);

  const handleTabPress = (tab: tabEnum) => {
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      {/* Gradient indicator */}
      <Animated.View
        style={[
          styles.indicatorContainer,
          {
            width: tabWidth,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Tab buttons */}
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Animated.Text
              style={[
                styles.tabText,
                isActive && styles.activeTabText,
                {
                  transform: [{ scale: isActive ? scale : 1 }],
                },
              ]}
            >
              {tab}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderVeryLight,
    position: "relative",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 0,
    height: 3,
    alignItems: "center",
  },
  gradient: {
    width: "40%",
    height: "100%",
    borderRadius: 2,
  },
  tab: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textTertiary,
    fontFamily: "DMSans_500Medium",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});

export default Tabs;
