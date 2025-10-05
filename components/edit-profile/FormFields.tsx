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
  colors,
}: FormFieldsProps) => {
  return (
    <View style={styles.formContainer}>
      {/* Bio Section */}
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Text style={[styles.fieldLabel, { color: colors.black }]}>Bio</Text>
          <Text
            style={[
              styles.characterCount,
              { color: colors.textMuted },
              isOverLimit && [
                styles.overLimitText,
                { color: colors.accentLike },
              ],
            ]}
          >
            {bioCharacterCount}/{maxBioLength}
          </Text>
        </View>
        <View
          style={[
            styles.inputContainer,
            styles.bioContainer,
            {
              backgroundColor: colors.tintBlueLight,
              borderColor: colors.tintBlue,
            },
          ]}
        >
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            placeholderTextColor={colors.textMuted}
            numberOfLines={4}
            multiline
            textAlignVertical="top"
            style={[styles.textInput, styles.bioInput, { color: colors.black }]}
            maxLength={maxBioLength + 20} // Allow some overflow for warning
          />
        </View>
        {isOverLimit && (
          <Text style={[styles.errorText, { color: colors.accentLike }]}>
            Bio exceeds maximum length
          </Text>
        )}
      </View>

      {/* Link Section */}
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.black }]}>
          Website
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.tintBlueLight,
              borderColor: colors.tintBlue,
            },
          ]}
        >
          <View style={styles.inputIcon}>
            <Ionicons name="link-outline" size={20} color={colors.primary} />
          </View>
          <TextInput
            value={link}
            onChangeText={setLink}
            placeholder="https://yourwebsite.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={[
              styles.textInput,
              styles.linkInput,
              { color: colors.black },
            ]}
          />
          {link ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setLink("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textDisabled}
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
    fontFamily: "DMSans_700Bold",
  },
  characterCount: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
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
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
});
