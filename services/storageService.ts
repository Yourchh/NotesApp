import { Note } from "@/types/notes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_KEY = "apple_notes_app";

export const storageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading notes:", error);
      return [];
    }
  },

  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getNotes();
      const existingIndex = notes.findIndex((n) => n.id === note.id);

      if (existingIndex > -1) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }

      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const filtered = notes.filter((n) => n.id !== id);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  async togglePin(id: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const note = notes.find((n) => n.id === id);
      if (note) {
        note.pinned = !note.pinned;
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTES_KEY);
    } catch (error) {
      console.error("Error clearing notes:", error);
      throw error;
    }
  },
};
