const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true, uppercase: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Denormalized so directory reads don't need a populate/join on every request.
    // Kept in sync whenever the owning User's name or phone changes.
    ownerName: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits."],
    },
    listingStatus: { type: String, enum: ["none", "rent", "sale"], default: "none" },
    details: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

// Directory shape shown to other owners: number, name, phone, listing status only.
flatSchema.methods.toDirectoryView = function toDirectoryView() {
  return {
    id: this._id,
    number: this.number,
    ownerName: this.ownerName,
    phone: this.phone,
    listingStatus: this.listingStatus,
  };
};

module.exports = mongoose.model("Flat", flatSchema);
