import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export const NoteList = () => {
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

  const renderItem = ({ item, index }: { item: Note; index: number }) => {
    const isLast = index === filteredNotes.length - 1;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.noteItem,
          pressed && styles.noteItemPressed,
        ]}
        onPress={() =>
          router.push({ pathname: "/note-detail", params: { id: item.id } })
        }
      >
        <Text style={styles.title} numberOfLines={1}>
          {item.title || "Nueva nota"}
        </Text>
        <View style={styles.previewContainer}>
          <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
          <Text style={styles.previewText} numberOfLines={1}>
            {item.content || "Sin texto adicional"}
          </Text>
        </View>
        {!isLast && <View style={styles.separator} />}
      </Pressable>
    );
  };

  if (filteredNotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay notas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listBackground}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  listBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  noteItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
  },
  noteItemPressed: {
    backgroundColor: "#E5E5EA",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "#8E8E93",
    marginRight: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#8E8E93",
    flex: 1,
  },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 16, // El separador de iOS no toca el borde izquierdo
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
  },
});
