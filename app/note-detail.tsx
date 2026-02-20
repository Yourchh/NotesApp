import { useNotes } from "@/context/NotesContext";
import { Note } from "@/types/notes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const NOTE_COLORS = [
  "#F5F5F5", // Gray
  "#FFF4E6", // Yellow
  "#E8F5E9", // Green
  "#E7F3FF", // Blue
  "#F3E5F5", // Purple
  "#FCE4EC", // Pink
];

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getNoteById, addNote, updateNote, deleteNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [isNew, setIsNew] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color || NOTE_COLORS[0]);
        setIsNew(false);
      }
    }
  }, [id]);

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasChanges(true);
  };

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert(
        "Nota vacía",
        "La nota debe tener al menos un título o contenido",
      );
      return;
    }

    const now = Date.now();
    const note: Note = {
      id: id || `note_${now}`,
      title: title.trim(),
      content: content.trim(),
      color,
      createdAt: isNew ? now : getNoteById(id!)?.createdAt || now,
      updatedAt: now,
    };

    try {
      if (isNew) {
        await addNote(note);
      } else {
        await updateNote(note);
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la nota");
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar nota", "¿Estás seguro?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deleteNote(id!);
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar la nota");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (hasChanges) {
                Alert.alert("Cambios sin guardar", "¿Descartar cambios?", [
                  { text: "Continuar editando", style: "cancel" },
                  {
                    text: "Descartar",
                    onPress: () => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.replace("/(tabs)");
                      }
                    },
                    style: "destructive",
                  },
                ]);
              } else {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)");
                }
              }
            }}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <ChevronLeft size={28} color="#007AFF" />
          </Pressable>

          <View style={styles.headerActions}>
            {!isNew && (
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Trash2 size={24} color="#FF3B30" />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.title}
            placeholder="Título"
            placeholderTextColor="#999"
            value={title}
            onChangeText={handleTitleChange}
            maxLength={100}
            multiline
          />

          <TextInput
            style={styles.textArea}
            placeholder="Comienza a escribir..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        <View style={styles.colorPicker}>
          {NOTE_COLORS.map((noteColor) => (
            <Pressable
              key={noteColor}
              onPress={() => {
                setColor(noteColor);
                setHasChanges(true);
              }}
              style={[
                styles.colorOption,
                { backgroundColor: noteColor },
                color === noteColor && styles.colorSelected,
              ]}
            >
              {color === noteColor && <View style={styles.checkmark} />}
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={saveNote}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 16,
    color: "#000",
    minHeight: 200,
    textAlignVertical: "top",
  },
  colorPicker: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  checkmark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    margin: 16,
    marginBottom: 24,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
