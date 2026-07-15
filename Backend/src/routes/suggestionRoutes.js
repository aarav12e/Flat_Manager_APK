const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, requireRole } = require("../middleware/auth");
const { sendSuggestion, getAllSuggestions } = require("../controllers/suggestionController");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  requireRole("owner"),
  [body("message").trim().notEmpty().withMessage("Message is required.").isLength({ max: 1000 })],
  validate,
  sendSuggestion
);

router.get("/", requireRole("admin"), getAllSuggestions);

module.exports = router;
