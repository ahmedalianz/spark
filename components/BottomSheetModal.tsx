import { Colors } from "@/constants/Colors";
import { BottomSheetModalProps, MenuItemProps, MenuSection } from "@/types";
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
  ViewStyle,
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
  style,
  showArrow = true,
}: MenuItemProps & { style?: ViewStyle; showArrow?: boolean }) => {
  const IconComponent = iconLibrary === "feather" ? Feather : Ionicons;

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isDestructive && styles.destructiveMenuItem,
        isDisabled && styles.disabledMenuItem,
        !subtitle && styles.menuItemWithoutSubtitle,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.6}
      disabled={isDisabled}
    >
      <View
        style={[
          styles.menuIconContainer,
          isDestructive && styles.destructiveIconContainer,
          isDisabled && styles.disabledIconContainer,
        ]}
      >
        <IconComponent
          name={iconName as any}
          size={22}
          color={
            isDisabled
              ? Colors.textTertiary
              : isDestructive
                ? Colors.danger
                : Colors.primary
          }
        />
      </View>
      <View style={styles.menuTextContainer}>
        <Text
          style={[
            styles.menuTitle,
            isDestructive && styles.destructiveText,
            isDisabled && styles.disabledText,
            !subtitle && styles.menuTitleCentered,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.menuSubtitle, isDisabled && styles.disabledText]}
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
            color={Colors.textTertiary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const BottomSheetModal = ({
  visible,
  onClose,
  sections,
  height = SCREEN_HEIGHT * 0.85,
  closeOnBackdropPress = true,
  closeOnActionPress = true,
  animationType = "none",
  animationDuration = 300,
  containerStyle,
  sectionStyle,
  itemStyle,
  dividerStyle,
  renderFooter,
  renderCustomItem,
}: BottomSheetModalProps) => {
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
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animationDuration]);

  const handleAction = (item: MenuItemProps) => {
    if (closeOnActionPress) {
      onClose();
      // Small delay to allow animation to complete
      setTimeout(() => item.onPress(), animationDuration / 2);
    } else {
      item.onPress();
    }
  };

  const renderSection = (section: MenuSection, sectionIndex: number) => (
    <View key={section.id} style={[styles.menuSection, sectionStyle]}>
      {section.title && (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      {section.data.map((item, itemIndex) =>
        renderCustomItem ? (
          renderCustomItem(item, itemIndex)
        ) : (
          <MenuItem
            key={item.id}
            {...item}
            onPress={() => handleAction(item)}
            style={itemStyle}
            showArrow={!item.isDisabled}
          />
        )
      )}
      {section.showDivider && sectionIndex < sections.length - 1 && (
        <View style={[styles.menuDivider, dividerStyle]} />
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
              backgroundColor: Colors.transparentBlack50,
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
                },
                containerStyle,
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

              {/* Footer */}
              {renderFooter && (
                <View style={styles.menuFooter}>{renderFooter()}</View>
              )}
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: Colors.blackPure,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 24,
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
    color: Colors.textTertiary,
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
    backgroundColor: Colors.white,
  },
  menuItemWithoutSubtitle: {
    alignItems: "center",
  },
  destructiveMenuItem: {
    backgroundColor: Colors.danger + "05",
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  destructiveIconContainer: {
    backgroundColor: Colors.danger + "15",
  },
  disabledIconContainer: {
    backgroundColor: Colors.textTertiary + "15",
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
    fontFamily: "DMSans_600SemiBold",
  },
  menuTitleCentered: {
    marginBottom: 0,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
  destructiveText: {
    color: Colors.danger,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
  menuArrow: {
    justifyContent: "center",
    marginLeft: 8,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  menuFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    padding: 16,
  },
});

export default BottomSheetModal;
