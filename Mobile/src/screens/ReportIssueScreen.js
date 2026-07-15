import React, { useCallback, useState } from "react";
import { View, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, Card, Button, Input, EmptyState } from "../components/UI";
import { IssueCard } from "../components/Cards";
import { colors, spacing } from "../theme/theme";

export default function ReportIssueScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [flat, setFlat] = useState(null);

  const load = async () => {
    const f = await api.getMyFlat(user.id);
    setFlat(f);
    const list = await api.getMyIssues(f.id);
    setIssues(list);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [user.id])
  );

  const onSubmit = async () => {
    if (!title || !description || !flat) return;
    setSending(true);
    try {
      await api.reportIssue({
        flatId: flat.id,
        flatNumber: flat.number,
        raisedBy: user.name,
        title,
        description,
      });
      setTitle("");
      setDescription("");
      await load();
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <ScreenHeader eyebrow="Maintenance" title="Report an issue" />

      <Card style={{ marginBottom: spacing.lg }}>
        <Input label="What's the issue?" placeholder="e.g. Leaking tap" value={title} onChangeText={setTitle} />
        <Input
          label="Describe it"
          placeholder="Add a bit of detail so the admin can act on it"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 90, textAlignVertical: "top" }}
        />
        <Button title={sending ? "Sending..." : "Report to admin"} onPress={onSubmit} disabled={sending} />
      </Card>

      <ScreenHeader eyebrow="History" title="Your reports" />
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : issues.length === 0 ? (
        <EmptyState title="No reports yet" subtitle="Issues you report will appear here." />
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <IssueCard
              flatNumber={item.flatNumber}
              raisedBy={item.raisedBy}
              title={item.title}
              description={item.description}
              status={item.status}
              createdAt={item.createdAt}
            />
          )}
        />
      )}
      </ScrollView>
    </SafeAreaView>
  );
}
