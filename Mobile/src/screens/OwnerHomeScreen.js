import React, { useCallback, useState } from "react";
import { View, FlatList, RefreshControl, LayoutAnimation } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { ScreenHeader, EmptyState, CardSkeleton } from "../components/UI";
import { NoticeCard } from "../components/Cards";
import { colors, spacing } from "../theme/theme";

export default function OwnerHomeScreen() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await api.getNotices(user.flatId);
    setNotices(data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLoading(false);
      });
    }, [user.flatId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cloud, paddingHorizontal: spacing.lg }} edges={["top", "left", "right"]}>
      <ScreenHeader eyebrow="Notice board" title={`Hi, ${user.name.split(" ")[0]}`} />
      {loading ? (
        <View style={{ flex: 1 }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : (
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoticeCard
              title={item.title}
              body={item.body}
              createdAt={item.createdAt}
              targeted={item.audience !== "all"}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState title="No notices yet" subtitle="Society announcements will show up here." />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
