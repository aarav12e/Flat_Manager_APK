const { validationResult } = require("express-validator");

// Runs after an array of express-validator checks; turns the first failing
// rule into a clean 400 error the mobile app can show directly.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }
  next();
}

module.exports = validate;
