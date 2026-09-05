import Joi from "joi";


/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const FOLLOW_UP_TYPES = [
  "call",
  "whatsapp",
  "email",
  "meeting",
  "reminder",
  "other",
];

const FOLLOW_UP_STATUSES = [
  "pending",
  "completed",
  "cancelled",
];


/*
|--------------------------------------------------------------------------
| COMMON PARAMS
|--------------------------------------------------------------------------
*/

const followUpIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Follow-up ID must be a number.",
      "number.integer": "Follow-up ID must be an integer.",
      "number.positive": "Follow-up ID must be greater than 0.",
      "any.required": "Follow-up ID is required.",
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


const userIdParams = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "User ID must be a number.",
      "number.integer": "User ID must be an integer.",
      "number.positive": "User ID must be greater than 0.",
      "any.required": "User ID is required.",
    }),
});


/*
|--------------------------------------------------------------------------
| CREATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

const createFollowUpBody = Joi.object({
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

  assigned_to: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Assigned user ID must be a number.",
      "number.integer": "Assigned user ID must be an integer.",
      "number.positive": "Assigned user ID must be greater than 0.",
      "any.required": "Assigned user ID is required.",
    }),

  type: Joi.string()
    .valid(...FOLLOW_UP_TYPES)
    .default("call")
    .messages({
      "string.base": "Follow-up type must be a string.",
      "any.only": `Follow-up type must be one of: ${FOLLOW_UP_TYPES.join(
        ", "
      )}.`,
    }),

  title: Joi.string()
    .trim()
    .max(150)
    .required()
    .messages({
      "string.base": "Follow-up title must be a string.",
      "string.empty": "Follow-up title cannot be empty.",
      "string.max": "Follow-up title cannot exceed 150 characters.",
      "any.required": "Follow-up title is required.",
    }),

  description: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Follow-up description must be a string.",
    }),

  scheduled_at: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Scheduled date must be a valid date.",
      "date.format": "Scheduled date must be in ISO date format.",
      "any.required": "Scheduled date is required.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Status is intentionally NOT accepted from client
  |--------------------------------------------------------------------------
  | New follow-up always starts as pending.
  |--------------------------------------------------------------------------
  */

  completed_at: Joi.forbidden(),

  outcome: Joi.forbidden(),

  created_by: Joi.forbidden(),
});


/*
|--------------------------------------------------------------------------
| UPDATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

const updateFollowUpBody = Joi.object({
  assigned_to: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Assigned user ID must be a number.",
      "number.integer": "Assigned user ID must be an integer.",
      "number.positive": "Assigned user ID must be greater than 0.",
    }),

  type: Joi.string()
    .valid(...FOLLOW_UP_TYPES)
    .optional()
    .messages({
      "string.base": "Follow-up type must be a string.",
      "any.only": `Follow-up type must be one of: ${FOLLOW_UP_TYPES.join(
        ", "
      )}.`,
    }),

  title: Joi.string()
    .trim()
    .max(150)
    .optional()
    .messages({
      "string.base": "Follow-up title must be a string.",
      "string.empty": "Follow-up title cannot be empty.",
      "string.max": "Follow-up title cannot exceed 150 characters.",
    }),

  description: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Follow-up description must be a string.",
    }),

  scheduled_at: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Scheduled date must be a valid date.",
      "date.format": "Scheduled date must be in ISO date format.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected fields
  |--------------------------------------------------------------------------
  */

  lead_id: Joi.forbidden(),

  status: Joi.forbidden(),

  completed_at: Joi.forbidden(),

  outcome: Joi.forbidden(),

  created_by: Joi.forbidden(),
}).min(1).messages({
  "object.min": "At least one field is required to update the follow-up.",
});


/*
|--------------------------------------------------------------------------
| COMPLETE FOLLOW-UP
|--------------------------------------------------------------------------
*/

const completeFollowUpBody = Joi.object({
  outcome: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Follow-up outcome must be a string.",
    }),
});


/*
|--------------------------------------------------------------------------
| RESCHEDULE FOLLOW-UP
|--------------------------------------------------------------------------
*/

const rescheduleFollowUpBody = Joi.object({
  scheduled_at: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Scheduled date must be a valid date.",
      "date.format": "Scheduled date must be in ISO date format.",
      "any.required": "Scheduled date is required.",
    }),
});


/*
|--------------------------------------------------------------------------
| GET ALL FOLLOW-UPS
|--------------------------------------------------------------------------
*/

const getAllFollowUpsQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  leadId: Joi.number()
    .integer()
    .positive()
    .optional(),

  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional(),

  createdBy: Joi.number()
    .integer()
    .positive()
    .optional(),

  type: Joi.string()
    .valid(...FOLLOW_UP_TYPES)
    .optional(),

  status: Joi.string()
    .valid(...FOLLOW_UP_STATUSES)
    .optional(),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional(),

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

  sortBy: Joi.string()
    .valid(
      "id",
      "scheduled_at",
      "created_at",
      "updated_at",
      "status",
      "type",
      "completed_at"
    )
    .default("scheduled_at"),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("ASC"),
}).custom((value, helpers) => {
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
| GET FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
*/

const getFollowUpsByLeadQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  status: Joi.string()
    .valid(...FOLLOW_UP_STATUSES)
    .optional(),

  type: Joi.string()
    .valid(...FOLLOW_UP_TYPES)
    .optional(),

  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional(),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("ASC"),
});


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UPS BY USER
|--------------------------------------------------------------------------
*/

const getFollowUpsByUserQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  status: Joi.string()
    .valid(...FOLLOW_UP_STATUSES)
    .optional(),

  type: Joi.string()
    .valid(...FOLLOW_UP_TYPES)
    .optional(),

  fromDate: Joi.date()
    .iso()
    .optional(),

  toDate: Joi.date()
    .iso()
    .optional(),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("ASC"),
}).custom((value, helpers) => {
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
| UPCOMING FOLLOW-UPS QUERY
|--------------------------------------------------------------------------
*/

const upcomingFollowUpsQuery = Joi.object({
  fromDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "From date must be a valid date.",
      "date.format": "From date must be in ISO date format.",
      "any.required": "From date is required.",
    }),

  toDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "To date must be a valid date.",
      "date.format": "To date must be in ISO date format.",
      "any.required": "To date is required.",
    }),

  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional(),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
}).custom((value, helpers) => {
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
| OVERDUE FOLLOW-UPS QUERY
|--------------------------------------------------------------------------
*/

const overdueFollowUpsQuery = Joi.object({
  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional(),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
});


/*
|--------------------------------------------------------------------------
| TODAY'S FOLLOW-UPS QUERY
|--------------------------------------------------------------------------
*/

const todayFollowUpsQuery = Joi.object({
  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional(),
});


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  createFollowUp: {
    body: createFollowUpBody,
  },

  getFollowUpById: {
    params: followUpIdParams,
  },

  getAllFollowUps: {
    query: getAllFollowUpsQuery,
  },

  getFollowUpsByLead: {
    params: leadIdParams,
    query: getFollowUpsByLeadQuery,
  },

  getFollowUpsByUser: {
    params: userIdParams,
    query: getFollowUpsByUserQuery,
  },

  updateFollowUp: {
    params: followUpIdParams,
    body: updateFollowUpBody,
  },

  completeFollowUp: {
    params: followUpIdParams,
    body: completeFollowUpBody,
  },

  cancelFollowUp: {
    params: followUpIdParams,
  },

  rescheduleFollowUp: {
    params: followUpIdParams,
    body: rescheduleFollowUpBody,
  },

  deleteFollowUp: {
    params: followUpIdParams,
  },

  getUpcomingFollowUps: {
    query: upcomingFollowUpsQuery,
  },

  getOverdueFollowUps: {
    query: overdueFollowUpsQuery,
  },

  getTodayFollowUps: {
    query: todayFollowUpsQuery,
  },

  getLatestFollowUp: {
    params: leadIdParams,
  },

  getFollowUpCountByLead: {
    params: leadIdParams,
  },
};