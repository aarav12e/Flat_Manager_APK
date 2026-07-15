require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Flat = require("./models/Flat");
const Notice = require("./models/Notice");
const Issue = require("./models/Issue");
const Suggestion = require("./models/Suggestion");

const SAMPLE_OWNERS = [
  { name: "Rakesh Mehra", phone: "9876500001", password: "pass123", flatNumber: "A-101", listingStatus: "none" },
  {
    name: "Sunita Iyer",
    phone: "9876500002",
    password: "pass123",
    flatNumber: "A-102",
    listingStatus: "rent",
    details: "2BHK, semi-furnished, available from next month.",
  },
  {
    name: "Farhan Sheikh",
    phone: "9876500003",
    password: "pass123",
    flatNumber: "B-201",
    listingStatus: "sale",
    details: "3BHK, east-facing, ready to move.",
  },
];

async function ensureAdmin() {
  const phone = process.env.SEED_ADMIN_PHONE || "9999900000";
  const existing = await User.findOne({ phone });
  if (existing) {
    console.log(`Admin already exists (${phone}) — skipping.`);
    return existing;
  }
  const passwordHash = await User.hashPassword(process.env.SEED_ADMIN_PASSWORD || "admin123");
  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || "Society Admin",
    phone,
    passwordHash,
    role: "admin",
  });
  console.log(`Created admin account: ${phone}`);
  return admin;
}

async function ensureOwner(sample) {
  const existingUser = await User.findOne({ phone: sample.phone });
  if (existingUser) {
    console.log(`Owner already exists (${sample.phone}) — skipping.`);
    return;
  }
  const passwordHash = await User.hashPassword(sample.password);
  const user = await User.create({ name: sample.name, phone: sample.phone, passwordHash, role: "owner" });
  const flat = await Flat.create({
    number: sample.flatNumber,
    owner: user._id,
    ownerName: sample.name,
    phone: sample.phone,
    listingStatus: sample.listingStatus || "none",
    details: sample.details || "",
  });
  user.flat = flat._id;
  await user.save();
  console.log(`Created owner ${sample.name} in ${sample.flatNumber}`);
  return flat;
}

async function run() {
  await connectDB();

  const admin = await ensureAdmin();
  const flats = [];
  for (const sample of SAMPLE_OWNERS) {
    const flat = await ensureOwner(sample);
    if (flat) flats.push(flat);
  }

  if ((await Notice.countDocuments()) === 0 && admin) {
    await Notice.create({
      title: "Water supply maintenance",
      body: "Water will be shut off on Sunday 9am-1pm for tank cleaning.",
      audience: "all",
      sentBy: admin._id,
    });
    console.log("Seeded a sample broadcast notice.");
  }

  const rentedFlat = flats.find((f) => f.number === "A-102");
  if (rentedFlat && (await Issue.countDocuments({ flat: rentedFlat._id })) === 0) {
    await Issue.create({
      flat: rentedFlat._id,
      flatNumber: rentedFlat.number,
      raisedBy: "Sunita Iyer",
      title: "Leaking tap in kitchen",
      description: "The kitchen tap has been leaking for two days.",
      status: "open",
    });
    console.log("Seeded a sample issue.");
  }

  const saleFlat = flats.find((f) => f.number === "B-201");
  if (saleFlat && (await Suggestion.countDocuments({ flat: saleFlat._id })) === 0) {
    await Suggestion.create({
      flat: saleFlat._id,
      flatNumber: saleFlat.number,
      raisedBy: "Farhan Sheikh",
      message: "Can we add a CCTV camera near the main gate?",
    });
    console.log("Seeded a sample suggestion.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
