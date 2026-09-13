import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { fetchSummary, classifyTextMobile } from "../../lib/api-client";
import { MobileTweetCard } from "../../components/MobileTweetCard";

export default function MobileHomeScreen() {
  const [summary, setSummary] = useState<any>(null);
  const [testText, setTestText] = useState("");
  const [classification, setClassification] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSummary().then(setSummary);
  }, []);

  const handleClassify = async () => {
    if (!testText.trim()) return;
    setLoading(true);
    const res = await classifyTextMobile(testText);
    setClassification(res);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>PulseAI Overview</Text>
      <Text style={styles.subheading}>Mobile Sentiment Monitoring & NLP</Text>

      {/* Swipeable Summary Stat Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={[styles.statBox, { borderColor: "#3b82f6" }]}>
          <Text style={styles.statLabel}>TOTAL TWEETS</Text>
          <Text style={styles.statVal}>{summary ? summary.total_tweets : "32"}</Text>
          <Text style={styles.statDelta}>+12% vs last week</Text>
        </View>

        <View style={[styles.statBox, { borderColor: "#22c55e" }]}>
          <Text style={styles.statLabel}>POSITIVE</Text>
          <Text style={[styles.statVal, { color: "#22c55e" }]}>
            {summary ? `${summary.percentages.positive}%` : "40.6%"}
          </Text>
          <Text style={styles.statDelta}>Bullish sentiment</Text>
        </View>

        <View style={[styles.statBox, { borderColor: "#ef4444" }]}>
          <Text style={styles.statLabel}>NEGATIVE</Text>
          <Text style={[styles.statVal, { color: "#ef4444" }]}>
            {summary ? `${summary.percentages.negative}%` : "31.3%"}
          </Text>
          <Text style={styles.statDelta}>Complaints & bugs</Text>
        </View>

        <View style={[styles.statBox, { borderColor: "#94a3b8" }]}>
          <Text style={styles.statLabel}>NEUTRAL</Text>
          <Text style={[styles.statVal, { color: "#94a3b8" }]}>
            {summary ? `${summary.percentages.neutral}%` : "28.1%"}
          </Text>
          <Text style={styles.statDelta}>Press & reports</Text>
        </View>
      </ScrollView>

      {/* Quick Classify Widget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instant Tweet Scorer</Text>
        <TextInput
          style={styles.input}
          placeholder="Type any tweet or thought to analyze sentiment..."
          placeholderTextColor="#64748b"
          value={testText}
          onChangeText={setTestText}
          multiline
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleClassify}
          disabled={loading || !testText.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Score Sentiment</Text>
          )}
        </TouchableOpacity>

        {classification && (
          <View style={styles.resultBox}>
            <Text style={styles.resultSentiment}>
              Sentiment: <Text style={{ fontWeight: "bold" }}>{classification.sentiment.toUpperCase()}</Text>
            </Text>
            <Text style={styles.resultConf}>
              Confidence: {(classification.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06090f" },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#f8fafc" },
  subheading: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  statsScroll: { marginBottom: 20 },
  statBox: {
    backgroundColor: "#0d1320",
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
  },
  statLabel: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 0.5 },
  statVal: { fontSize: 24, fontWeight: "bold", color: "#ffffff", marginVertical: 4 },
  statDelta: { fontSize: 10, color: "#94a3b8" },
  section: {
    backgroundColor: "#0d1320",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#f8fafc", marginBottom: 10 },
  input: {
    backgroundColor: "#090d16",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#f8fafc",
    padding: 12,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  resultBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#1e1b4b",
    borderWidth: 1,
    borderColor: "#4338ca",
  },
  resultSentiment: { color: "#a5b4fc", fontSize: 13 },
  resultConf: { color: "#c7d2fe", fontSize: 11, marginTop: 2 },
});
