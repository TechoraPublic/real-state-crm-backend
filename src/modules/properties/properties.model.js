import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Property = sequelize.define(
"Property",
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

property_code: {
  type: DataTypes.STRING(50),
  allowNull: false,
},

title: {
  type: DataTypes.STRING(200),
  allowNull: false,
},

property_type: {
  type: DataTypes.ENUM(
    "residential",
    "commercial",
    "plot",
    "land",
    "other"
  ),
  allowNull: false,
},

listing_type: {
  type: DataTypes.ENUM(
    "sale",
    "rent",
    "lease"
  ),
  allowNull: false,
  defaultValue: "sale",
},

description: {
  type: DataTypes.TEXT,
  allowNull: true,
},

price: {
  type: DataTypes.DECIMAL(15, 2),
  allowNull: true,
},

address: {
  type: DataTypes.STRING(255),
  allowNull: true,
},

city: {
  type: DataTypes.STRING(100),
  allowNull: true,
},

state: {
  type: DataTypes.STRING(100),
  allowNull: true,
},

country: {
  type: DataTypes.STRING(100),
  allowNull: true,
  defaultValue: "India",
},

pincode: {
  type: DataTypes.STRING(10),
  allowNull: true,
},

bedrooms: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

bathrooms: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

area: {
  type: DataTypes.DECIMAL(12, 2),
  allowNull: true,
},

area_unit: {
  type: DataTypes.ENUM(
    "sqft",
    "sqm",
    "sqyd",
    "acre",
    "bigha"
  ),
  allowNull: true,
  defaultValue: "sqft",
},

amenities: {
  type: DataTypes.JSON,
  allowNull: true,
},

status: {
  type: DataTypes.ENUM(
    "available",
    "sold",
    "rented",
    "inactive"
  ),
  allowNull: false,
  defaultValue: "available",
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
tableName: "properties",
timestamps: true,
underscored: true,

 
indexes: [
  {
    fields: ["company_id"],
    name: "properties_company_id",
  },
  {
    fields: ["company_id", "status"],
    name: "properties_company_status",
  },
  {
    fields: ["company_id", "property_type"],
    name: "properties_company_type",
  },
  {
    fields: ["company_id", "listing_type"],
    name: "properties_company_listing_type",
  },
  {
    fields: ["city"],
    name: "properties_city",
  },
],
 

}
);

export default Property;
