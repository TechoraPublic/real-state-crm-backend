import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const ACTIVITY_TYPES = [
  "note",
  "call",
  "email",
  "whatsapp",
  "status_change",
  "assignment",
  "followup",
  "site_visit",
  "property_view",
  "deal",
];

const MANUAL_ACTIVITY_TYPES = [
  "note",
  "call",
  "email",
  "whatsapp",
];


/*
|--------------------------------------------------------------------------
| Common Params
|--------------------------------------------------------------------------
*/

const activityIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Activity ID must be a number.",
      "number.integer": "Activity ID must be an integer.",
      "number.positive": "Activity ID must be greater than 0.",
      "any.required": "Activity ID is required.",
    }),
});


const leadIdParams = Joi.object({
  leadId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Lead ID must be a number.",
      "number.integer": "Lead ID must be an integer.",
      "number.positive": "Lead ID must be greater than 0.",
      "any.required": "Lead ID is required.",
    }),
});


const leadAndActivityParams = Joi.object({
  leadId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Lead ID must be a number.",
      "number.integer": "Lead ID must be an integer.",
      "number.positive": "Lead ID must be greater than 0.",
      "any.required": "Lead ID is required.",
    }),

  activityId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Activity ID must be a number.",
      "number.integer": "Activity ID must be an integer.",
      "number.positive": "Activity ID must be greater than 0.",
      "any.required": "Activity ID is required.",
    }),
});


/*
|--------------------------------------------------------------------------
| CREATE ACTIVITY
|--------------------------------------------------------------------------
|
| POST /api/v1/lead-activities
|
| Only manual activities can be created through this API:
|
| note
| call
| email
| whatsapp
|
| System activities such as status_change, assignment, etc.
| are created internally by other services.
|
|--------------------------------------------------------------------------
*/

const createLeadActivityBody = Joi.object({
  lead_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Lead ID must be a number.",
      "number.integer": "Lead ID must be an integer.",
      "number.positive": "Lead ID must be greater than 0.",
      "any.required": "Lead ID is required.",
    }),

  type: Joi.string()
    .valid(...MANUAL_ACTIVITY_TYPES)
    .required()
    .messages({
      "any.only": `Activity type must be one of: ${MANUAL_ACTIVITY_TYPES.join(
        ", "
      )}.`,
      "any.required": "Activity type is required.",
      "string.base": "Activity type must be a string.",
    }),

  title: Joi.string()
    .trim()
    .max(150)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Activity title must be a string.",
      "string.max": "Activity title cannot exceed 150 characters.",
    }),

  description: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Activity description must be a string.",
    }),

  metadata: Joi.object()
    .allow(null)
    .optional()
    .messages({
      "object.base": "Activity metadata must be a valid object.",
    }),
});


/*
|--------------------------------------------------------------------------
| GET ACTIVITIES BY LEAD
|--------------------------------------------------------------------------
|
| GET /api/v1/lead-activities/lead/:leadId
|
| Query:
| ?page=1
| &limit=20
| &type=call
| &userId=5
| &search=customer
| &sortOrder=DESC
|
|--------------------------------------------------------------------------
*/

const getActivitiesByLeadQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),

  type: Joi.string()
    .valid(...ACTIVITY_TYPES)
    .optional()
    .messages({
      "any.only": `Activity type must be one of: ${ACTIVITY_TYPES.join(
        ", "
      )}.`,
    }),

  userId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "User ID must be a number.",
      "number.integer": "User ID must be an integer.",
      "number.positive": "User ID must be greater than 0.",
    }),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional()
    .messages({
      "string.base": "Search must be a string.",
      "string.max": "Search cannot exceed 150 characters.",
    }),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC")
    .messages({
      "any.only": "Sort order must be ASC or DESC.",
    }),
});


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVITIES
|--------------------------------------------------------------------------
|
| GET /api/v1/lead-activities
|
| Query:
| ?page=1
| &limit=20
| &leadId=101
| &userId=5
| &type=call
| &search=customer
| &fromDate=2026-09-01
| &toDate=2026-09-05
| &sortOrder=DESC
|
|--------------------------------------------------------------------------
*/

const getAllActivitiesQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min": "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),

  leadId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Lead ID must be a number.",
      "number.integer": "Lead ID must be an integer.",
      "number.positive": "Lead ID must be greater than 0.",
    }),

  userId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "User ID must be a number.",
      "number.integer": "User ID must be an integer.",
      "number.positive": "User ID must be greater than 0.",
    }),

  type: Joi.string()
    .valid(...ACTIVITY_TYPES)
    .optional()
    .messages({
      "any.only": `Activity type must be one of: ${ACTIVITY_TYPES.join(
        ", "
      )}.`,
    }),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional()
    .messages({
      "string.base": "Search must be a string.",
      "string.max": "Search cannot exceed 150 characters.",
    }),

  fromDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "From date must be a valid date.",
      "date.format": "From date must be in ISO date format.",
    }),

  toDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "To date must be a valid date.",
      "date.format": "To date must be in ISO date format.",
    }),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC")
    .messages({
      "any.only": "Sort order must be ASC or DESC.",
    }),
})
.custom((value, helpers) => {
  if (
    value.fromDate &&
    value.toDate &&
    new Date(value.fromDate) > new Date(value.toDate)
  ) {
    return helpers.message({
      custom: "From date cannot be greater than to date.",
    });
  }

  return value;
});


/*
|--------------------------------------------------------------------------
| DELETE ACTIVITY
|--------------------------------------------------------------------------
|
| DELETE /api/v1/lead-activities/:id
|
|--------------------------------------------------------------------------
*/

const deleteLeadActivityParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Activity ID must be a number.",
      "number.integer": "Activity ID must be an integer.",
      "number.positive": "Activity ID must be greater than 0.",
      "any.required": "Activity ID is required.",
    }),
});


/*
|--------------------------------------------------------------------------
| Export Validation Schemas
|--------------------------------------------------------------------------
*/

export default {
  createLeadActivity: {
    body: createLeadActivityBody,
  },

  getLeadActivityById: {
    params: activityIdParams,
  },

  getActivitiesByLead: {
    params: leadIdParams,
    query: getActivitiesByLeadQuery,
  },

  getAllActivities: {
    query: getAllActivitiesQuery,
  },

  deleteLeadActivity: {
    params: deleteLeadActivityParams,
  },

  getActivityByLeadAndId: {
    params: leadAndActivityParams,
  },
};