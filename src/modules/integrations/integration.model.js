import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Integration = sequelize.define(
  "Integration",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    company_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    lead_source_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    platform: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    config: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive",
        "error"
      ),
      allowNull: false,
      defaultValue: "inactive",
    },

    last_synced_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    last_error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "integrations",
    timestamps: true,
    underscored: true,
  }
);

export default Integration;