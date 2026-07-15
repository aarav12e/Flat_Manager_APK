import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as api from "../services/api";
import { ScreenHeader, EmptyState, Button, CardSkeleton } from "../components/UI";
import { IssueCard, SuggestionCard } from "../components/Cards";
import { colors, fonts, spacing, radius } from "../theme/theme";

const TABS = [
  { key: "issues", label: "Issues" },
  { key: "suggestions", label: "Suggestions" },
];

export default function AdminReportsScreen() {
  const [tab, setTab] = useState("issues");
  const [issues, setIssues] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () =>
    Promise.all([api.getAllIssues(), api.getAllSuggestions()]).then(([i, s]) => {
      setIssues(i);
      setSuggestions(s);
    });

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLoading(false);
      });
    }, [])
  );

  const resolveIssue = async (id) => {
    setUpdatingId(id);
    try {
      await api.setIssueStatus(id, "resolved");
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud, paddingHorizontal: spacing.lg }} edges={["top", "left", "right"]}>
      <ScreenHeader eyebrow="Reports" title="Issues & Ideas" />

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, tab === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1 }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : tab === "issues" ? (
        <FlatList
          data={issues}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <IssueCard
              flatNumber={item.flatNumber}
              raisedBy={item.raisedBy}
              title={item.title}
              description={item.description}
              status={item.status}
              createdAt={item.createdAt}
              footer={
                item.status === "open" ? (
                  <Button
                    title={updatingId === item.id ? "Updating..." : "Mark resolved"}
                    variant="outline"
                    onPress={() => resolveIssue(item.id)}
                    disabled={updatingId === item.id}
                    style={{ marginTop: 8, paddingVertical: 8, alignSelf: "flex-start", paddingHorizontal: 14 }}
                  />
                ) : null
              }
            />
          )}
          ListEmptyComponent={<EmptyState title="No issues reported" />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <SuggestionCard
              flatNumber={item.flatNumber}
              raisedBy={item.raisedBy}
              message={item.message}
              createdAt={item.createdAt}
            />
          )}
          ListEmptyComponent={<EmptyState title="No suggestions yet" />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: "row", backgroundColor: colors.card, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: 9, borderRadius: radius.sm, alignItems: "center" },
  tabActive: { backgroundColor: colors.brand },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.slate },
  tabTextActive: { color: "#fff" },
});
