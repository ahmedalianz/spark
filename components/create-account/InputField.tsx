import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  icon?: string;
  colors: any;
  multiline?: boolean;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  characterCount?: {
    current: number;
    max: number;
  };
  [key: string]: any;
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon,
  colors,
  multiline = false,
  secureTextEntry = false,
  rightIcon,
  characterCount,
  ...props
}: InputFieldProps) => {
  const isOverLimit =
    characterCount && characterCount.current > characterCount.max;

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
        {characterCount && (
          <Text
            style={[
              styles.characterCount,
              { color: colors.textTertiary },
              isOverLimit && { color: colors.error },
            ]}
          >
            {characterCount.current}/{characterCount.max}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: error ? colors.error : colors.border,
          },
          multiline && styles.multilineContainer,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={error ? colors.error : colors.textTertiary}
            style={styles.icon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.textPrimary },
            multiline && styles.multilineInput,
          ]}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
  characterCount: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
    minHeight: 100,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 12,
  },
  multilineInput: {
    paddingVertical: 0,
    minHeight: 76,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
});

export default InputField;
