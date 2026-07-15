const { Expo } = require("expo-server-sdk");
const expo = new Expo();

/**
 * Sends push notifications to an array of recipients.
 * @param {Array<{to: string, title: string, body: string, data?: Object}>} notifications
 */
async function sendPushNotifications(notifications) {
  const messages = [];
  for (const notif of notifications) {
    if (!Expo.isExpoPushToken(notif.to)) {
      console.warn(`Push token ${notif.to} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: notif.to,
      sound: "default",
      title: notif.title,
      body: notif.body,
      data: notif.data || {},
    });
  }

  if (messages.length === 0) {
    return [];
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending push notification chunk:", error);
    }
  }
  return tickets;
}

module.exports = { sendPushNotifications };
