import { Colors } from "@/constants/Colors";
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

type MenuAction =
  | "save"
  | "report"
  | "notifications"
  | "copyLink"
  | "snooze"
  | "hideAuthor"
  | "delete"
  | "block";

type PostMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  isOwnPost: boolean;
  onMenuAction: (action: MenuAction) => void;
};

type MenuItemProps = {
  iconName: string;
  iconLibrary?: "ionicons" | "feather";
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
  showDivider?: boolean;
};

const MenuItem = ({
  iconName,
  iconLibrary = "ionicons",
  title,
  subtitle,
  onPress,
  isDestructive,
  showDivider,
}: MenuItemProps) => {
  const IconComponent = iconLibrary === "feather" ? Feather : Ionicons;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.menuItem,
          isDestructive && styles.destructiveMenuItem,
          !subtitle && styles.menuItemWithoutSubtitle,
        ]}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles.menuIconContainer,
            isDestructive && styles.destructiveIconContainer,
          ]}
        >
          <IconComponent
            name={iconName as any}
            size={22}
            color={isDestructive ? Colors.danger : Colors.primary}
          />
        </View>
        <View style={styles.menuTextContainer}>
          <Text
            style={[
              styles.menuTitle,
              isDestructive && styles.destructiveText,
              !subtitle && styles.menuTitleCentered,
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.menuArrow}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.menuDivider} />}
    </>
  );
};

const PostMenuModal = ({
  visible,
  onClose,
  isOwnPost,
  onMenuAction,
}: PostMenuModalProps) => {
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
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAction = (action: MenuAction) => {
    onClose();
    setTimeout(() => onMenuAction(action), 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Header */}
              <View style={styles.menuHeader} />

              <ScrollView
                style={styles.menuScrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={styles.menuSection}>
                  <MenuItem
                    iconName="bookmark-outline"
                    title="Save post"
                    subtitle="Add this to your saved items"
                    onPress={() => handleAction("save")}
                  />

                  <MenuItem
                    iconName="notifications-outline"
                    title="Turn on notifications"
                    subtitle="Get notified about new activity"
                    onPress={() => handleAction("notifications")}
                  />

                  <MenuItem
                    iconName="link-outline"
                    title="Copy link"
                    onPress={() => handleAction("copyLink")}
                  />
                </View>

                <View style={styles.menuDivider} />

                <View style={styles.menuSection}>
                  <MenuItem
                    iconName="time-outline"
                    title="Snooze for 30 days"
                    subtitle="Temporarily stop seeing posts from this author"
                    onPress={() => handleAction("snooze")}
                  />

                  <MenuItem
                    iconName="eye-off-outline"
                    title="Hide all from this author"
                    subtitle="Stop seeing their posts in your feed"
                    onPress={() => handleAction("hideAuthor")}
                  />
                </View>

                <View style={styles.menuDivider} />

                <View style={styles.menuSection}>
                  <MenuItem
                    iconName="flag-outline"
                    title="Report post"
                    subtitle="We won't let them know who reported this"
                    onPress={() => handleAction("report")}
                  />

                  {isOwnPost ? (
                    <MenuItem
                      iconName="trash-outline"
                      title="Delete post"
                      isDestructive
                      onPress={() => handleAction("delete")}
                    />
                  ) : (
                    <MenuItem
                      iconName="ban-outline"
                      title="Block this author"
                      subtitle="You won't be able to see or contact each other"
                      isDestructive
                      onPress={() => handleAction("block")}
                    />
                  )}
                </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: Colors.blackPure,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 24,
  },
  menuHeader: {
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  menuHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  menuHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    fontFamily: "DMSans_700Bold",
  },
  menuScrollView: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 20,
  },
  menuSection: {
    paddingVertical: 4,
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
});
export default PostMenuModal;
