import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { Link } from "expo-router";
import { Pin, PinOff, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface NoteGridProps {
  columns?: 2 | 3;
}

const ITEM_SPACING = 8;

export function NoteGrid({ columns = 2 }: NoteGridProps) {
  const { filteredNotes, deleteNote, togglePin } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const GRID_COLUMNS = columns;
  const screenWidth = Dimensions.get("window").width;
  const ITEM_WIDTH =
    (screenWidth - 32 - ITEM_SPACING * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

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
          style={[
            styles.noteCard,
            {
              width: ITEM_WIDTH,
              height: columns === 3 ? 180 : 200,
              backgroundColor: item.color || "#F5F5F5",
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? "#007AFF" : "transparent",
            },
          ]}
        >
          <View>
            <View style={styles.noteHeader}>
              {isSelected && (
                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={(e) => {
                      e.preventDefault();
                      togglePin(item.id);
                    }}
                    hitSlop={8}
                  >
                    {item.pinned ? (
                      <PinOff size={16} color="#007AFF" />
                    ) : (
                      <Pin size={16} color="#007AFF" />
                    )}
                  </Pressable>
                  <Pressable
                    onPress={(e) => {
                      e.preventDefault();
                      handleDelete(item.id);
                    }}
                    hitSlop={8}
                  >
                    <Trash2 size={16} color="#FF3B30" />
                  </Pressable>
                </View>
              )}
            </View>

            <Text style={styles.noteTitle} numberOfLines={2}>
              {item.title || "Sin título"}
            </Text>

            <Text
              style={styles.notePreview}
              numberOfLines={columns === 3 ? 3 : 4}
            >
              {item.content || "Sin contenido"}
            </Text>
          </View>

          <Text style={styles.noteDate}>{date}</Text>
        </Pressable>
      </Link>
    );
  };

  return (
    <FlatList
      data={filteredNotes}
      renderItem={renderNoteItem}
      keyExtractor={(item) => item.id}
      numColumns={GRID_COLUMNS}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      scrollIndicatorInsets={{ right: 1 }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay notas</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
  },
  columnWrapper: {
    gap: ITEM_SPACING,
    marginBottom: ITEM_SPACING,
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    minHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
    height: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
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
