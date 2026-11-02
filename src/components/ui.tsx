import Feather from "@expo/vector-icons/Feather";
import React, { ComponentProps } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors as c } from "../lib/theme";

export type IconName = ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 21,
  color = c.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Feather accessible={false} name={name} size={size} color={color} />;
}
export function Button({
  children,
  onPress,
  secondary,
  disabled,
  icon = "arrow-up-right",
}: {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={children}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: c.ink }]}>
        {children}
      </Text>
      <Icon name={icon} size={18} color={secondary ? c.ink : c.white} />
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  multiline,
  placeholder,
  keyboardType,
  maxLength = 100,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  maxLength?: number;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          styles.input,
          multiline && { minHeight: 120, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export function Sheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text accessibilityRole="header" style={styles.modalTitle}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Закрыть окно"
              onPress={onClose}
              hitSlop={12}
              style={styles.close}
            >
              <Icon name="x" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalContent}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <View
      accessibilityRole={error ? "alert" : undefined}
      style={[styles.notice, error && { backgroundColor: "#FBE9EC" }]}
    >
      <Icon
        name={error ? "alert-circle" : "info"}
        size={17}
        color={error ? c.red : c.purple}
      />
      <Text style={[styles.noticeText, error && { color: c.red }]}>
        {children}
      </Text>
    </View>
  );
}
export function Empty({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={27} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{description}</Text>
    </View>
  );
}
export const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    backgroundColor: c.ink,
    borderRadius: 30,
    paddingHorizontal: 23,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    alignSelf: "flex-start",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: c.ink,
  },
  buttonText: { fontSize: 14, fontWeight: "700", color: c.white },
  field: { gap: 9, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: c.ink },
  input: {
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.cream,
    borderRadius: 12,
    padding: 15,
    color: c.ink,
    fontSize: 16,
    minHeight: 50,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "#21102B99",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    maxWidth: 560,
    width: "100%",
    maxHeight: "90%",
    backgroundColor: c.white,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 24,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalTitle: { fontSize: 23, fontWeight: "700", color: c.ink, flex: 1 },
  close: { backgroundColor: c.cream, padding: 9, borderRadius: 30 },
  modalContent: { padding: 24, paddingTop: 4, gap: 16 },
  notice: {
    backgroundColor: c.lavender,
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noticeText: { color: c.purple, fontSize: 13, lineHeight: 20, flex: 1 },
  empty: {
    alignItems: "center",
    paddingVertical: 45,
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: c.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    color: c.ink,
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
  },
  emptyText: {
    color: c.muted,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 360,
    fontSize: 14,
  },
});
