const asyncHandler = require("express-async-handler");
const Issue = require("../models/Issue");
const Flat = require("../models/Flat");

// POST /api/issues  (owner) — body: { title, description }
const reportIssue = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.user.flat) {
    res.status(400);
    throw new Error("No flat is linked to this account.");
  }
  const flat = await Flat.findById(req.user.flat);
  if (!flat) {
    res.status(404);
    throw new Error("Flat not found.");
  }

  const issue = await Issue.create({
    flat: flat._id,
    flatNumber: flat.number,
    raisedBy: req.user.name,
    title,
    description,
  });
  res.status(201).json(issue);
});

// GET /api/issues/mine  (owner)
const getMyIssues = asyncHandler(async (req, res) => {
  if (!req.user.flat) return res.json([]);
  const issues = await Issue.find({ flat: req.user.flat }).sort({ createdAt: -1 });
  res.json(issues);
});

// GET /api/issues  (admin)
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({}).sort({ createdAt: -1 });
  res.json(issues);
});

// PATCH /api/issues/:id  (admin) — body: { status: "open" | "resolved" }
const setIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found.");
  }
  issue.status = status;
  await issue.save();
  res.json(issue);
});

module.exports = { reportIssue, getMyIssues, getAllIssues, setIssueStatus };
