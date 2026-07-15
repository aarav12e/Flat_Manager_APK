import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, radius, shadow } from "../theme/theme";
import { Pill } from "./UI";

const STATUS_LABEL = { rent: "For rent", sale: "For sale", none: null };
const STATUS_TONE = { rent: "amber", sale: "sage" };

// Styled like an engraved door plate: unit number on the left in mono type,
// owner name to the right, a small listing tag if the flat is on the market.
export default function NameplateCard({ number, ownerName, phone, listingStatus, extra }) {
  const label = STATUS_LABEL[listingStatus];
  return (
    <View style={styles.card}>
      <View style={styles.plate}>
        <Text style={styles.plateNumber}>{number}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.name}>{ownerName}</Text>
        {phone ? (
          <View style={styles.row}>
            <Ionicons name="call-outline" size={13} color={colors.slateLight} />
            <Text style={styles.phone}>{phone}</Text>
          </View>
        ) : null}
        {label ? (
          <View style={{ marginTop: 6 }}>
            <Pill text={label} tone={STATUS_TONE[listingStatus]} />
          </View>
        ) : null}
        {extra}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  plate: {
    backgroundColor: colors.brandSoft,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  plateNumber: { fontFamily: fonts.plate, color: colors.brand, fontSize: 14.5, letterSpacing: 0.5 },
  name: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  phone: { fontFamily: fonts.body, fontSize: 13, color: colors.slateLight, marginLeft: 5 },
});
