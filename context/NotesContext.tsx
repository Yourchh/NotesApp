// context/NotesContext.tsx
import { storageService } from "@/services/storageService";
import { Note } from "@/types/notes";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NotesContextType {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  updateNotesOrder: (newNotes: Note[]) => Promise<void>; // <-- Nueva función
  getNoteById: (id: string) => Note | undefined;
  filteredNotes: Note[];
  isLoading: boolean;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const loadedNotes = await storageService.getNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (note: Note) => {
    // Asignamos un orden inicial (al principio)
    const newOrder =
      notes.length > 0 ? Math.min(...notes.map((n) => n.order)) - 1 : 0;
    const noteWithOrder = { ...note, order: newOrder };
    await storageService.saveNote(noteWithOrder);
    setNotes((prev) => [noteWithOrder, ...prev]);
  };

  const updateNote = async (note: Note) => {
    await storageService.saveNote(note);
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  };

  const deleteNote = async (id: string) => {
    await storageService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = async (id: string) => {
    await storageService.togglePin(id);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  };

  // Función para guardar el nuevo orden tras el Drag & Drop
  const updateNotesOrder = async (newNotes: Note[]) => {
    const updatedWithOrder = newNotes.map((note, index) => ({
      ...note,
      order: index,
    }));
    setNotes(updatedWithOrder);
    // Aquí podrías persistir el array completo si tu storageService lo permite
  };

  const getNoteById = (id: string) => notes.find((n) => n.id === id);

  // Lógica de ordenamiento corregida
  const sortedAndFilteredNotes = notes
    .filter((note) => {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.order || 0) - (b.order || 0); // Orden manual
    });

  const value = {
    notes,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    updateNotesOrder,
    getNoteById,
    filteredNotes: sortedAndFilteredNotes,
    isLoading,
    refreshNotes: loadNotes,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
}
