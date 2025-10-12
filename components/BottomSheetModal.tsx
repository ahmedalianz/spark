import useAppTheme from "@/hooks/useAppTheme";
import { useBottomSheet } from "@/store/bottomSheetStore";
import { ColorsType, MenuItemProps, MenuSection } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MenuItem = ({
  iconName,
  iconLibrary = "ionicons",
  title,
  subtitle,
  onPress,
  isDestructive,
  isDisabled = false,
  showArrow = true,
  colors,
}: MenuItemProps & {
  showArrow?: boolean;
  colors: ColorsType;
}) => {
  const IconComponent = iconLibrary === "feather" ? Feather : Ionicons;

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isDestructive && { backgroundColor: colors.danger + "05" },
        isDisabled && styles.disabledMenuItem,
        !subtitle && styles.menuItemWithoutSubtitle,
      ]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={isDisabled}
    >
      <View
        style={[
          styles.menuIconContainer,
          { backgroundColor: colors.primary + "15" },
          isDestructive && { backgroundColor: colors.danger + "15" },
          isDisabled && { backgroundColor: colors.textTertiary + "15" },
        ]}
      >
        <IconComponent
          name={iconName as any}
          size={22}
          color={
            isDisabled
              ? colors.textTertiary
              : isDestructive
                ? colors.danger
                : colors.primary
          }
        />
      </View>
      <View style={styles.menuTextContainer}>
        <Text
          style={[
            styles.menuTitle,
            { color: colors.textPrimary },
            isDestructive && { color: colors.danger },
            isDisabled && { color: colors.textTertiary },
            !subtitle && styles.menuTitleCentered,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.menuSubtitle,
              { color: colors.textSecondary },
              isDisabled && { color: colors.textTertiary },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && !isDisabled && (
        <View style={styles.menuArrow}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textTertiary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const BottomSheetModal = () => {
  const { colors } = useAppTheme();
  const { visible, sections, height, hideSheet } = useBottomSheet();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  if (!visible) return null;

  const handleAction = (item: MenuItemProps) => {
    hideSheet();
    setTimeout(() => item.onPress(), 150);
  };

  const renderSection = (section: MenuSection, sectionIndex: number) => (
    <View
      key={section.id}
      style={[
        styles.menuSection,
        {
          borderTopColor: colors.border,
          borderTopWidth: sectionIndex === 0 ? 0 : 1,
        },
      ]}
    >
      {section.title && (
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
          {section.title}
        </Text>
      )}
      {section.data.map((item, itemIndex) => (
        <MenuItem
          key={item.id}
          {...item}
          colors={colors}
          onPress={() => handleAction(item)}
          showArrow={!item.isDisabled}
        />
      ))}
      {section.showDivider && sectionIndex < sections.length - 1 && (
        <View
          style={[styles.menuDivider, { backgroundColor: colors.borderLight }]}
        />
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={"none"}
      onRequestClose={hideSheet}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={hideSheet}>
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
              backgroundColor: colors.transparentBlack50,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  transform: [{ translateY: slideAnim }],
                  maxHeight: height as number,
                  backgroundColor: colors.backgroundSecondary,
                },
              ]}
            >
              {/* Content */}
              <ScrollView
                style={styles.menuScrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {sections.map(renderSection)}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  menuContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  menuScrollView: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 20,
  },
  menuSection: {
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 8,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  menuItemWithoutSubtitle: {
    alignItems: "center",
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    fontFamily: "DMSans_600SemiBold",
  },
  menuTitleCentered: {
    marginBottom: 0,
  },
  menuSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
  menuArrow: {
    justifyContent: "center",
    marginLeft: 8,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
    marginHorizontal: 24,
  },
});

export default BottomSheetModal;
