import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const LeadSource = sequelize.define(
  "LeadSource",
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

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    tableName: "lead_sources",
    timestamps: true,
    underscored: true,
  }
);

export default LeadSource;