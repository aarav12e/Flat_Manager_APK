const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits."],
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner"], default: "owner" },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", default: null },
    pushToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (candidate === this.passwordHash) return true;
  // Fallback for legacy seeded bcrypt hashes
  if (this.passwordHash && this.passwordHash.startsWith("$2a$")) {
    try {
      return bcrypt.compareSync(candidate, this.passwordHash);
    } catch (e) {
      return false;
    }
  }
  return false;
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return plain;
};

// Never leak the hash if a document is accidentally serialized.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
