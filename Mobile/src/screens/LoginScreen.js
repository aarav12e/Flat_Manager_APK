import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/UI";
import { colors, fonts, spacing } from "../theme/theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError("");
    if (!phone || !password) {
      setError("Enter your phone number and password.");
      return;
    }
    setLoading(true);
    try {
      await login(phone.trim(), password);
      // AppNavigator watches auth state and routes to the right dashboard
      // automatically based on the logged-in user's role.
    } catch (e) {
      setError(e.message || "Could not log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ink }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.badge}>
            <Ionicons name="home" size={26} color={colors.ink} />
          </View>
          <Text style={styles.brandTitle}>Nestlist</Text>
          <Text style={styles.brandSubtitle}>Your society, one directory.</Text>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.heading}>Log in</Text>
          <Text style={styles.subheading}>
            Owners and the society admin both log in here.
          </Text>

          <Input
            label="Phone number"
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            label="Password"
            placeholder="Your password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title={loading ? "Logging in..." : "Log in"} onPress={onSubmit} disabled={loading} />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              New owner? <Text style={styles.registerTextBold}>Register your flat</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>Demo accounts</Text>
            <Text style={styles.hintLine}>Admin — 9999900000 / admin123</Text>
            <Text style={styles.hintLine}>Owner — 9876500002 / pass123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  brand: { alignItems: "center", paddingTop: 70, paddingBottom: 40 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  brandTitle: { fontFamily: fonts.displayBold, fontSize: 26, color: "#fff" },
  brandSubtitle: { fontFamily: fonts.body, fontSize: 13, color: "#B9BFCF", marginTop: 4 },
  sheet: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  heading: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
  subheading: { fontFamily: fonts.body, fontSize: 13.5, color: colors.slate, marginTop: 4, marginBottom: spacing.lg },
  error: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.coral, marginBottom: spacing.md },
  registerLink: { marginTop: spacing.lg, alignItems: "center" },
  registerText: { fontFamily: fonts.body, fontSize: 13.5, color: colors.slate },
  registerTextBold: { fontFamily: fonts.bodySemi, color: colors.brand },
  hintBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  hintTitle: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.brand, marginBottom: 4 },
  hintLine: { fontFamily: fonts.plate, fontSize: 12, color: colors.ink, marginTop: 2 },
});
