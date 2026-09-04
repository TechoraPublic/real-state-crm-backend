import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    underscored: true,
  }
);

export default Role;