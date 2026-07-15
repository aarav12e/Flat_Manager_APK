const express = require("express");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const { register, login, me, savePushToken } = require("../controllers/authController");

const router = express.Router();

// Slows down brute-force login/register attempts without affecting normal use.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 80 }),
    body("phone").trim().matches(/^\d{10}$/).withMessage("Enter a valid 10-digit phone number."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
    body("flatNumber").trim().notEmpty().withMessage("Flat number is required.").isLength({ max: 20 }),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("phone").trim().notEmpty().withMessage("Phone number is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  login
);

router.get("/me", protect, me);
router.post("/push-token", protect, savePushToken);

module.exports = router;
