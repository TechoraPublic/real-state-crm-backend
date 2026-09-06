import Joi from "joi";

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const INTEGRATION_STATUSES = [
  "active",
  "inactive",
  "error",
];

const SORT_ORDERS = [
  "ASC",
  "DESC",
];

/*
|--------------------------------------------------------------------------
| COMMON SCHEMAS
|--------------------------------------------------------------------------
*/

const positiveId = Joi.number()
  .integer()
  .positive();

const optionalPositiveId = Joi.number()
  .integer()
  .positive()
  .optional();

const platform = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[a-z0-9_-]+$/)
  .max(100);

const integrationName = Joi.string()
  .trim()
  .min(1)
  .max(150);

const status = Joi.string()
  .trim()
  .lowercase()
  .valid(...INTEGRATION_STATUSES);

const config = Joi.object()
  .unknown(true)
  .allow(null)
  .optional();

/*
|--------------------------------------------------------------------------
| CREATE INTEGRATION
|--------------------------------------------------------------------------
*/

const createIntegrationBody = Joi.object({
  lead_source_id: positiveId.required(),

  name: integrationName.required(),

  platform: platform.required(),

  config,

  status: status
    .default("inactive"),
});

/*
|--------------------------------------------------------------------------
| UPDATE INTEGRATION
|--------------------------------------------------------------------------
*/

const updateIntegrationBody = Joi.object({
  lead_source_id: optionalPositiveId,

  name: integrationName,

  platform,

  config,

  status,
}).min(1);

/*
|--------------------------------------------------------------------------
| INTEGRATION ID PARAMS
|--------------------------------------------------------------------------
*/

const integrationIdParams = Joi.object({
  id: positiveId.required(),
});

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

const changeIntegrationStatusBody = Joi.object({
  status: status.required(),
});

/*
|--------------------------------------------------------------------------
| UPDATE SYNC STATUS
|--------------------------------------------------------------------------
*/

const updateSyncStatusBody = Joi.object({
  last_synced_at: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  last_error: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional(),
}).min(1);

/*
|--------------------------------------------------------------------------
| GET ALL INTEGRATIONS QUERY
|--------------------------------------------------------------------------
*/

const getAllIntegrationsQuery = Joi.object({
  page: Joi.number()
    .integer()
    .positive()
    .default(1),

  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .default(20),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional(),

  platform: platform.optional(),

  status: status.optional(),

  leadSourceId: Joi.number()
    .integer()
    .positive()
    .optional(),

  sortBy: Joi.string()
    .valid(
      "id",
      "name",
      "platform",
      "status",
      "last_synced_at",
      "created_at",
      "updated_at"
    )
    .default("created_at"),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .default("DESC"),
});

/*
|--------------------------------------------------------------------------
| VALIDATION EXPORT
|--------------------------------------------------------------------------
*/

const integrationValidation = {
  createIntegration: {
    body: createIntegrationBody,
  },

  getAllIntegrations: {
    query: getAllIntegrationsQuery,
  },

  getActiveIntegrations: {},

  getIntegrationById: {
    params: integrationIdParams,
  },

  updateIntegration: {
    params: integrationIdParams,
    body: updateIntegrationBody,
  },

  changeIntegrationStatus: {
    params: integrationIdParams,
    body: changeIntegrationStatusBody,
  },

  updateSyncStatus: {
    params: integrationIdParams,
    body: updateSyncStatusBody,
  },

  deleteIntegration: {
    params: integrationIdParams,
  },
};

export default integrationValidation;