import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { fetchTweets } from "../../lib/api-client";
import { MobileTweetCard } from "../../components/MobileTweetCard";

export default function MobileSearchScreen() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [tweets, setTweets] = useState<any[]>([]);

  useEffect(() => {
    fetchTweets(filter !== "all" ? filter : undefined).then(setTweets);
  }, [filter]);

  const filtered = tweets.filter((t) =>
    query ? t.text.toLowerCase().includes(query.toLowerCase()) || t.author.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tweets, brands, or users..."
          placeholderTextColor="#64748b"
          value={query}
          onChangeText={setQuery}
        />

        {/* Filter chips */}
        <View style={styles.chipRow}>
          {["all", "positive", "negative", "neutral"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MobileTweetCard tweet={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06090f" },
  searchHeader: { padding: 14, backgroundColor: "#090d16", borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  searchInput: {
    backgroundColor: "#0d1320",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  chipRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0d1320",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  chipActive: { backgroundColor: "#4f46e5", borderColor: "#6366f1" },
  chipText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },
  list: { padding: 14, paddingBottom: 30 },
});
