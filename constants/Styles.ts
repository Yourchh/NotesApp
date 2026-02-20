import { StyleSheet } from "react-native";

// Colores principales
export const COLORS = {
  primary: "#007AFF",
  danger: "#FF3B30",
  background: "#FFFFFF",
  lightGray: "#F5F5F5",
  mediumGray: "#E5E5EA",
  darkGray: "#999999",
  darkText: "#000000",
  secondaryText: "#666666",
  tertiaryText: "#999999",
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
