import React, { useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, Card, Button, Input } from "../components/UI";
import { colors, fonts, spacing } from "../theme/theme";

export default function SuggestionScreen() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    setSent(false);
    try {
      const flat = await api.getMyFlat(user.id);
      await api.sendSuggestion({
        flatId: flat.id,
        flatNumber: flat.number,
        raisedBy: user.name,
        message: message.trim(),
      });
      setMessage("");
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <ScreenHeader eyebrow="Have an idea?" title="Suggestions" />
      <Card>
        <Text style={styles.helper}>
          Share ideas for improving the society — the admin reads every suggestion.
        </Text>
        <Input
          label="Your suggestion"
          placeholder="e.g. Add a CCTV camera near the main gate"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          style={{ height: 110, textAlignVertical: "top" }}
        />
        {sent ? <Text style={styles.sentText}>Sent — thanks for the input!</Text> : null}
        <Button title={sending ? "Sending..." : "Send suggestion"} onPress={onSubmit} disabled={sending} />
      </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  helper: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, marginBottom: spacing.md, lineHeight: 18 },
  sentText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.sage, marginBottom: 10, textAlign: "center" },
});
