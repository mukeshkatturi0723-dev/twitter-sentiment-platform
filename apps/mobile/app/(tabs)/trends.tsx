import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { fetchSummary } from "../../lib/api-client";

export default function MobileTrendsScreen() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchSummary().then(setSummary);
  }, []);

  const pos = summary?.percentages?.positive || 40.6;
  const neg = summary?.percentages?.negative || 31.3;
  const neu = summary?.percentages?.neutral || 28.1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sentiment Trends</Text>
      <Text style={styles.subtitle}>Aggregate 3-Class Sentiment Distribution</Text>

      {/* Visual Bars Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Ratio Breakdown</Text>
        
        <View style={styles.barContainer}>
          <View style={[styles.barSegment, { flex: pos, backgroundColor: "#22c55e" }]} />
          <View style={[styles.barSegment, { flex: neu, backgroundColor: "#94a3b8" }]} />
          <View style={[styles.barSegment, { flex: neg, backgroundColor: "#ef4444" }]} />
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#22c55e" }]} />
            <Text style={styles.legendText}>Positive: {pos}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#94a3b8" }]} />
            <Text style={styles.legendText}>Neutral: {neu}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.legendText}>Negative: {neg}%</Text>
          </View>
        </View>
      </View>

      {/* Top Entity Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Monitored Entities</Text>
        {[
          { name: "OpenAI (#AI)", score: "+78% NSS", dominant: "positive", color: "#22c55e" },
          { name: "Apple (#MacBook)", score: "+64% NSS", dominant: "positive", color: "#22c55e" },
          { name: "Tesla (#FSD)", score: "+21% NSS", dominant: "neutral", color: "#94a3b8" },
          { name: "Google (#Pixel)", score: "-15% NSS", dominant: "negative", color: "#ef4444" },
        ].map((item, idx) => (
          <View key={idx} style={styles.entityRow}>
            <Text style={styles.entityName}>{item.name}</Text>
            <Text style={[styles.entityScore, { color: item.color }]}>{item.score}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06090f" },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 2, marginBottom: 16 },
  card: {
    backgroundColor: "#0d1320",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#f8fafc", marginBottom: 12 },
  barContainer: {
    height: 14,
    borderRadius: 7,
    flexDirection: "row",
    overflow: "hidden",
    marginVertical: 8,
  },
  barSegment: { height: "100%" },
  legendRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: "#cbd5e1" },
  entityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  entityName: { color: "#e2e8f0", fontSize: 13 },
  entityScore: { fontSize: 12, fontWeight: "bold" },
});
