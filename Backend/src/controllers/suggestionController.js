const asyncHandler = require("express-async-handler");
const Suggestion = require("../models/Suggestion");
const Flat = require("../models/Flat");

// POST /api/suggestions  (owner) — body: { message }
const sendSuggestion = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!req.user.flat) {
    res.status(400);
    throw new Error("No flat is linked to this account.");
  }
  const flat = await Flat.findById(req.user.flat);
  if (!flat) {
    res.status(404);
    throw new Error("Flat not found.");
  }

  const suggestion = await Suggestion.create({
    flat: flat._id,
    flatNumber: flat.number,
    raisedBy: req.user.name,
    message,
  });
  res.status(201).json(suggestion);
});

// GET /api/suggestions  (admin)
const getAllSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await Suggestion.find({}).sort({ createdAt: -1 });
  res.json(suggestions);
});

module.exports = { sendSuggestion, getAllSuggestions };
