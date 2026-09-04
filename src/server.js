import app from "./app.js";
import sequelize from "./config/database.js";
import env from "./config/env.js";
import "./databases/associations.js";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const connectDatabase = async () => {
  const maxRetries = 30;
  const retryDelay = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🔄 Connecting to database... Attempt ${attempt}/${maxRetries}`
      );

      await sequelize.authenticate();

      console.log("✅ Database connected successfully");

      return true;
    } catch (error) {
      console.error(
        `❌ Database connection failed. Attempt ${attempt}/${maxRetries}`
      );

      console.error("Database error:", error.message);

      if (attempt === maxRetries) {
        console.error("❌ Could not connect to database.");
        throw error;
      }

      console.log(
        `⏳ Retrying database connection in ${retryDelay / 1000}s...`
      );

      await sleep(retryDelay);
    }
  }
};

const startServer = async () => {
  try {
    // ---------------------------------------------------------
    // Database Connection
    // ---------------------------------------------------------

    await connectDatabase();

    // ---------------------------------------------------------
    // Start Express Server
    // ---------------------------------------------------------

    const server = app.listen(env.port, "0.0.0.0", () => {
      console.log(
        `🚀 CRM API running on http://0.0.0.0:${env.port}`
      );
    });

    // ---------------------------------------------------------
    // Server Error Handling
    // ---------------------------------------------------------

    server.on("error", (error) => {
      console.error("❌ Server error:", error);

      if (error.code === "EADDRINUSE") {
        console.error(
          `❌ Port ${env.port} is already in use.`
        );
      }

      process.exit(1);
    });

    // ---------------------------------------------------------
    // Graceful Shutdown
    // ---------------------------------------------------------

    const shutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down...`);

      server.close(async () => {
        console.log("✅ HTTP server closed.");

        try {
          await sequelize.close();
          console.log("✅ Database connection closed.");
          process.exit(0);
        } catch (error) {
          console.error(
            "❌ Error closing database connection:",
            error
          );
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

startServer();