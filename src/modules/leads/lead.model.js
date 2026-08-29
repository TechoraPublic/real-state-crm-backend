import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Lead = sequelize.define(
  "Lead",
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

    customer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    assigned_to: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    property_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    lead_source_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    integration_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    source_lead_id: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "new",
        "contacted",
        "qualified",
        "site_visit",
        "negotiation",
        "won",
        "lost",
        "on_hold"
      ),
      allowNull: false,
      defaultValue: "new",
    },

    priority: {
      type: DataTypes.ENUM(
        "low",
        "medium",
        "high"
      ),
      allowNull: false,
      defaultValue: "medium",
    },

    property_type: {
      type: DataTypes.ENUM(
        "residential",
        "commercial",
        "plot",
        "land",
        "other"
      ),
      allowNull: true,
    },

    budget_min: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    budget_max: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    preferred_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    lost_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    created_at_source: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
    underscored: true,
  }
);

export default Lead;