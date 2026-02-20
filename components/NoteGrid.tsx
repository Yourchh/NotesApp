import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";

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
          { flex: 1 / columns },
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
          {item.content}
        </Text>
        <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      key={`grid-${columns}`}
      data={filteredNotes}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
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
