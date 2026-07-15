import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import AdminNoticesScreen from "../screens/AdminNoticesScreen";
import AdminMembersScreen from "../screens/AdminMembersScreen";
import AdminReportsScreen from "../screens/AdminReportsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors, fonts } from "../theme/theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  AdminHome: "grid-outline",
  AdminNotices: "megaphone-outline",
  AdminMembers: "people-outline",
  AdminReports: "alert-circle-outline",
  Profile: "person-outline",
};

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.slateLight,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 10.5 },
        tabBarStyle: { borderTopColor: colors.line, height: 62, paddingTop: 6, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size - 2} color={color} />
        ),
      })}
    >
      <Tab.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Dashboard" }} />
      <Tab.Screen name="AdminNotices" component={AdminNoticesScreen} options={{ title: "Notices" }} />
      <Tab.Screen name="AdminMembers" component={AdminMembersScreen} options={{ title: "Members" }} />
      <Tab.Screen name="AdminReports" component={AdminReportsScreen} options={{ title: "Reports" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
