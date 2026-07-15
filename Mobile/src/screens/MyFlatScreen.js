import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, Card, Button, Input } from "../components/UI";
import { colors, fonts, spacing, radius } from "../theme/theme";

const OPTIONS = [
  { key: "none", label: "Not listed", icon: "lock-closed-outline" },
  { key: "rent", label: "For rent", icon: "key-outline" },
  { key: "sale", label: "For sale", icon: "pricetag-outline" },
];

export default function MyFlatScreen() {
  const { user } = useAuth();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("none");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    const f = await api.getMyFlat(user.id);
    setFlat(f);
    setStatus(f?.listingStatus || "none");
    setDetails(f?.details || "");
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [user.id])
  );

  const onSave = async () => {
    if (!flat) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.updateMyFlat(flat.id, { listingStatus: status, details: status === "none" ? "" : details });
      setFlat(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cloud, justifyContent: "center" }}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <ScreenHeader eyebrow="Your listing" title="My flat" />

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={styles.number}>{flat?.number}</Text>
        <Text style={styles.owner}>{flat?.ownerName}</Text>
        <Text style={styles.phone}>{flat?.phone}</Text>
      </Card>

      <Text style={styles.sectionLabel}>Rent or sell?</Text>
      <View style={styles.optionsRow}>
        {OPTIONS.map((opt) => {
          const active = status === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setStatus(opt.key)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Ionicons name={opt.icon} size={18} color={active ? "#fff" : colors.brand} />
              <Text style={[styles.optionText, active && { color: "#fff" }]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {status !== "none" && (
        <Input
          label="Details for other owners"
          placeholder="e.g. 2BHK, semi-furnished, available from next month"
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
          style={{ height: 90, textAlignVertical: "top" }}
        />
      )}

      {saved ? <Text style={styles.savedText}>Saved. Other owners can now see this.</Text> : null}

      <Button title={saving ? "Saving..." : "Save changes"} onPress={onSave} disabled={saving} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  number: { fontFamily: fonts.plate, fontSize: 20, color: colors.ink },
  owner: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink, marginTop: 6 },
  phone: { fontFamily: fonts.body, fontSize: 13, color: colors.slateLight, marginTop: 2 },
  sectionLabel: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.slate, marginBottom: 10 },
  optionsRow: { flexDirection: "row", gap: 10, marginBottom: spacing.lg },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  optionActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  optionText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.ink },
  savedText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.sage, marginTop: 10, textAlign: "center" },
});
