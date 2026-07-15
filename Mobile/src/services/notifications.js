import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests device permissions and retrieves the Expo push notification token.
 * @returns {Promise<string|null>} The Expo push token or null if denied/simulator
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

  // On Android, configure a default channel for heads-up notifications
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.log("Must use a physical device for push notifications.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission to receive push notifications was denied!");
    return null;
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    if (!projectId) {
      console.warn("No EAS projectId found in app.json. Using a mock push token for local testing.");
      return "ExponentPushToken[mock-local-development-token]";
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log("Expo Push Token obtained:", token);
  } catch (error) {
    console.warn("Failed to fetch Expo push token, falling back to mock token:", error.message);
    return "ExponentPushToken[mock-local-development-token]";
  }

  return token;
}
