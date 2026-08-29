import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Deal = sequelize.define(
  "Deal",
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

    lead_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    customer_id: {
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

    deal_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    stage: {
      type: DataTypes.ENUM(
        "initial",
        "negotiation",
        "documentation",
        "closed"
      ),
      allowNull: false,
      defaultValue: "initial",
    },

    status: {
      type: DataTypes.ENUM(
        "open",
        "won",
        "lost",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "open",
    },

    expected_close_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lost_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "deals",
    timestamps: true,
    underscored: true,
  }
);

export default Deal;