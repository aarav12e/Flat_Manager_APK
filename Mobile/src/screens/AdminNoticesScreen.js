import React, { useCallback, useState } from "react";
import { View, ScrollView, FlatList, Text, StyleSheet, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as api from "../services/api";
import { ScreenHeader, Card, Button, Input, EmptyState, CardSkeleton } from "../components/UI";
import { NoticeCard } from "../components/Cards";
import { colors, fonts, spacing } from "../theme/theme";

export default function AdminNoticesScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.getAllNotices().then(setNotices);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLoading(false);
      });
    }, [])
  );

  const onSend = async () => {
    if (!title || !body) return;
    setSending(true);
    try {
      await api.sendNotice({ title, body, audience: "all" });
      setTitle("");
      setBody("");
      await load();
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <ScreenHeader eyebrow="Broadcast" title="Send a notice" />
      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={styles.helper}>This goes out to every flat in the society.</Text>
        <Input label="Title" placeholder="e.g. Water supply maintenance" value={title} onChangeText={setTitle} />
        <Input
          label="Message"
          placeholder="Details for members..."
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          style={{ height: 90, textAlignVertical: "top" }}
        />
        <Button title={sending ? "Sending..." : "Send to everyone"} onPress={onSend} disabled={sending} />
      </Card>

      <ScreenHeader eyebrow="History" title="All notices" />
      {loading ? (
        <View style={{ flex: 1 }}>
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : notices.length === 0 ? (
        <EmptyState title="No notices sent yet" />
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(n) => n.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <NoticeCard
              title={item.title}
              body={item.body}
              createdAt={item.createdAt}
              targeted={item.audience !== "all"}
            />
          )}
        />
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  helper: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginBottom: spacing.md, lineHeight: 18 },
});
