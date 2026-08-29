import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,

    dialect: "mysql",

    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    timezone: "+05:30",
  }
);

export default sequelize;