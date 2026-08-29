import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  database: {
    host: process.env.DB_HOST || "mysql",
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || "real_estate_crm",
    user: process.env.DB_USER || "crm_user",
    password: process.env.DB_PASSWORD || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};

export default env;