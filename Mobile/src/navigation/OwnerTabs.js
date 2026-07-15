import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import OwnerHomeScreen from "../screens/OwnerHomeScreen";
import MembersDirectoryScreen from "../screens/MembersDirectoryScreen";
import MyFlatScreen from "../screens/MyFlatScreen";
import ReportIssueScreen from "../screens/ReportIssueScreen";
import SuggestionScreen from "../screens/SuggestionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors, fonts } from "../theme/theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "megaphone-outline",
  Directory: "people-outline",
  MyFlat: "home-outline",
  Report: "construct-outline",
  Suggest: "bulb-outline",
  Profile: "person-outline",
};

export default function OwnerTabs() {
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
      <Tab.Screen name="Home" component={OwnerHomeScreen} options={{ title: "Notices" }} />
      <Tab.Screen name="Directory" component={MembersDirectoryScreen} options={{ title: "Directory" }} />
      <Tab.Screen name="MyFlat" component={MyFlatScreen} options={{ title: "My flat" }} />
      <Tab.Screen name="Report" component={ReportIssueScreen} options={{ title: "Report" }} />
      <Tab.Screen name="Suggest" component={SuggestionScreen} options={{ title: "Suggest" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
