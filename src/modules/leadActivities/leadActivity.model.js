import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const LeadActivity = sequelize.define(
  "LeadActivity",
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

    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    type: {
      type: DataTypes.ENUM(
        "note",
        "call",
        "email",
        "whatsapp",
        "status_change",
        "assignment",
        "followup",
        "site_visit",
        "property_view",
        "deal"
      ),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lead_activities",
    timestamps: false,
    underscored: true,
  }
);

export default LeadActivity;