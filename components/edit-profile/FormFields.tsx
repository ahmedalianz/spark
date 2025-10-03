import { Colors } from "@/constants/Colors";
import { FormFieldsProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FormFields = ({
  isOverLimit,
  bioCharacterCount,
  maxBioLength,
  bio,
  link,
  setBio,
  setLink,
}: FormFieldsProps) => {
  return (
    <View style={styles.formContainer}>
      {/* Bio Section */}
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <Text
            style={[styles.characterCount, isOverLimit && styles.overLimitText]}
          >
            {bioCharacterCount}/{maxBioLength}
          </Text>
        </View>
        <View style={[styles.inputContainer, styles.bioContainer]}>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            placeholderTextColor={Colors.textMuted}
            numberOfLines={4}
            multiline
            textAlignVertical="top"
            style={[styles.textInput, styles.bioInput]}
            maxLength={maxBioLength + 20} // Allow some overflow for warning
          />
        </View>
        {isOverLimit && (
          <Text style={styles.errorText}>Bio exceeds maximum length</Text>
        )}
      </View>

      {/* Link Section */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Website</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <Ionicons name="link-outline" size={20} color={Colors.primary} />
          </View>
          <TextInput
            value={link}
            onChangeText={setLink}
            placeholder="https://yourwebsite.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={[styles.textInput, styles.linkInput]}
          />
          {link ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setLink("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textDisabled}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default FormFields;

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    fontFamily: "DMSans_700Bold",
  },
  characterCount: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: "DMSans_400Regular",
  },
  overLimitText: {
    color: Colors.accentLike,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.tintBlueLight,
    borderWidth: 2,
    borderColor: Colors.tintBlue,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bioContainer: {
    alignItems: "flex-start",
    minHeight: 100,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontFamily: "DMSans_400Regular",
  },
  bioInput: {
    textAlignVertical: "top",
    minHeight: 76,
  },
  linkInput: {
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.accentLike,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
});
