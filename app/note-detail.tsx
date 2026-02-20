import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pin, PinOff, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  const [content, setContent] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (id) {
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color || NOTE_COLORS[0]);
        setIsPinned(note.pinned || false);
        setIsNew(false);
      }
    }
  }, [id]);

  const saveNote = async () => {
    // Si la nota está vacía, no guardarla al regresar
    if (!title.trim() && !content.trim()) {
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)");
      return;
    }

    const now = Date.now();
    const note: Note = {
      id: id || `note_${now}`,
      title: title.trim(),
      content: content.trim(),
      color,
      pinned: isPinned,
      createdAt: isNew ? now : getNoteById(id!)?.createdAt || now,
      updatedAt: now,
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: color }]}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={saveNote} style={styles.headerButtonLeft}>
            <ChevronLeft size={28} color="#E4AF0A" />
            <Text style={styles.backText}>Notas</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable onPress={handlePinToggle} style={styles.iconButton}>
              {isPinned ? (
                <PinOff size={22} color="#E4AF0A" />
              ) : (
                <Pin size={22} color="#E4AF0A" />
              )}
            </Pressable>
            {!isNew && (
              <Pressable onPress={handleDelete} style={styles.iconButton}>
                <Trash2 size={22} color="#FF3B30" />
              </Pressable>
            )}
            <Pressable onPress={saveNote}>
              <Text style={styles.doneText}>Listo</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.title}
            placeholder="Título"
            placeholderTextColor="#C7C7CC"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
          />
          <TextInput
            style={styles.textArea}
            placeholder="Comienza a escribir..."
            placeholderTextColor="#C7C7CC"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
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
  iconButton: {
    padding: 4,
  },
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
    minHeight: 300,
  },
});
