import app from "./app.js";
import sequelize from "./config/database.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    */

    await sequelize.authenticate();

    console.log("✅ Database connected successfully");

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