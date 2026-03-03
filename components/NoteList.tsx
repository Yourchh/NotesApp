// components/NoteList.tsx
import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useRouter } from "expo-router";
import { Star, Trash2 } from "lucide-react-native"; // 1. Cambiado Pin por Star
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const APPLE_NOTES_YELLOW = "#E4AF0A";

export const NoteList = () => {
  const { filteredNotes, deleteNote, togglePin, updateNotesOrder } = useNotes();
  const router = useRouter();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Eliminar nota", "¿Deseas borrar esta nota permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => confirmDelete(id)}
    >
      <Trash2 color="white" size={24} />
    </TouchableOpacity>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Note>) => {
    // GESTO: Double Tap para favoritos
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        runOnJS(togglePin)(item.id);
      });

    // GESTO: Long Press para acciones rápidas
    const openQuickActions = () => {
      Alert.alert(item.title || "Nota", "Acciones rápidas", [
        {
          text: item.pinned ? "Quitar de favoritos" : "Marcar como favorito",
          onPress: () => togglePin(item.id),
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => confirmDelete(item.id),
        },
        { text: "Cancelar", style: "cancel" },
      ]);
    };

    return (
      <ScaleDecorator>
        <Swipeable
          renderRightActions={() => renderRightActions(item.id)}
          onSwipeableOpen={(direction) => {
            if (direction === "right") runOnJS(deleteNote)(item.id); // Swipe total para borrar
          }}
          rightThreshold={140}
        >
          <GestureDetector gesture={doubleTap}>
            <TouchableOpacity
              activeOpacity={0.7}
              onLongPress={openQuickActions} // Acciones rápidas
              onPressIn={drag} // Drag & Drop
              onPress={() =>
                router.push({
                  pathname: "/note-detail",
                  params: { id: item.id },
                })
              }
              style={[styles.noteItem, isActive && styles.noteItemActive]}
            >
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title || "Nueva nota"}
                </Text>
                {/* 2. Reemplazado Pin por Star */}
                {item.pinned && (
                  <Star
                    size={16}
                    color={APPLE_NOTES_YELLOW}
                    fill={APPLE_NOTES_YELLOW}
                  />
                )}
              </View>
              <View style={styles.previewContainer}>
                <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
                <Text style={styles.previewText} numberOfLines={1}>
                  {item.content || "Sin texto adicional"}
                </Text>
              </View>
              <View style={styles.separator} />
            </TouchableOpacity>
          </GestureDetector>
        </Swipeable>
      </ScaleDecorator>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.listBackground}>
          <DraggableFlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ data }) => updateNotesOrder(data)} // Sincroniza orden
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16, flex: 1 },
  listBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  noteItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  noteItemActive: { backgroundColor: "#F2F2F7", elevation: 5 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#000000", flex: 1 },
  previewContainer: { flexDirection: "row", alignItems: "center" },
  date: { fontSize: 14, color: "#8E8E93", marginRight: 8 },
  previewText: { fontSize: 14, color: "#8E8E93", flex: 1 },
  deleteAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 16,
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
  emptyText: { fontSize: 16, color: "#8E8E93" },
});
