const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect, requireRole } = require("../middleware/auth");
const {
  reportIssue,
  getMyIssues,
  getAllIssues,
  setIssueStatus,
} = require("../controllers/issueController");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  requireRole("owner"),
  [
    body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 120 }),
    body("description").trim().notEmpty().withMessage("Description is required.").isLength({ max: 1000 }),
  ],
  validate,
  reportIssue
);

router.get("/mine", requireRole("owner"), getMyIssues);
router.get("/", requireRole("admin"), getAllIssues);

router.patch(
  "/:id",
  requireRole("admin"),
  [body("status").isIn(["open", "resolved"]).withMessage("Invalid status.")],
  validate,
  setIssueStatus
);

module.exports = router;
