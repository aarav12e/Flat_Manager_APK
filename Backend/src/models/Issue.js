const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true, index: true },
    flatNumber: { type: String, required: true },
    raisedBy: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
