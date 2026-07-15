import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, shadow } from "../theme/theme";
import { Pill } from "./UI";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NoticeCard({ title, body, createdAt, targeted }) {
  return (
    <View style={[styles.card, { borderLeftColor: colors.amber }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.amberSoft }]}>
        <Ionicons name={targeted ? "person-outline" : "megaphone-outline"} size={18} color={colors.amber} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{timeAgo(createdAt)}</Text>
        </View>
        <Text style={styles.body}>{body}</Text>
        {targeted ? (
          <View style={{ marginTop: 8 }}>
            <Pill text="Sent to you" tone="amber" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function IssueCard({ flatNumber, raisedBy, title, description, status, createdAt, footer }) {
  return (
    <View style={[styles.card, { borderLeftColor: colors.coral }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.coralSoft }]}>
        <Ionicons name="alert-circle-outline" size={18} color={colors.coral} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{title}</Text>
          <Pill text={status === "resolved" ? "Resolved" : "Open"} tone={status === "resolved" ? "sage" : "coral"} />
        </View>
        <Text style={styles.meta}>{flatNumber} · {raisedBy} · {timeAgo(createdAt)}</Text>
        <Text style={styles.body}>{description}</Text>
        {footer}
      </View>
    </View>
  );
}

export function SuggestionCard({ flatNumber, raisedBy, message, createdAt }) {
  return (
    <View style={[styles.card, { borderLeftColor: colors.sage }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.sageSoft }]}>
        <Ionicons name="bulb-outline" size={18} color={colors.sage} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.meta}>{flatNumber} · {raisedBy} · {timeAgo(createdAt)}</Text>
        <Text style={styles.body}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderTopLeftRadius: radius.sm,
    borderBottomLeftRadius: radius.sm,
    borderLeftWidth: 4.5,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
    borderWidth: 1,
    borderTopColor: "#F1F5F9",
    borderRightColor: "#F1F5F9",
    borderBottomColor: "#F1F5F9",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontFamily: fonts.bodySemi, fontSize: 14.5, color: colors.ink, flex: 1, marginRight: 8 },
  time: { fontFamily: fonts.body, fontSize: 11.5, color: colors.slateLight },
  body: { fontFamily: fonts.body, fontSize: 13.5, color: colors.slate, marginTop: 5, lineHeight: 19 },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.slateLight, marginTop: 1, marginBottom: 3 },
});
