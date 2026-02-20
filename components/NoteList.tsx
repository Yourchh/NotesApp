import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { Link } from "expo-router";
import { ChevronRight, Pin, PinOff, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export function NoteList() {
  const { filteredNotes, deleteNote, togglePin } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar nota", "¿Estás seguro?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          await deleteNote(id);
          setSelectedId(null);
        },
        style: "destructive",
      },
    ]);
  };

  const renderNoteItem = ({ item }: { item: Note }) => {
    const isSelected = selectedId === item.id;
    const date = new Date(item.updatedAt).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <Link
        href={{
          pathname: "/note-detail",
          params: { id: item.id },
        }}
        asChild
      >
        <Pressable
          onLongPress={() => setSelectedId(isSelected ? null : item.id)}
          style={[styles.noteItem, isSelected && styles.noteItemSelected]}
        >
          <View style={styles.noteContent}>
            <View style={styles.titleRow}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title || "Sin título"}
              </Text>
              {item.pinned && <Pin size={14} color="#007AFF" />}
            </View>
            <Text style={styles.notePreview} numberOfLines={2}>
              {item.content || "Sin contenido"}
            </Text>
            <Text style={styles.noteDate}>{date}</Text>
          </View>

          {!isSelected && <ChevronRight size={20} color="#999" />}

          {isSelected && (
            <View style={styles.actionButtonsRow}>
              <Pressable
                onPress={(e) => {
                  e.preventDefault();
                  togglePin(item.id);
                }}
                hitSlop={8}
              >
                {item.pinned ? (
                  <PinOff size={18} color="#007AFF" />
                ) : (
                  <Pin size={18} color="#007AFF" />
                )}
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.preventDefault();
                  handleDelete(item.id);
                }}
                hitSlop={8}
              >
                <Trash2 size={18} color="#FF3B30" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </Link>
    );
  };

  return (
    <FlatList
      data={filteredNotes}
      renderItem={renderNoteItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      scrollIndicatorInsets={{ right: 1 }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay notas</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F2F2F7",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  noteItemSelected: {
    backgroundColor: "#E8F4FF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  noteContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  notePreview: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: "#999",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingLeft: 12,
  },
  separator: {
    height: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
