// Catches everything thrown or passed to next(err) in one place, so every
// route can just `throw new Error("message")` and get a consistent JSON shape.

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Something went wrong.";

  // Mongoose duplicate key (e.g. phone number or flat number already taken)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `That ${field} is already in use.`;
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)[0]?.message || "Invalid data.";
  }

  // Malformed ObjectId in a route param
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID.";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
