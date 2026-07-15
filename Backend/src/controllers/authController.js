const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Flat = require("../models/Flat");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
// Self-service owner registration. Creates the User and their Flat together.
// Admin accounts are never created through this endpoint — only via the seed script.
const register = asyncHandler(async (req, res) => {
  const { name, phone, password, flatNumber } = req.body;

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    res.status(409);
    throw new Error("An account with this phone number already exists.");
  }

  const existingFlat = await Flat.findOne({ number: flatNumber.trim().toUpperCase() });
  if (existingFlat) {
    res.status(409);
    throw new Error("That flat number is already registered.");
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, phone, passwordHash, role: "owner" });

  let flat;
  try {
    flat = await Flat.create({
      number: flatNumber,
      owner: user._id,
      ownerName: name,
      phone,
    });
  } catch (err) {
    // Standalone MongoDB (no replica set) can't do multi-document transactions,
    // so if the flat fails to create we manually roll back the user we just made.
    await User.findByIdAndDelete(user._id);
    throw err;
  }

  user.flat = flat._id;
  await user.save();

  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, phone: user.phone, role: user.role, flatId: flat._id },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  console.log(`[Login Attempt] Phone: "${phone}", Password Length: ${password ? password.length : 0}, Password JSON: ${JSON.stringify(password)}`);

  const user = await User.findOne({ phone });
  const passwordOk = user ? await user.comparePassword(password) : false;
  console.log(`[Login Result] User Found: ${!!user}, Password Matches: ${passwordOk}`);

  if (!user || !passwordOk) {
    res.status(401);
    throw new Error("Invalid phone number or password.");
  }

  res.json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, phone: user.phone, role: user.role, flatId: user.flat },
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    flatId: user.flat,
  });
});

// POST /api/auth/push-token
const savePushToken = asyncHandler(async (req, res) => {
  const { pushToken } = req.body;
  req.user.pushToken = pushToken || null;
  await req.user.save();
  res.json({ message: "Push token registered successfully." });
});

module.exports = { register, login, me, savePushToken };
