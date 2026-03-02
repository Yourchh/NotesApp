import { ZoomableImage } from "@/components/ZoomableImage";
import { useNotes } from "@/context/NotesContext";
import { ContentBlock, ImageBlock, Note, TextBlock } from "@/types/notes";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Image as ImageIcon,
  Star, // Cambiado Pin y PinOff por Star
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity as RNTouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOTE_COLORS = [
  "#FFFFFF",
  "#FFF4E6",
  "#E8F5E9",
  "#E7F3FF",
  "#F3E5F5",
  "#FCE4EC",
];

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getNoteById, addNote, updateNote, deleteNote, togglePin } =
    useNotes();

  const [title, setTitle] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const [richContent, setRichContent] = useState<ContentBlock[]>([
    { type: "text", id: `initial_block`, value: "" },
  ]);

  const [focusedTextBlockId, setFocusedTextBlockId] = useState<string | null>(
    null,
  );
  const [cursorSelection, setCursorSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (id) {
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title);
        setColor(note.color || NOTE_COLORS[0]);
        setIsPinned(note.pinned || false);
        setIsNew(false);

        if (note.richContent && note.richContent.length > 0) {
          setRichContent(note.richContent);
        } else {
          const initialBlocks: ContentBlock[] = [];
          if (note.content) {
            initialBlocks.push({
              type: "text",
              id: `migrated_content`,
              value: note.content,
            });
          }
          if (note.imageUris && note.imageUris.length > 0) {
            note.imageUris.forEach((uri: string, idx: number) => {
              initialBlocks.push({
                type: "image",
                id: `migrated_img_${idx}`,
                uri,
              });
            });
          }
          if (initialBlocks.length === 0) {
            initialBlocks.push({
              type: "text",
              id: `migrated_empty`,
              value: "",
            });
          }
          setRichContent(initialBlocks);
        }
      }
    }
  }, [id, getNoteById]);

  const saveNote = async () => {
    const isRichContentTextEmpty = richContent
      .filter((block) => block.type === "text")
      .every((block) => (block as TextBlock).value.trim() === "");
    const isRichContentImagesEmpty =
      richContent.filter((block) => block.type === "image").length === 0;

    if (!title.trim() && isRichContentTextEmpty && isRichContentImagesEmpty) {
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)");
      return;
    }

    const previewText = richContent
      .filter((block) => block.type === "text")
      .map((block) => (block as TextBlock).value)
      .join("\n")
      .trim();

    const now = Date.now();
    const existingNote = id ? getNoteById(id) : null;

    const note: Note = {
      id: id || `note_${now}`,
      title: title.trim(),
      content: previewText,
      richContent,
      createdAt: isNew ? now : existingNote?.createdAt || now,
      updatedAt: now,
      color,
      pinned: isPinned,
      order: existingNote?.order ?? 0,
    };

    if (isNew) await addNote(note);
    else await updateNote(note);

    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  const handlePinToggle = async () => {
    setIsPinned(!isPinned);
    if (!isNew && id) {
      await togglePin(id);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar nota", "¿Estás seguro de que deseas eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          if (id) await deleteNote(id);
          router.back();
        },
      },
    ]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImageBlocks: ImageBlock[] = result.assets.map((asset, idx) => ({
        type: "image",
        id: `img_${Date.now()}_${idx}`,
        uri: asset.uri,
      }));

      insertImagesAtCursor(newImageBlocks);
    }
  };

  const insertImagesAtCursor = (newImageBlocks: ImageBlock[]) => {
    if (!focusedTextBlockId) {
      setRichContent((prev) => [
        ...prev,
        ...newImageBlocks,
        { type: "text", id: `text_${Date.now()}`, value: "" },
      ]);
      return;
    }

    const currentBlocks = [...richContent];
    const focusedBlockIndex = currentBlocks.findIndex(
      (block) => block.id === focusedTextBlockId,
    );

    if (
      focusedBlockIndex === -1 ||
      currentBlocks[focusedBlockIndex].type !== "text"
    ) {
      setRichContent((prev) => [
        ...prev,
        ...newImageBlocks,
        { type: "text", id: `text_${Date.now()}`, value: "" },
      ]);
      return;
    }

    const focusedTextBlock = currentBlocks[focusedBlockIndex] as TextBlock;
    const currentText = focusedTextBlock.value;
    const textBefore = currentText.substring(0, cursorSelection.start);
    const textAfter = currentText.substring(cursorSelection.start);

    const replacementBlocks: ContentBlock[] = [];
    replacementBlocks.push({
      type: "text",
      id: focusedTextBlock.id,
      value: textBefore,
    });
    newImageBlocks.forEach((img) => replacementBlocks.push(img));
    replacementBlocks.push({
      type: "text",
      id: `text_after_${Date.now()}`,
      value: textAfter,
    });

    currentBlocks.splice(focusedBlockIndex, 1, ...replacementBlocks);

    setRichContent(currentBlocks);
    setFocusedTextBlockId(null);
    setCursorSelection({ start: 0, end: 0 });
  };

  const removeImageBlock = (idToRemove: string) => {
    Alert.alert("Quitar foto", "¿Deseas quitar esta imagen de la nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Quitar",
        style: "destructive",
        onPress: () => {
          setRichContent((prev) =>
            prev.filter((block) => block.id !== idToRemove),
          );
          setSelectedImageId(null);
        },
      },
    ]);
  };

  const updateTextBlockValue = (id: string, newValue: string) => {
    setRichContent((prev) =>
      prev.map((block) =>
        block.type === "text" && block.id === id
          ? { ...block, value: newValue }
          : block,
      ),
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: color }]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <RNTouchableOpacity
            onPress={saveNote}
            style={styles.headerButtonLeft}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              pointerEvents="none"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <ChevronLeft size={28} color="#E4AF0A" />
              <Text style={styles.backText}>Notas</Text>
            </View>
          </RNTouchableOpacity>

          <View style={styles.headerActions}>
            <RNTouchableOpacity
              onPress={pickImage}
              style={styles.iconButton}
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            >
              <View pointerEvents="none">
                <ImageIcon size={22} color="#E4AF0A" />
              </View>
            </RNTouchableOpacity>

            <RNTouchableOpacity
              onPress={handlePinToggle}
              style={styles.iconButton}
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            >
              <View pointerEvents="none">
                {/* Se ha reemplazado Pin/PinOff por un único icono Star con relleno condicional */}
                <Star
                  size={24}
                  color="#E4AF0A"
                  fill={isPinned ? "#E4AF0A" : "transparent"}
                />
              </View>
            </RNTouchableOpacity>

            {!isNew && (
              <RNTouchableOpacity
                onPress={handleDelete}
                style={styles.iconButton}
                hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              >
                <View pointerEvents="none">
                  <Trash2 size={22} color="#FF3B30" />
                </View>
              </RNTouchableOpacity>
            )}
            <RNTouchableOpacity
              onPress={saveNote}
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            >
              <Text style={styles.doneText}>Listo</Text>
            </RNTouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={{ paddingBottom: 50 }}
          onScrollBeginDrag={() => setSelectedImageId(null)}
        >
          <TextInput
            style={styles.title}
            placeholder="Título"
            placeholderTextColor="#C7C7CC"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
            onFocus={() => setSelectedImageId(null)}
          />

          {richContent.map((block) => {
            if (block.type === "text") {
              return (
                <TextInput
                  key={block.id}
                  style={styles.textArea}
                  placeholder="Comienza a escribir..."
                  placeholderTextColor="#C7C7CC"
                  value={block.value}
                  onChangeText={(newValue) =>
                    updateTextBlockValue(block.id, newValue)
                  }
                  multiline
                  textAlignVertical="top"
                  onFocus={() => {
                    setFocusedTextBlockId(block.id);
                    setSelectedImageId(null);
                  }}
                  onSelectionChange={(event) =>
                    setCursorSelection(event.nativeEvent.selection)
                  }
                  scrollEnabled={false}
                />
              );
            } else if (block.type === "image") {
              const isSelected = selectedImageId === block.id;
              return (
                <View key={block.id} style={styles.imageWrapper}>
                  <Pressable
                    onPress={() =>
                      setSelectedImageId(isSelected ? null : block.id)
                    }
                  >
                    <ZoomableImage uri={block.uri} />
                  </Pressable>

                  {isSelected && (
                    <RNTouchableOpacity
                      style={styles.deleteImageBtn}
                      onPress={() => removeImageBlock(block.id)}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                      <View pointerEvents="none">
                        <X size={16} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    </RNTouchableOpacity>
                  )}
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    zIndex: 100,
  },
  headerButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    color: "#E4AF0A",
    marginLeft: -4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingRight: 8,
  },
  iconButton: { padding: 4 },
  doneText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#E4AF0A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  textArea: {
    fontSize: 17,
    lineHeight: 24,
    color: "#000",
    marginVertical: 0,
    paddingVertical: 2,
  },
  imageWrapper: {
    position: "relative",
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  deleteImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 17,
    zIndex: 9999,
    elevation: 11,
  },
});
