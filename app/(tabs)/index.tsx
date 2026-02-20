import { NoteGrid } from "@/components/NoteGrid";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "expo-router";
import { LayoutGrid, List, SquarePen } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewMode = "list" | "grid-2";

const APPLE_NOTES_YELLOW = "#E4AF0A";

export default function NotesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { filteredNotes } = useNotes();

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid-2" : "list");
  };

  const getViewIcon = () => {
    if (viewMode === "list")
      return <LayoutGrid size={22} color={APPLE_NOTES_YELLOW} />;
    return <List size={22} color={APPLE_NOTES_YELLOW} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.largeTitle}>Notas</Text>
          <Pressable onPress={toggleViewMode} style={styles.viewToggle}>
            {getViewIcon()}
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        <View style={styles.content}>
          {viewMode === "list" ? <NoteList /> : <NoteGrid columns={2} />}
        </View>

        {/* Bottom Toolbar iOS Style */}
        <SafeAreaView edges={["bottom"]} style={styles.bottomSafeArea}>
          <View style={styles.bottomToolbar}>
            <View style={styles.toolbarSpacer} />
            <Text style={styles.noteCount}>{filteredNotes.length} notas</Text>
            <Pressable
              style={styles.composeButton}
              onPress={() => router.push("/note-detail")}
            >
              <SquarePen
                size={28}
                color={APPLE_NOTES_YELLOW}
                strokeWidth={1.5}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5, // Toque tipográfico de iOS
  },
  viewToggle: { padding: 4 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  content: { flex: 1 },
  bottomSafeArea: {
    backgroundColor: "#F8F8F8",
  },
  bottomToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.2)",
  },
  toolbarSpacer: { width: 30 },
  noteCount: {
    fontSize: 12,
    color: "#000",
    fontWeight: "400",
  },
  composeButton: { padding: 4 },
});
