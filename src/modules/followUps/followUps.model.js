import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FollowUp = sequelize.define(
  "FollowUp",
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

    assigned_to: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "call",
        "whatsapp",
        "email",
        "meeting",
        "reminder",
        "other"
      ),
      allowNull: false,
      defaultValue: "call",
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    completed_at: {
      type: DataTypes.DATE,
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
    tableName: "followups",
    timestamps: true,
    underscored: true,
  }
);

export default FollowUp;