import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CurrentUserMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onMenuAction: (action: string) => void;
}

const CurrentUserMenuModal: React.FC<CurrentUserMenuModalProps> = ({
  visible,
  onClose,
  onMenuAction,
}) => {
  const menuOptions = [
    {
      icon: "qr-code-outline",
      label: "My QR Code",
      action: "qr_code",
      color: Colors.textPrimary,
    },
    {
      icon: "bookmark-outline",
      label: "Saved Posts",
      action: "saved_posts",
      color: Colors.textPrimary,
    },
    {
      icon: "people-outline",
      label: "Close Friends",
      action: "close_friends",
      color: Colors.textPrimary,
    },
    {
      icon: "lock-closed-outline",
      label: "Account Privacy",
      action: "privacy",
      color: Colors.textPrimary,
    },
    {
      icon: "color-palette-outline",
      label: "Appearance",
      action: "appearance",
      color: Colors.textPrimary,
    },
  ];

  const handleAction = (action: string) => {
    onMenuAction(action);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Profile Settings</Text>
              </View>

              {menuOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.action}
                  style={[
                    styles.menuItem,
                    index === menuOptions.length - 1 && styles.lastMenuItem,
                  ]}
                  onPress={() => handleAction(option.action)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color={option.color}
                  />
                  <Text style={styles.menuText}>{option.label}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.footer}>
                <Link href="/(auth)/(modals)/settings" asChild>
                  <TouchableOpacity style={styles.footerButton}>
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.footerButtonText}>All Settings</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.transparentBlack70,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLighter,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    fontFamily: "DMSans_600SemiBold",
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: Colors.textPrimary,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLighter,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  footerButtonText: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
  },
});

export default CurrentUserMenuModal;
