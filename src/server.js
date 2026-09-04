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

      if (attempt === maxRetries) {
        console.error("❌ Could not connect to database.");
        throw error;
      }

      console.log(`⏳ Retrying database connection in ${retryDelay / 1000}s...`);

      await sleep(retryDelay);
    }
  }
};

const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    */

    await connectDatabase();

    /*
    |--------------------------------------------------------------------------
    | Start Server
    |--------------------------------------------------------------------------
    */

    app.listen(env.port, () => {
      console.log(
        `🚀 CRM API running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);

    process.exit(1);
  }
};

startServer();