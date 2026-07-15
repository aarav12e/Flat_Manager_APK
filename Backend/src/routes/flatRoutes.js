const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, requireRole } = require("../middleware/auth");
const {
  getMyFlat,
  updateMyFlat,
  getDirectory,
  getAllFlats,
} = require("../controllers/flatController");

const router = express.Router();

router.use(protect);

router.get("/me", requireRole("owner"), getMyFlat);

router.put(
  "/me",
  requireRole("owner"),
  [
    body("listingStatus").isIn(["none", "rent", "sale"]).withMessage("Invalid listing status."),
    body("details").optional({ checkFalsy: true }).isLength({ max: 500 }),
  ],
  validate,
  updateMyFlat
);

router.get("/directory", requireRole("owner"), getDirectory);
router.get("/", requireRole("admin"), getAllFlats);

module.exports = router;
