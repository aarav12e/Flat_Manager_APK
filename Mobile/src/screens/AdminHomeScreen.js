import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, Card } from "../components/UI";
import { colors, fonts, spacing, radius, shadow } from "../theme/theme";

export default function AdminHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([api.getAllFlats(), api.getAllIssues(), api.getAllSuggestions()])
        .then(([flats, issues, suggestions]) => {
          setStats({
            flats: flats.length,
            listed: flats.filter((f) => f.listingStatus !== "none").length,
            openIssues: issues.filter((i) => i.status === "open").length,
            suggestions: suggestions.length,
          });
        })
        .finally(() => setLoading(false));
    }, [])
  );

  const quickActions = [
    { label: "Send a notice", icon: "megaphone-outline", screen: "AdminNotices" },
    { label: "View members", icon: "people-outline", screen: "AdminMembers" },
    { label: "Reported issues", icon: "alert-circle-outline", screen: "AdminReports" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <ScreenHeader eyebrow="Admin dashboard" title={`Hi, ${user.name.split(" ")[0]}`} />

      {loading ? (
        <ActivityIndicator color={colors.ink} style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.statsGrid}>
          <StatCard label="Flats" value={stats.flats} icon="home-outline" tone="brand" />
          <StatCard label="Listed" value={stats.listed} icon="pricetag-outline" tone="brand" />
          <StatCard label="Open issues" value={stats.openIssues} icon="alert-circle-outline" tone="coral" />
          <StatCard label="Suggestions" value={stats.suggestions} icon="bulb-outline" tone="sage" />
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick actions</Text>
      {quickActions.map((a) => (
        <TouchableOpacity key={a.label} style={styles.actionRow} onPress={() => navigation.navigate(a.screen)}>
          <View style={styles.actionIcon}>
            <Ionicons name={a.icon} size={18} color={colors.brand} />
          </View>
          <Text style={styles.actionLabel}>{a.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.slateLight} />
        </TouchableOpacity>
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, tone = "brand" }) {
  const toneMap = {
    brand: { bg: "#EFF6FF", fg: colors.brand, border: "#DBEAFE" },
    coral: { bg: "#FEF2F2", fg: colors.coral, border: "#FEE2E2" },
    sage: { bg: "#ECFDF5", fg: colors.sage, border: "#D1FAE5" },
  };
  const t = toneMap[tone] || toneMap.brand;
  return (
    <Card style={[styles.statCard, { borderColor: t.border }]}>
      <View style={[styles.statIconWrap, { backgroundColor: t.bg }]}>
        <Ionicons name={icon} size={18} color={t.fg} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    width: "48%",
    alignItems: "flex-start",
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: 12,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.ink },
  statLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slateLight, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink, marginBottom: 12 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F8FAFC",
    ...shadow.card,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  actionLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.ink },
});
