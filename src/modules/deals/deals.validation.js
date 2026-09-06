import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const DEAL_STAGES = [
  "initial",
  "negotiation",
  "documentation",
  "closed",
];

const DEAL_STATUSES = [
  "open",
  "won",
  "lost",
  "cancelled",
];

const SORT_ORDERS = [
  "ASC",
  "DESC",
];

/*
|--------------------------------------------------------------------------
| Common Helpers
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

const optionalPositiveId = (
  fieldName
) =>
  Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": `${fieldName} must be a number.`,
      "number.integer": `${fieldName} must be an integer.`,
      "number.positive": `${fieldName} must be a positive integer.`,
    });

const optionalNonNegativeNumber = (
  fieldName
) =>
  Joi.number()
    .min(0)
    .optional()
    .allow(null)
    .messages({
      "number.base": `${fieldName} must be a number.`,
      "number.min": `${fieldName} cannot be negative.`,
    });

const optionalDate = (
  fieldName
) =>
  Joi.date()
    .iso()
    .optional()
    .allow(null)
    .messages({
      "date.base": `${fieldName} must be a valid date.`,
      "date.format": `${fieldName} must be in ISO date format.`,
    });

/*
|--------------------------------------------------------------------------
| Create Deal
|--------------------------------------------------------------------------
*/

const createDealBody = Joi.object({
  lead_id: positiveId(
    "Lead ID"
  ),

  customer_id: positiveId(
    "Customer ID"
  ),

  property_id: positiveId(
    "Property ID"
  ),

  assigned_to: positiveId(
    "Assigned user ID"
  ),

  deal_value:
    optionalNonNegativeNumber(
      "Deal value"
    ),

  stage: Joi.string()
    .valid(...DEAL_STAGES)
    .optional()
    .default("initial")
    .messages({
      "string.base":
        "Deal stage must be a string.",

      "any.only":
        `Deal stage must be one of: ${DEAL_STAGES.join(
          ", "
        )}.`,
    }),

  expected_close_date:
    optionalDate(
      "Expected close date"
    ),

  notes: Joi.string()
    .trim()
    .max(5000)
    .optional()
    .allow(null, "")
    .messages({
      "string.base":
        "Notes must be a string.",

      "string.max":
        "Notes cannot exceed 5000 characters.",
    }),
});

/*
|--------------------------------------------------------------------------
| Update Deal
|--------------------------------------------------------------------------
*/

const updateDealBody = Joi.object({
  lead_id:
    optionalPositiveId(
      "Lead ID"
    ),

  customer_id:
    optionalPositiveId(
      "Customer ID"
    ),

  property_id:
    optionalPositiveId(
      "Property ID"
    ),

  assigned_to:
    optionalPositiveId(
      "Assigned user ID"
    ),

  deal_value:
    optionalNonNegativeNumber(
      "Deal value"
    ),

  expected_close_date:
    optionalDate(
      "Expected close date"
    ),

  notes: Joi.string()
    .trim()
    .max(5000)
    .optional()
    .allow(null, "")
    .messages({
      "string.base":
        "Notes must be a string.",

      "string.max":
        "Notes cannot exceed 5000 characters.",
    }),
}).min(1);

/*
|--------------------------------------------------------------------------
| Change Deal Stage
|--------------------------------------------------------------------------
*/

const changeDealStageBody =
  Joi.object({
    stage: Joi.string()
      .valid(...DEAL_STAGES)
      .required()
      .messages({
        "string.base":
          "Deal stage must be a string.",

        "string.empty":
          "Deal stage is required.",

        "any.only":
          `Deal stage must be one of: ${DEAL_STAGES.join(
            ", "
          )}.`,

        "any.required":
          "Deal stage is required.",
      }),
  });

/*
|--------------------------------------------------------------------------
| Change Deal Status
|--------------------------------------------------------------------------
*/

const changeDealStatusBody =
  Joi.object({
    status: Joi.string()
      .valid(...DEAL_STATUSES)
      .required()
      .messages({
        "string.base":
          "Deal status must be a string.",

        "string.empty":
          "Deal status is required.",

        "any.only":
          `Deal status must be one of: ${DEAL_STATUSES.join(
            ", "
          )}.`,

        "any.required":
          "Deal status is required.",
      }),

    lost_reason: Joi.string()
      .trim()
      .max(255)
      .optional()
      .allow(null, "")
      .messages({
        "string.base":
          "Lost reason must be a string.",

        "string.max":
          "Lost reason cannot exceed 255 characters.",
      }),
  });

/*
|--------------------------------------------------------------------------
| Deal ID Params
|--------------------------------------------------------------------------
*/

const dealIdParams = Joi.object({
  id: positiveId(
    "Deal ID"
  ),
});

/*
|--------------------------------------------------------------------------
| Lead ID Params
|--------------------------------------------------------------------------
*/

const leadIdParams = Joi.object({
  leadId: positiveId(
    "Lead ID"
  ),
});

/*
|--------------------------------------------------------------------------
| Customer ID Params
|--------------------------------------------------------------------------
*/

const customerIdParams = Joi.object({
  customerId: positiveId(
    "Customer ID"
  ),
});

/*
|--------------------------------------------------------------------------
| Get All Deals Query
|--------------------------------------------------------------------------
*/

const getAllDealsQuery =
  Joi.object({
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

    search: Joi.string()
      .trim()
      .max(150)
      .optional()
      .allow("")
      .messages({
        "string.base":
          "Search must be a string.",

        "string.max":
          "Search cannot exceed 150 characters.",
      }),

    leadId:
      optionalPositiveId(
        "Lead ID"
      ),

    customerId:
      optionalPositiveId(
        "Customer ID"
      ),

    propertyId:
      optionalPositiveId(
        "Property ID"
      ),

    assignedTo:
      optionalPositiveId(
        "Assigned user ID"
      ),

    stage: Joi.string()
      .valid(...DEAL_STAGES)
      .optional()
      .messages({
        "string.base":
          "Deal stage must be a string.",

        "any.only":
          `Deal stage must be one of: ${DEAL_STAGES.join(
            ", "
          )}.`,
      }),

    status: Joi.string()
      .valid(...DEAL_STATUSES)
      .optional()
      .messages({
        "string.base":
          "Deal status must be a string.",

        "any.only":
          `Deal status must be one of: ${DEAL_STATUSES.join(
            ", "
          )}.`,
      }),

    fromDate:
      optionalDate(
        "From date"
      ),

    toDate:
      optionalDate(
        "To date"
      ),

    minValue:
      optionalNonNegativeNumber(
        "Minimum deal value"
      ),

    maxValue:
      optionalNonNegativeNumber(
        "Maximum deal value"
      ),

    sortBy: Joi.string()
      .valid(
        "created_at",
        "updated_at",
        "deal_value",
        "expected_close_date",
        "closed_at",
        "stage",
        "status"
      )
      .optional()
      .default("created_at")
      .messages({
        "string.base":
          "Sort field must be a string.",

        "any.only":
          "Invalid sort field.",
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
| Get Deals By Lead Query
|--------------------------------------------------------------------------
*/

const getDealsByLeadQuery =
  Joi.object({
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
| Get Deals By Customer Query
|--------------------------------------------------------------------------
*/

const getDealsByCustomerQuery =
  Joi.object({
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
      .valid(...DEAL_STATUSES)
      .optional()
      .messages({
        "string.base":
          "Deal status must be a string.",

        "any.only":
          `Deal status must be one of: ${DEAL_STATUSES.join(
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
| Export Validation Object
|--------------------------------------------------------------------------
*/

const dealValidation = {
  createDeal: {
    body: createDealBody,
  },

  updateDeal: {
    params: dealIdParams,
    body: updateDealBody,
  },

  changeDealStage: {
    params: dealIdParams,
    body: changeDealStageBody,
  },

  changeDealStatus: {
    params: dealIdParams,
    body: changeDealStatusBody,
  },

  getDealById: {
    params: dealIdParams,
  },

  deleteDeal: {
    params: dealIdParams,
  },

  getAllDeals: {
    query: getAllDealsQuery,
  },

  getDealsByLead: {
    params: leadIdParams,
    query: getDealsByLeadQuery,
  },

  getDealsByCustomer: {
    params: customerIdParams,
    query: getDealsByCustomerQuery,
  },
};

export default dealValidation;