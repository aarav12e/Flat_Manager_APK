import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, spacing, radius, shadow } from "../theme/theme";

export function Button({ title, onPress, variant = "primary", disabled, style }) {
  const isGradient = variant === "primary" || variant === "danger";
  const colorsMap = {
    primary: ["#3B82F6", "#1D4ED8"], // Vibrant modern blue gradient
    danger: ["#EF4444", "#B91C1C"],  // Alert red gradient
  };
  const gradientColors = colorsMap[variant] || [];
  const textColor = variant === "outline" ? colors.brand : "#fff";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.btnContainer,
        isGradient && shadow.card,
        variant === "outline" && { borderWidth: 1.5, borderColor: colors.brand },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {isGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnContent}
        >
          <Text style={[styles.btnText, { color: "#fff" }]}>{title}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.btnContent, { paddingVertical: 13 }]}>
          <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function Input({ label, style, secureTextEntry, ...props }) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          isFocused && { borderColor: colors.brand, borderWidth: 1.5 },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.slateLight}
          style={[styles.textInput, style]}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsSecure((prev) => !prev)}
            activeOpacity={0.7}
          >
            {isSecure ? (
              <EyeOff size={18} color={colors.slate} />
            ) : (
              <Eye size={18} color={colors.slate} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export function ScreenHeader({ eyebrow, title, right }) {
  return (
    <View style={styles.headerRow}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({ text, tone = "slate" }) {
  const map = {
    sage: { bg: "#ECFDF5", fg: "#047857" },   // Emerald success
    coral: { bg: "#FEF2F2", fg: "#B91C1C" },  // Rose alert/open
    amber: { bg: "#FFFBEB", fg: "#B45309" },  // Warm amber broadcast
    slate: { bg: "#F1F5F9", fg: "#475569" },  // Default slate
  };
  const t = map[tone] || map.slate;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.fg }]}>{text}</Text>
    </View>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Skeleton({ width, height, radius = 6, style }) {
  const pulseAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.7,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#E2E8F0",
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeletonContainer}>
      <Skeleton width={36} height={36} radius={18} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Skeleton width="45%" height={14} />
          <Skeleton width="20%" height={11} />
        </View>
        <Skeleton width="85%" height={12} style={{ marginBottom: 6 }} />
        <Skeleton width="60%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: radius.md,
    overflow: "hidden",
  },
  btnContent: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnText: { fontFamily: fonts.bodySemi, fontSize: 15 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.slate, marginBottom: 7 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  eyeIcon: {
    paddingRight: 14,
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.plate,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.slateLight,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.ink },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  pillText: { fontFamily: fonts.bodySemi, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  empty: { alignItems: "center", paddingVertical: spacing.xl },
  emptyTitle: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink },
  emptySubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slateLight, marginTop: 4, textAlign: "center" },
  cardSkeletonContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
});
