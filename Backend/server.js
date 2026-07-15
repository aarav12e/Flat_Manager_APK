require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Nestlist API running on port ${PORT}`);
    });

    // Fail loudly instead of leaving unhandled promise rejections silent.
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled rejection:", err.message);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
