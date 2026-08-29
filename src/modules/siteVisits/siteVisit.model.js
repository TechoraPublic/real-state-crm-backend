import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const SiteVisit = sequelize.define(
  "SiteVisit",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    property_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    assigned_to: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no_show"
      ),
      allowNull: false,
      defaultValue: "scheduled",
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    outcome: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "site_visits",
    timestamps: true,
    underscored: true,
  }
);

export default SiteVisit;