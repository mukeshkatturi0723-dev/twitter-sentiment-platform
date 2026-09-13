import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { fetchTweets } from "../../lib/api-client";
import { MobileTweetCard } from "../../components/MobileTweetCard";

export default function MobileFeedScreen() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTweets = async () => {
    setRefreshing(true);
    const data = await fetchTweets();
    setTweets(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadTweets();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MobileTweetCard tweet={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadTweets}
            tintColor="#818cf8"
            colors={["#818cf8"]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Live Sentiment Stream</Text>
            <Text style={styles.subtitle}>Pull down to refresh latest classified tweets</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#06090f" },
  list: { padding: 14, paddingBottom: 30 },
  header: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "bold", color: "#ffffff" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 2 },
});
