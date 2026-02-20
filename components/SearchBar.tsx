import { useNotes } from "@/context/NotesContext";
import { Search, X } from "lucide-react-native";
import React from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
} from "react-native";

interface SearchBarProps {
  containerStyle?: ViewStyle;
}

export function SearchBar({ containerStyle }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useNotes();

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchBox}>
        <Search size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar notas..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="done"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={8}
            style={styles.clearButton}
          >
            <X size={16} color="#999" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    padding: 4,
  },
});
