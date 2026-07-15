import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ScreenHeader, Card, Button, Pill } from "../components/UI";
import { colors, fonts, spacing, radius } from "../theme/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud, paddingHorizontal: spacing.lg }} edges={["top", "left", "right"]}>
      <ScreenHeader eyebrow="Account" title="Profile" />

      <Card style={{ alignItems: "center", paddingVertical: spacing.xl, marginBottom: spacing.lg }}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={30} color="#fff" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
        <View style={{ marginTop: 10 }}>
          <Pill text={user.role === "admin" ? "Society admin" : "Flat owner"} tone={user.role === "admin" ? "amber" : "sage"} />
        </View>
      </Card>

      <Button title="Log out" variant="outline" onPress={logout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.ink },
  phone: { fontFamily: fonts.body, fontSize: 13, color: colors.slateLight, marginTop: 2 },
});
