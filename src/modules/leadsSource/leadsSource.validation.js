import Joi from "joi";

/*
|--------------------------------------------------------------------------
| CREATE LEAD SOURCE
|--------------------------------------------------------------------------
| POST /api/lead-sources
*/

export const createLeadSourceValidation = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Lead source name is required.",
        "string.min":
          "Lead source name must be at least 2 characters.",
        "string.max":
          "Lead source name cannot exceed 100 characters.",
        "any.required":
          "Lead source name is required.",
      }),

    code: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[A-Za-z0-9_-]+$/)
      .required()
      .messages({
        "string.empty": "Lead source code is required.",
        "string.min":
          "Lead source code must be at least 2 characters.",
        "string.max":
          "Lead source code cannot exceed 50 characters.",
        "string.pattern.base":
          "Lead source code can contain only letters, numbers, hyphens, and underscores.",
        "any.required":
          "Lead source code is required.",
      }),

    description: Joi.string()
      .trim()
      .max(255)
      .allow("", null)
      .optional()
      .messages({
        "string.max":
          "Description cannot exceed 255 characters.",
      }),

    status: Joi.string()
      .trim()
      .lowercase()
      .valid("active", "inactive")
      .default("active")
      .messages({
        "any.only":
          "Status must be either active or inactive.",
      }),
  }).unknown(false),
};


/*
|--------------------------------------------------------------------------
| GET ALL LEAD SOURCES
|--------------------------------------------------------------------------
| GET /api/lead-sources
|--------------------------------------------------------------------------
| Query Parameters:
| status
| search
| page
| limit
| order
| direction
*/

export const getLeadSourcesValidation = {
  query: Joi.object({
    status: Joi.string()
      .trim()
      .lowercase()
      .valid("active", "inactive")
      .optional()
      .messages({
        "any.only":
          "Status must be either active or inactive.",
      }),

    search: Joi.string()
      .trim()
      .max(100)
      .optional()
      .messages({
        "string.max":
          "Search cannot exceed 100 characters.",
      }),

    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional()
      .messages({
        "number.base":
          "Page must be a valid number.",
        "number.integer":
          "Page must be a positive integer.",
        "number.min":
          "Page must be a positive integer.",
      }),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .optional()
      .messages({
        "number.base":
          "Limit must be a valid number.",
        "number.integer":
          "Limit must be an integer.",
        "number.min":
          "Limit must be at least 1.",
        "number.max":
          "Limit cannot exceed 100.",
      }),

    order: Joi.string()
      .valid(
        "id",
        "name",
        "code",
        "created_at",
        "updated_at"
      )
      .default("created_at")
      .optional()
      .messages({
        "any.only":
          "Invalid sorting field.",
      }),

    direction: Joi.string()
      .trim()
      .uppercase()
      .valid("ASC", "DESC")
      .default("DESC")
      .optional()
      .messages({
        "any.only":
          "Direction must be either ASC or DESC.",
      }),
  }).unknown(false),
};


/*
|--------------------------------------------------------------------------
| GET LEAD SOURCE BY ID
|--------------------------------------------------------------------------
| GET /api/lead-sources/:id
*/

export const leadSourceIdValidation = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base":
          "Lead source ID must be a valid number.",
        "number.integer":
          "Lead source ID must be a valid integer.",
        "number.positive":
          "Lead source ID must be greater than 0.",
        "any.required":
          "Lead source ID is required.",
      }),
  }),
};


/*
|--------------------------------------------------------------------------
| UPDATE LEAD SOURCE
|--------------------------------------------------------------------------
| PUT /api/lead-sources/:id
*/

export const updateLeadSourceValidation = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base":
          "Lead source ID must be a valid number.",
        "number.integer":
          "Lead source ID must be a valid integer.",
        "number.positive":
          "Lead source ID must be greater than 0.",
        "any.required":
          "Lead source ID is required.",
      }),
  }),

  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional()
      .messages({
        "string.empty":
          "Lead source name cannot be empty.",
        "string.min":
          "Lead source name must be at least 2 characters.",
        "string.max":
          "Lead source name cannot exceed 100 characters.",
      }),

    code: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[A-Za-z0-9_-]+$/)
      .optional()
      .messages({
        "string.empty":
          "Lead source code cannot be empty.",
        "string.min":
          "Lead source code must be at least 2 characters.",
        "string.max":
          "Lead source code cannot exceed 50 characters.",
        "string.pattern.base":
          "Lead source code can contain only letters, numbers, hyphens, and underscores.",
      }),

    description: Joi.string()
      .trim()
      .max(255)
      .allow("", null)
      .optional()
      .messages({
        "string.max":
          "Description cannot exceed 255 characters.",
      }),

    status: Joi.string()
      .trim()
      .lowercase()
      .valid("active", "inactive")
      .optional()
      .messages({
        "any.only":
          "Status must be either active or inactive.",
      }),
  })
    .min(1)
    .unknown(false)
    .messages({
      "object.min":
        "At least one field is required for update.",
    }),
};


/*
|--------------------------------------------------------------------------
| CHANGE LEAD SOURCE STATUS
|--------------------------------------------------------------------------
| PATCH /api/lead-sources/:id/status
*/

export const changeLeadSourceStatusValidation = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base":
          "Lead source ID must be a valid number.",
        "number.integer":
          "Lead source ID must be a valid integer.",
        "number.positive":
          "Lead source ID must be greater than 0.",
        "any.required":
          "Lead source ID is required.",
      }),
  }),

  body: Joi.object({
    status: Joi.string()
      .trim()
      .lowercase()
      .valid("active", "inactive")
      .required()
      .messages({
        "string.empty":
          "Status is required.",
        "any.required":
          "Status is required.",
        "any.only":
          "Status must be either active or inactive.",
      }),
  }).unknown(false),
};


/*
|--------------------------------------------------------------------------
| DELETE LEAD SOURCE
|--------------------------------------------------------------------------
| DELETE /api/lead-sources/:id
*/

export const deleteLeadSourceValidation = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base":
          "Lead source ID must be a valid number.",
        "number.integer":
          "Lead source ID must be a valid integer.",
        "number.positive":
          "Lead source ID must be greater than 0.",
        "any.required":
          "Lead source ID is required.",
      }),
  }),
};