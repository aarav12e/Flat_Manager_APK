import React, { useCallback, useState } from "react";
import { View, FlatList, TextInput, StyleSheet, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, EmptyState, CardSkeleton } from "../components/UI";
import NameplateCard from "../components/NameplateCard";
import { colors, fonts, spacing, radius } from "../theme/theme";

export default function MembersDirectoryScreen() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      api
        .getDirectory(user.flatId)
        .then(setMembers)
        .finally(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLoading(false);
        });
    }, [user.flatId])
  );

  const filtered = members.filter(
    (m) =>
      m.number.toLowerCase().includes(query.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud, paddingHorizontal: spacing.lg }} edges={["top", "left", "right"]}>
      <ScreenHeader eyebrow="Society directory" title="Members" />

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
            <NameplateCard
              number={item.number}
              ownerName={item.ownerName}
              phone={item.phone}
              listingStatus={item.listingStatus}
            />
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
});
