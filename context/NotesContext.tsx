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

  // Load notes on mount
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
    await storageService.saveNote(note);
    setNotes((prev) => [note, ...prev]);
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
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n,
    );
    setNotes(updatedNotes);
  };

  const getNoteById = (id: string) => notes.find((n) => n.id === id);

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // Sort: pinned first, then by date
  const sortedAndFilteredNotes = filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const value: NotesContextType = {
    notes,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
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
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
}
