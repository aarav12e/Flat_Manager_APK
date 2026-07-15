import React, { useCallback, useState } from "react";
import { View, FlatList, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity, Text, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as api from "../services/api";
import { ScreenHeader, EmptyState, Button, CardSkeleton } from "../components/UI";
import NameplateCard from "../components/NameplateCard";
import { colors, fonts, spacing, radius } from "../theme/theme";

export default function AdminMembersScreen() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [reminder, setReminder] = useState("");
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState(null);

  const load = () => api.getAllFlats().then(setFlats);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLoading(false);
      });
    }, [])
  );

  const filtered = flats.filter(
    (f) =>
      f.number.toLowerCase().includes(query.toLowerCase()) ||
      f.ownerName.toLowerCase().includes(query.toLowerCase())
  );

  const toggleOpen = (id) => {
    setSentId(null);
    setReminder("");
    setOpenId(openId === id ? null : id);
  };

  const sendReminder = async (flat) => {
    if (!reminder.trim()) return;
    setSending(true);
    try {
      await api.sendNotice({
        title: "Maintenance bill reminder",
        body: reminder.trim(),
        audience: flat.id,
      });
      setSentId(flat.id);
      setReminder("");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud, paddingHorizontal: spacing.lg }} edges={["top", "left", "right"]}>
      <ScreenHeader eyebrow="All members" title="Society directory" />

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={colors.slateLight} />
        <TextInput
          placeholder="Search by flat number or name"
          placeholderTextColor={colors.slateLight}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1 }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => toggleOpen(item.id)}>
              <NameplateCard
                number={item.number}
                ownerName={item.ownerName}
                phone={item.phone}
                listingStatus={item.listingStatus}
                extra={
                  openId === item.id ? (
                    <View style={styles.reminderBox}>
                      <TextInput
                        placeholder="Type reminder (e.g. Please clear A-101 pending maintenance of ₹2,500)"
                        placeholderTextColor={colors.slateLight}
                        value={reminder}
                        onChangeText={setReminder}
                        style={styles.reminderInput}
                        multiline
                      />
                      {sentId === item.id ? (
                        <Text style={styles.sentText}>Reminder sent to {item.number}.</Text>
                      ) : null}
                      <Button
                        title={sending ? "Sending..." : "Send reminder"}
                        onPress={() => sendReminder(item)}
                        disabled={sending}
                        style={{ marginTop: 8, paddingVertical: 10 }}
                      />
                    </View>
                  ) : null
                }
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<EmptyState title="No matches" subtitle="Try a different search." />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    gap: 8,
  },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.ink },
  reminderBox: { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  reminderInput: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: 10,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    minHeight: 50,
    textAlignVertical: "top",
  },
  sentText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.sage, marginTop: 6 },
});
