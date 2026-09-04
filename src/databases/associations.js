import {
  User,
  Company,
  Lead,
  Customer,
  Property,
  Deal,
  FollowUp,
  Role,
  SiteVisit,
  LeadSource,
  LeadActivity,
    Permission,
  RolePermission,
} from "./models.js";

/*
|--------------------------------------------------------------------------
| COMPANY ↔ USER
|--------------------------------------------------------------------------
*/

Company.hasMany(User, {
  foreignKey: "company_id",
  as: "users",
});

User.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});


/*
|--------------------------------------------------------------------------
| ROLE ↔ USER
|--------------------------------------------------------------------------
*/

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});



Role.hasMany(RolePermission, {
  foreignKey: "role_id",
  as: "rolePermissions",
});

RolePermission.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "rolePermissions",
});

RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});


/*
|--------------------------------------------------------------------------
| COMPANY ↔ PROPERTY
|--------------------------------------------------------------------------
*/

Company.hasMany(Property, {
  foreignKey: "company_id",
  as: "properties",
});

Property.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});


/*
|--------------------------------------------------------------------------
| COMPANY ↔ LEAD
|--------------------------------------------------------------------------
*/

Company.hasMany(Lead, {
  foreignKey: "company_id",
  as: "leads",
});

Lead.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});


Company.hasMany(LeadSource, {
  foreignKey: "company_id",
  as: "leadSources",
});

LeadSource.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});

/*
|--------------------------------------------------------------------------
| COMPANY ↔ DEAL
|--------------------------------------------------------------------------
*/

Company.hasMany(Deal, {
  foreignKey: "company_id",
  as: "deals",
});

Deal.belongsTo(Company, {
  foreignKey: "company_id",
  as: "company",
});


/*
|--------------------------------------------------------------------------
| COMPANY ↔ INTEGRATION
|--------------------------------------------------------------------------
|
| NOTE:
| Your current model list does NOT contain Integration.
| So no Integration association is added here.
|
*/


/*
|--------------------------------------------------------------------------
| LEAD SOURCE ↔ LEAD
|--------------------------------------------------------------------------
*/

LeadSource.hasMany(Lead, {
  foreignKey: "lead_source_id",
  as: "leads",
});

Lead.belongsTo(LeadSource, {
  foreignKey: "lead_source_id",
  as: "leadSource",
});


/*
|--------------------------------------------------------------------------
| CUSTOMER ↔ LEAD
|--------------------------------------------------------------------------
*/

Customer.hasMany(Lead, {
  foreignKey: "customer_id",
  as: "leads",
});

Lead.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});


/*
|--------------------------------------------------------------------------
| PROPERTY ↔ LEAD
|--------------------------------------------------------------------------
*/

Property.hasMany(Lead, {
  foreignKey: "property_id",
  as: "leads",
});

Lead.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});


/*
|--------------------------------------------------------------------------
| USER ↔ LEAD
|--------------------------------------------------------------------------
|
| assigned_to = User who owns/handles the lead
|
*/

User.hasMany(Lead, {
  foreignKey: "assigned_to",
  as: "assignedLeads",
});

Lead.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedUser",
});


/*
|--------------------------------------------------------------------------
| LEAD ↔ LEAD ACTIVITY
|--------------------------------------------------------------------------
*/

Lead.hasMany(LeadActivity, {
  foreignKey: "lead_id",
  as: "activities",
});

LeadActivity.belongsTo(Lead, {
  foreignKey: "lead_id",
  as: "lead",
});


/*
|--------------------------------------------------------------------------
| USER ↔ LEAD ACTIVITY
|--------------------------------------------------------------------------
|
| user_id = User who performed the activity
|
*/

User.hasMany(LeadActivity, {
  foreignKey: "user_id",
  as: "leadActivities",
});

LeadActivity.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});


/*
|--------------------------------------------------------------------------
| LEAD ↔ FOLLOW UP
|--------------------------------------------------------------------------
*/

Lead.hasMany(FollowUp, {
  foreignKey: "lead_id",
  as: "followUps",
});

FollowUp.belongsTo(Lead, {
  foreignKey: "lead_id",
  as: "lead",
});


/*
|--------------------------------------------------------------------------
| USER ↔ FOLLOW UP (ASSIGNED)
|--------------------------------------------------------------------------
*/

User.hasMany(FollowUp, {
  foreignKey: "assigned_to",
  as: "assignedFollowUps",
});

FollowUp.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedUser",
});


/*
|--------------------------------------------------------------------------
| USER ↔ FOLLOW UP (CREATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(FollowUp, {
  foreignKey: "created_by",
  as: "createdFollowUps",
});

FollowUp.belongsTo(User, {
  foreignKey: "created_by",
  as: "followUpsCreated",
});


/*
|--------------------------------------------------------------------------
| LEAD ↔ SITE VISIT
|--------------------------------------------------------------------------
*/

Lead.hasMany(SiteVisit, {
  foreignKey: "lead_id",
  as: "siteVisits",
});

SiteVisit.belongsTo(Lead, {
  foreignKey: "lead_id",
  as: "lead",
});


/*
|--------------------------------------------------------------------------
| PROPERTY ↔ SITE VISIT
|--------------------------------------------------------------------------
*/

Property.hasMany(SiteVisit, {
  foreignKey: "property_id",
  as: "siteVisits",
});

SiteVisit.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});


/*
|--------------------------------------------------------------------------
| USER ↔ SITE VISIT (ASSIGNED)
|--------------------------------------------------------------------------
*/

User.hasMany(SiteVisit, {
  foreignKey: "assigned_to",
  as: "assignedSiteVisits",
});

SiteVisit.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedUser",
});


/*
|--------------------------------------------------------------------------
| USER ↔ SITE VISIT (CREATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(SiteVisit, {
  foreignKey: "created_by",
  as: "createdSiteVisits",
});

SiteVisit.belongsTo(User, {
  foreignKey: "created_by",
  as: "siteVisitsCreated",
});


/*
|--------------------------------------------------------------------------
| LEAD ↔ DEAL
|--------------------------------------------------------------------------
*/

Lead.hasMany(Deal, {
  foreignKey: "lead_id",
  as: "deals",
});

Deal.belongsTo(Lead, {
  foreignKey: "lead_id",
  as: "lead",
});


/*
|--------------------------------------------------------------------------
| CUSTOMER ↔ DEAL
|--------------------------------------------------------------------------
*/

Customer.hasMany(Deal, {
  foreignKey: "customer_id",
  as: "deals",
});

Deal.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});


/*
|--------------------------------------------------------------------------
| PROPERTY ↔ DEAL
|--------------------------------------------------------------------------
*/

Property.hasMany(Deal, {
  foreignKey: "property_id",
  as: "deals",
});

Deal.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});


/*
|--------------------------------------------------------------------------
| USER ↔ DEAL (ASSIGNED)
|--------------------------------------------------------------------------
*/

User.hasMany(Deal, {
  foreignKey: "assigned_to",
  as: "assignedDeals",
});

Deal.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedUser",
});


/*
|--------------------------------------------------------------------------
| USER ↔ DEAL (CREATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(Deal, {
  foreignKey: "created_by",
  as: "createdDeals",
});

Deal.belongsTo(User, {
  foreignKey: "created_by",
  as: "dealsCreated",
});


/*
|--------------------------------------------------------------------------
| USER ↔ DEAL (UPDATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(Deal, {
  foreignKey: "updated_by",
  as: "updatedDeals",
});

Deal.belongsTo(User, {
  foreignKey: "updated_by",
  as: "dealsUpdated",
});


/*
|--------------------------------------------------------------------------
| USER ↔ PROPERTY (CREATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(Property, {
  foreignKey: "created_by",
  as: "createdProperties",
});

Property.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});


/*
|--------------------------------------------------------------------------
| USER ↔ PROPERTY (UPDATED BY)
|--------------------------------------------------------------------------
*/

User.hasMany(Property, {
  foreignKey: "updated_by",
  as: "updatedProperties",
});

Property.belongsTo(User, {
  foreignKey: "updated_by",
  as: "updater",
});


/*
|--------------------------------------------------------------------------
| EXPORT MODELS
|--------------------------------------------------------------------------
*/

export {
  User,
  Company,
  Lead,
  Customer,
  Property,
  Deal,
  FollowUp,
  Role,
  SiteVisit,
  LeadSource,
  LeadActivity,
};