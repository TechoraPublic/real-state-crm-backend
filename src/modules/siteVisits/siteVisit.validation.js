import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const SITE_VISIT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const SORT_ORDERS = [
  "ASC",
  "DESC",
];

/*
|--------------------------------------------------------------------------
| Common ID Validation
|--------------------------------------------------------------------------
*/

const positiveId = (fieldName) =>
  Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": `${fieldName} must be a number.`,
      "number.integer": `${fieldName} must be an integer.`,
      "number.positive": `${fieldName} must be a positive integer.`,
      "any.required": `${fieldName} is required.`,
    });

/*
|--------------------------------------------------------------------------
| CREATE SITE VISIT
|--------------------------------------------------------------------------
| POST /api/v1/site-visits
|--------------------------------------------------------------------------
*/

const createSiteVisitBody = Joi.object({
  lead_id: positiveId("Lead ID"),

  property_id: positiveId("Property ID"),

  assigned_to: positiveId("Assigned user ID"),

  scheduled_at: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base":
        "Scheduled date and time must be a valid date.",
      "date.format":
        "Scheduled date and time must be in a valid ISO date format.",
      "any.required":
        "Scheduled date and time are required.",
    }),

  notes: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Notes must be a string.",
      "string.max":
        "Notes cannot exceed 5000 characters.",
    }),
});

/*
|--------------------------------------------------------------------------
| UPDATE SITE VISIT
|--------------------------------------------------------------------------
| PUT /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

const updateSiteVisitBody = Joi.object({
  property_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Property ID must be a number.",
      "number.integer":
        "Property ID must be an integer.",
      "number.positive":
        "Property ID must be a positive integer.",
    }),

  assigned_to: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Assigned user ID must be a number.",
      "number.integer":
        "Assigned user ID must be an integer.",
      "number.positive":
        "Assigned user ID must be a positive integer.",
    }),

  scheduled_at: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base":
        "Scheduled date and time must be a valid date.",
      "date.format":
        "Scheduled date and time must be in a valid ISO date format.",
    }),

  notes: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Notes must be a string.",
      "string.max":
        "Notes cannot exceed 5000 characters.",
    }),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field is required to update the site visit.",
  });

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/site-visits/:id/status
|--------------------------------------------------------------------------
*/

const changeSiteVisitStatusBody = Joi.object({
  status: Joi.string()
    .valid(...SITE_VISIT_STATUSES)
    .required()
    .messages({
      "string.base":
        "Site visit status must be a string.",

      "any.only":
        `Site visit status must be one of: ${SITE_VISIT_STATUSES.join(
          ", "
        )}.`,

      "any.required":
        "Site visit status is required.",
    }),

  outcome: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Outcome must be a string.",

      "string.max":
        "Outcome cannot exceed 5000 characters.",
    }),
});

/*
|--------------------------------------------------------------------------
| SITE VISIT ID PARAM
|--------------------------------------------------------------------------
*/

const siteVisitIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base":
        "Site visit ID must be a number.",

      "number.integer":
        "Site visit ID must be an integer.",

      "number.positive":
        "Site visit ID must be a positive integer.",

      "any.required":
        "Site visit ID is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| LEAD ID PARAM
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/lead/:leadId
|--------------------------------------------------------------------------
*/

const leadIdParams = Joi.object({
  leadId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base":
        "Lead ID must be a number.",

      "number.integer":
        "Lead ID must be an integer.",

      "number.positive":
        "Lead ID must be a positive integer.",

      "any.required":
        "Lead ID is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| PROPERTY ID PARAM
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/property/:propertyId
|--------------------------------------------------------------------------
*/

const propertyIdParams = Joi.object({
  propertyId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base":
        "Property ID must be a number.",

      "number.integer":
        "Property ID must be an integer.",

      "number.positive":
        "Property ID must be a positive integer.",

      "any.required":
        "Property ID is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| GET ALL SITE VISITS QUERY
|--------------------------------------------------------------------------
| GET /api/v1/site-visits
|--------------------------------------------------------------------------
*/

const getAllSiteVisitsQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base":
        "Page must be a number.",

      "number.integer":
        "Page must be an integer.",

      "number.min":
        "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base":
        "Limit must be a number.",

      "number.integer":
        "Limit must be an integer.",

      "number.min":
        "Limit must be at least 1.",

      "number.max":
        "Limit cannot exceed 100.",
    }),

  status: Joi.string()
    .valid(...SITE_VISIT_STATUSES)
    .optional()
    .messages({
      "string.base":
        "Site visit status must be a string.",

      "any.only":
        `Site visit status must be one of: ${SITE_VISIT_STATUSES.join(
          ", "
        )}.`,
    }),

  leadId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Lead ID must be a number.",

      "number.integer":
        "Lead ID must be an integer.",

      "number.positive":
        "Lead ID must be a positive integer.",
    }),

  propertyId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Property ID must be a number.",

      "number.integer":
        "Property ID must be an integer.",

      "number.positive":
        "Property ID must be a positive integer.",
    }),

  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Assigned user ID must be a number.",

      "number.integer":
        "Assigned user ID must be an integer.",

      "number.positive":
        "Assigned user ID must be a positive integer.",
    }),

  fromDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base":
        "From date must be a valid date.",

      "date.format":
        "From date must be in a valid ISO date format.",
    }),

  toDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base":
        "To date must be a valid date.",

      "date.format":
        "To date must be in a valid ISO date format.",
    }),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .insensitive()
    .default("DESC")
    .messages({
      "string.base":
        "Sort order must be a string.",

      "any.only":
        "Sort order must be ASC or DESC.",
    }),
});

/*
|--------------------------------------------------------------------------
| LEAD SITE VISITS QUERY
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/lead/:leadId
|--------------------------------------------------------------------------
*/

const getSiteVisitsByLeadQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base":
        "Page must be a number.",

      "number.integer":
        "Page must be an integer.",

      "number.min":
        "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base":
        "Limit must be a number.",

      "number.integer":
        "Limit must be an integer.",

      "number.min":
        "Limit must be at least 1.",

      "number.max":
        "Limit cannot exceed 100.",
    }),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .insensitive()
    .default("DESC")
    .messages({
      "string.base":
        "Sort order must be a string.",

      "any.only":
        "Sort order must be ASC or DESC.",
    }),
});

/*
|--------------------------------------------------------------------------
| PROPERTY SITE VISITS QUERY
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/property/:propertyId
|--------------------------------------------------------------------------
*/

const getSiteVisitsByPropertyQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base":
        "Page must be a number.",

      "number.integer":
        "Page must be an integer.",

      "number.min":
        "Page must be at least 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      "number.base":
        "Limit must be a number.",

      "number.integer":
        "Limit must be an integer.",

      "number.min":
        "Limit must be at least 1.",

      "number.max":
        "Limit cannot exceed 100.",
    }),

  status: Joi.string()
    .valid(...SITE_VISIT_STATUSES)
    .optional()
    .messages({
      "string.base":
        "Site visit status must be a string.",

      "any.only":
        `Site visit status must be one of: ${SITE_VISIT_STATUSES.join(
          ", "
        )}.`,
    }),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .insensitive()
    .default("DESC")
    .messages({
      "string.base":
        "Sort order must be a string.",

      "any.only":
        "Sort order must be ASC or DESC.",
    }),
});

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

const siteVisitValidation = {
  createSiteVisit: {
    body: createSiteVisitBody,
  },

  updateSiteVisit: {
    params: siteVisitIdParams,
    body: updateSiteVisitBody,
  },

  changeSiteVisitStatus: {
    params: siteVisitIdParams,
    body: changeSiteVisitStatusBody,
  },

  getSiteVisitById: {
    params: siteVisitIdParams,
  },

  deleteSiteVisit: {
    params: siteVisitIdParams,
  },

  getAllSiteVisits: {
    query: getAllSiteVisitsQuery,
  },

  getSiteVisitsByLead: {
    params: leadIdParams,
    query: getSiteVisitsByLeadQuery,
  },

  getSiteVisitsByProperty: {
    params: propertyIdParams,
    query: getSiteVisitsByPropertyQuery,
  },
};

export default siteVisitValidation;