const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./routes/authRoutes");
const flatRoutes = require("./routes/flatRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const issueRoutes = require("./routes/issueRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize()); // strips $ and . from req.body/query/params keys

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/flats", flatRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/suggestions", suggestionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
