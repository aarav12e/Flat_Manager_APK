const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, requireRole } = require("../middleware/auth");
const { getMyNotices, getAllNotices, createNotice } = require("../controllers/noticeController");

const router = express.Router();

router.use(protect);

router.get("/", requireRole("owner"), getMyNotices);
router.get("/all", requireRole("admin"), getAllNotices);

router.post(
  "/",
  requireRole("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 120 }),
    body("body").trim().notEmpty().withMessage("Message is required.").isLength({ max: 1000 }),
    body("audience").trim().notEmpty().withMessage("Audience is required."),
  ],
  validate,
  createNotice
);

module.exports = router;
