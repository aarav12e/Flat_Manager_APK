const asyncHandler = require("express-async-handler");
const Notice = require("../models/Notice");
const Flat = require("../models/Flat");
const User = require("../models/User");

// GET /api/notices  (owner) — broadcasts + anything targeted at their own flat
const getMyNotices = asyncHandler(async (req, res) => {
  if (!req.user.flat) {
    return res.json([]);
  }
  const notices = await Notice.find({
    $or: [{ audience: "all" }, { audience: req.user.flat.toString() }],
  }).sort({ createdAt: -1 });
  res.json(notices);
});

// GET /api/notices/all  (admin)
const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find({}).sort({ createdAt: -1 });
  res.json(notices);
});

// POST /api/notices  (admin) — body: { title, body, audience }
// audience is "all" for a broadcast, or a flat's id for a targeted reminder.
const createNotice = asyncHandler(async (req, res) => {
  const { title, body, audience } = req.body;

  if (audience !== "all") {
    const flat = await Flat.findById(audience).catch(() => null);
    if (!flat) {
      res.status(400);
      throw new Error("That flat doesn't exist.");
    }
  }

  const notice = await Notice.create({ title, body, audience, sentBy: req.user._id });

  // Dispatch push notifications in the background so request is not blocked
  process.nextTick(async () => {
    try {
      let pushTokens = [];
      if (audience === "all") {
        const users = await User.find({ pushToken: { $ne: null } });
        pushTokens = users.map((u) => u.pushToken);
      } else {
        const flat = await Flat.findById(audience);
        if (flat) {
          const ownerUser = await User.findById(flat.owner);
          if (ownerUser && ownerUser.pushToken) {
            pushTokens = [ownerUser.pushToken];
          }
        }
      }

      if (pushTokens.length > 0) {
        const { sendPushNotifications } = require("../utils/pushNotifications");
        const payloads = pushTokens.map((token) => ({
          to: token,
          title: audience === "all" ? "New Broadcast Notice" : "New Flat Reminder",
          body: title,
          data: { noticeId: notice._id.toString() },
        }));
        await sendPushNotifications(payloads);
        console.log(`[Push Notification] Dispatched to ${pushTokens.length} recipients`);
      }
    } catch (err) {
      console.error("[Push Notification] Failed to dispatch notice pushes:", err);
    }
  });

  res.status(201).json(notice);
});

module.exports = { getMyNotices, getAllNotices, createNotice };
