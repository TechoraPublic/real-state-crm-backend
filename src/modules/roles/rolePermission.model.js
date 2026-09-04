import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    role_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    permission_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "role_permissions",
    timestamps: true,
    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ["role_id", "permission_id"],
      },
    ],
  }
);

export default RolePermission;