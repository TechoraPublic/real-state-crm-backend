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

    // ---------------------------------------------------------
    // Company
    // ---------------------------------------------------------

    company_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    // ---------------------------------------------------------
    // Customer
    // Nullable because a new lead may not be a customer yet
    // ---------------------------------------------------------

    customer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Assigned Salesperson
    // ---------------------------------------------------------

    assigned_to: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Interested Property
    // Nullable because lead may not have selected a property yet
    // ---------------------------------------------------------

    property_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Lead Source
    // Example: Facebook, Instagram, Website, Referral
    // ---------------------------------------------------------

    lead_source_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    // ---------------------------------------------------------
    // Integration
    // Used for Facebook/Instagram/Portal/API integrations
    // ---------------------------------------------------------

    integration_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // External Lead ID
    // ID received from external platforms
    // Example: Facebook Lead ID / Portal Lead ID
    // ---------------------------------------------------------

    source_lead_id: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Lead Status
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Lead Priority
    // ---------------------------------------------------------

    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },

    // ---------------------------------------------------------
    // Property Requirement
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Budget
    // ---------------------------------------------------------

    budget_min: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    budget_max: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Preferred Location
    // ---------------------------------------------------------

    preferred_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Lead Requirements
    // Example:
    // "3 BHK near Golf Course Road"
    // ---------------------------------------------------------

    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Internal Notes
    // ---------------------------------------------------------

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Lost Reason
    // Used when status = lost
    // ---------------------------------------------------------

    lost_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Next Follow-up
    // Quick-access date/time for upcoming follow-up
    // Detailed follow-up history will be handled separately
    // ---------------------------------------------------------

    next_followup_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // ---------------------------------------------------------
    // Original Source Timestamp
    // When the lead was created on the external platform
    // ---------------------------------------------------------

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