import { NoteGrid } from "@/components/NoteGrid";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "expo-router";
import { Grid3x3, List, Plus, Square, LayoutGrid } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ViewMode = "list" | "grid-2" | "grid-3";

export default function NotesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid-2");
  const [refreshing, setRefreshing] = useState(false);
  const { refreshNotes } = useNotes();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshNotes();
    setRefreshing(false);
  }, []);

  const toggleViewMode = () => {
    if (viewMode === "list") {
      setViewMode("grid-2");
    } else if (viewMode === "grid-2") {
      setViewMode("grid-3");
    } else {
      setViewMode("list");
    }
  };

  const getViewIcon = () => {
    if (viewMode === "list") {
      return <Grid3x3 size={22} color="#007AFF" strokeWidth={2} />;
    } else if (viewMode === "grid-2") {
      return <LayoutGrid size={22} color="#007AFF" strokeWidth={2} />;
    } else {
      return <List size={22} color="#007AFF" strokeWidth={2} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <Pressable
            onPress={toggleViewMode}
            style={({ pressed }) => [
              styles.viewToggle,
              pressed && { backgroundColor: "#F2F2F7" },
            ]}
          >
            {getViewIcon()}
          </Pressable>
        </View>
        <SearchBar />
      </View>

      <View style={styles.content}>
        {viewMode === "list" ? (
          <NoteList />
        ) : (
          <NoteGrid columns={viewMode === "grid-2" ? 2 : 3} />
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={() => router.push("/note-detail")}
      >
        <View style={styles.fabInner}>
          <Square size={20} color="#007AFF" strokeWidth={2.5} />
          <Plus
            size={20}
            color="#007AFF"
            strokeWidth={2.5}
            style={styles.plusIcon}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 9999,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  fabInner: {
    position: "relative",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    position: "absolute",
  },
});
