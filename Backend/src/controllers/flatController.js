const asyncHandler = require("express-async-handler");
const Flat = require("../models/Flat");

// GET /api/flats/me  (owner)
const getMyFlat = asyncHandler(async (req, res) => {
  if (!req.user.flat) {
    res.status(404);
    throw new Error("No flat is linked to this account.");
  }
  const flat = await Flat.findById(req.user.flat);
  if (!flat) {
    res.status(404);
    throw new Error("Flat not found.");
  }
  res.json(flat);
});

// PUT /api/flats/me  (owner) — body: { listingStatus, details }
const updateMyFlat = asyncHandler(async (req, res) => {
  const { listingStatus, details } = req.body;

  if (!req.user.flat) {
    res.status(404);
    throw new Error("No flat is linked to this account.");
  }

  const flat = await Flat.findById(req.user.flat);
  if (!flat) {
    res.status(404);
    throw new Error("Flat not found.");
  }

  if (listingStatus) flat.listingStatus = listingStatus;
  flat.details = flat.listingStatus === "none" ? "" : (details || "").trim();

  await flat.save();
  res.json(flat);
});

// GET /api/flats/directory  (owner) — every other flat, limited fields only
const getDirectory = asyncHandler(async (req, res) => {
  const flats = await Flat.find({ _id: { $ne: req.user.flat } }).sort({ number: 1 });
  res.json(flats.map((f) => f.toDirectoryView()));
});

// GET /api/flats  (admin) — full detail on every flat
const getAllFlats = asyncHandler(async (req, res) => {
  const flats = await Flat.find({}).sort({ number: 1 });
  res.json(flats);
});

module.exports = { getMyFlat, updateMyFlat, getDirectory, getAllFlats };
