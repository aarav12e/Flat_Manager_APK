const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    // "all" for a broadcast, or a Flat ObjectId (as a string) for a targeted reminder.
    audience: { type: String, required: true, index: true },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
