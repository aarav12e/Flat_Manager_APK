const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true, index: true },
    flatNumber: { type: String, required: true },
    raisedBy: { type: String, required: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
