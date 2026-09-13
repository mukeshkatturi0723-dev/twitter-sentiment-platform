import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function MobileSettingsScreen() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");

  const handleSave = () => {
    Alert.alert("Settings Updated", `API Base URL configured to: ${apiUrl}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings & Endpoints</Text>
      <Text style={styles.subtitle}>Configure Backend Connection</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Backend API Base URL</Text>
        <TextInput
          style={styles.input}
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder="http://10.0.2.2:8000"
          placeholderTextColor="#64748b"
        />
        <Text style={styles.help}>
          Use 10.0.2.2 for Android Studio emulators or your LAN IP for physical phones.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Configuration</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>System Info</Text>
        <Text style={styles.infoText}>Platform: PulseAI Mobile v1.0.0</Text>
        <Text style={styles.infoText}>Engine: RoBERTa + VADER Hybrid</Text>
        <Text style={styles.infoText}>Status: Connected to Localhost</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06090f", padding: 16 },
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
  label: { fontSize: 13, fontWeight: "bold", color: "#f8fafc", marginBottom: 8 },
  input: {
    backgroundColor: "#090d16",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 6,
  },
  help: { fontSize: 11, color: "#64748b", marginBottom: 14 },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
  infoText: { fontSize: 12, color: "#94a3b8", marginVertical: 3 },
});
