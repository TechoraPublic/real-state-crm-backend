import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    module: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    action: {
      type: DataTypes.ENUM(
        "view",
        "create",
        "update",
        "delete"
      ),
      allowNull: false,
      defaultValue: "view",
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
    tableName: "permissions",
    timestamps: true,
    underscored: true,
  }
);

export default Permission;