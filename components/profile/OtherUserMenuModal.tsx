import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface OtherUserMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onMenuAction: (action: string) => void;
  isFollowing?: boolean;
  isBlocked?: boolean;
}

const OtherUserMenuModal: React.FC<OtherUserMenuModalProps> = ({
  visible,
  onClose,
  onMenuAction,
  isFollowing = false,
  isBlocked = false,
}) => {
  const menuOptions = [
    {
      icon: "notifications-outline",
      label: `${isFollowing ? "Turn off notifications" : "Get notifications"}`,
      action: "notifications",
      color: Colors.textPrimary,
    },
    {
      icon: "share-outline",
      label: "Share profile",
      action: "share_profile",
      color: Colors.textPrimary,
    },
    {
      icon: "person-remove-outline",
      label: `${isFollowing ? "Unfollow" : "Follow"}`,
      action: "toggle_follow",
      color: Colors.textPrimary,
    },
    {
      icon: "alert-circle-outline",
      label: "Report user",
      action: "report",
      color: Colors.error,
    },
    {
      icon: "ban-outline",
      label: `${isBlocked ? "Unblock user" : "Block user"}`,
      action: "toggle_block",
      color: Colors.error,
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
                <Text style={styles.menuTitle}>Profile Options</Text>
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
                  <Text style={[styles.menuText, { color: option.color }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
    flex: 1,
  },
});

export default OtherUserMenuModal;
