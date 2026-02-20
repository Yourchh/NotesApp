import { StyleSheet } from "react-native";

// Colores principales
export const COLORS = {
  primary: "#007AFF", // System Blue iOS
  danger: "#FF3B30", // System Red iOS
  background: "#FFFFFF",
  lightGray: "#F2F2F7", // iOS System Grouped Background
  mediumGray: "#E5E5EA", // iOS Separator
  darkGray: "#8E8E93", // iOS Secondary Text
  darkText: "#000000",
  secondaryText: "#3C3C43",
  tertiaryText: "#C7C7CC", // iOS Placeholder Text
};
// Estilos globales
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGray,
  },
  card: {
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    padding: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.darkText,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.mediumGray,
  },
});
