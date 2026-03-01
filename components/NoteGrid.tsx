import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface NoteGridProps {
  columns: number;
}

export const NoteGrid = ({ columns }: NoteGridProps) => {
  const { filteredNotes } = useNotes();
  const router = useRouter();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const renderItem = ({ item }: { item: Note }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.gridItem,
          pressed && styles.gridItemPressed,
        ]}
        onPress={() =>
          router.push({ pathname: "/note-detail", params: { id: item.id } })
        }
      >
        <Text style={styles.title} numberOfLines={2}>
          {item.title || "Nueva nota"}
        </Text>
        <Text style={styles.previewText} numberOfLines={4}>
          {item.content || "Sin texto adicional"}
        </Text>
        <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        key={`grid-${columns}`}
        data={filteredNotes}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, // Garantiza que la lista tome el espacio disponible
  },
  listPadding: {
    padding: 16,
    paddingBottom: 24, // Espacio extra abajo para que el lápiz no tape la última nota
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1, // Deja que React Native calcule el ancho exacto de las 2 columnas
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
    // Evita que la última nota sola se estire al 100% del ancho
    maxWidth: "48%",
  },
  gridItemPressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    color: "#8E8E93",
    flex: 1,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: "#C7C7CC",
    marginTop: 8,
    fontWeight: "500",
  },
});
