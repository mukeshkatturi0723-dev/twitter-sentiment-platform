import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MobileTweetCardProps {
  tweet: {
    author: string;
    text: string;
    sentiment: string;
    confidence: number;
    created_at?: string;
  };
}

export const MobileTweetCard: React.FC<MobileTweetCardProps> = ({ tweet }) => {
  const norm = (tweet.sentiment || "neutral").toLowerCase();

  const sentimentColors = {
    positive: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e", border: "rgba(34, 197, 94, 0.3)" },
    negative: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
    neutral: { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" }
  }[norm] || { bg: "rgba(99, 102, 241, 0.15)", text: "#818cf8", border: "rgba(99, 102, 241, 0.3)" };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{tweet.author?.charAt(0).toUpperCase() || "U"}</Text>
          </View>
          <Text style={styles.author}>@{tweet.author}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: sentimentColors.bg, borderColor: sentimentColors.border }]}>
          <Text style={[styles.badgeText, { color: sentimentColors.text }]}>
            {norm.toUpperCase()} {(tweet.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      <Text style={styles.text}>{tweet.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0d1320",
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  author: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  text: {
    color: "#e2e8f0",
    fontSize: 13,
    lineHeight: 19,
  },
});
