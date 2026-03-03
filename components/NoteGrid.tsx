import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const COLUMN_GAP = 12;
const PADDING = 16;
// Cálculo del ancho exacto para 2 columnas
const ITEM_WIDTH = (width - PADDING * 2 - COLUMN_GAP) / 2;
const APPLE_NOTES_YELLOW = "#E4AF0A";

interface NoteGridProps {
  columns: number;
}

export const NoteGrid = ({ columns }: NoteGridProps) => {
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

  const openQuickActions = (item: Note) => {
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

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Note>) => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        runOnJS(togglePin)(item.id);
      });

    return (
      <ScaleDecorator>
        <GestureDetector gesture={doubleTap}>
          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => openQuickActions(item)}
            onPressIn={drag}
            disabled={isActive}
            style={[styles.gridItem, isActive && styles.gridItemActive]}
            onPress={() =>
              router.push({ pathname: "/note-detail", params: { id: item.id } })
            }
          >
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title || "Nueva nota"}
              </Text>
              {item.pinned && (
                <Star
                  size={14}
                  color={APPLE_NOTES_YELLOW}
                  fill={APPLE_NOTES_YELLOW}
                />
              )}
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.previewText} numberOfLines={4}>
                {item.content || "Sin texto adicional"}
              </Text>
            </View>

            <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
          </TouchableOpacity>
        </GestureDetector>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <DraggableFlatList
        key={`grid-${columns}`}
        data={filteredNotes}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => updateNotesOrder(data)}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listPadding: {
    padding: PADDING,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "flex-start", // Alinea a la izquierda para evitar saltos
    gap: COLUMN_GAP,
    marginBottom: COLUMN_GAP,
  },
  gridItem: {
    width: ITEM_WIDTH, // Ancho consistente calculado
    height: 160, // Altura fija para evitar tamaños desiguales
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
  gridItemActive: {
    backgroundColor: "#F2F2F7",
    elevation: 8,
    zIndex: 99,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    height: 20, // Altura fija para el área del título
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 4,
  },
  contentContainer: {
    flex: 1, // Toma el espacio central sobrante
  },
  previewText: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  date: {
    fontSize: 11,
    color: "#C7C7CC",
    marginTop: 4,
    fontWeight: "500",
  },
});
