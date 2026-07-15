import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/UI";
import { colors, fonts, spacing } from "../theme/theme";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError("");
    if (!name || !flatNumber || !phone || !password) {
      setError("Please fill in every field.");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Enter a valid phone number.");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        flatNumber: flatNumber.trim().toUpperCase(),
        phone: phone.trim(),
        password,
      });
    } catch (e) {
      setError(e.message || "Could not register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.card }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} onPress={() => navigation.goBack()} />
        </View>

        <Text style={styles.heading}>Register your flat</Text>
        <Text style={styles.subheading}>
          This adds your flat to the society directory. The admin can see your details;
          other owners will only see your flat number, your name, and your phone number.
        </Text>

        <Input label="Your full name" placeholder="e.g. Priya Sharma" value={name} onChangeText={setName} />
        <Input
          label="Flat / room number"
          placeholder="e.g. A-101"
          autoCapitalize="characters"
          value={flatNumber}
          onChangeText={setFlatNumber}
        />
        <Input
          label="Phone number"
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Input
          label="Create a password"
          placeholder="At least 6 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={loading ? "Creating account..." : "Register"} onPress={onSubmit} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingTop: 60 },
  headerRow: { marginBottom: spacing.lg },
  heading: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
  subheading: { fontFamily: fonts.body, fontSize: 13.5, color: colors.slate, marginTop: 6, marginBottom: spacing.lg, lineHeight: 19 },
  error: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.coral, marginBottom: spacing.md },
});
