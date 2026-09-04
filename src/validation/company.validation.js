import Joi from "joi";

/**
 * Create Company Validation
 */
export const createCompanyValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      "string.empty": "Company name is required.",
      "string.min": "Company name must be at least 2 characters.",
      "string.max": "Company name cannot exceed 150 characters.",
      "any.required": "Company name is required.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow("", null)
    .messages({
      "string.email": "Please provide a valid company email.",
      "string.max": "Company email cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .max(20)
    .allow("", null)
    .messages({
      "string.max": "Phone number cannot exceed 20 characters.",
    }),

  address: Joi.string()
    .trim()
    .max(1000)
    .allow("", null),

  city: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  state: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  country: Joi.string()
    .trim()
    .max(100)
    .default("India")
    .allow("", null),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .messages({
      "any.only": "Status must be either active or inactive.",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});


/**
 * Update Company Validation
 */
export const updateCompanyValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .messages({
      "string.empty": "Company name cannot be empty.",
      "string.min": "Company name must be at least 2 characters.",
      "string.max": "Company name cannot exceed 150 characters.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow("", null)
    .messages({
      "string.email": "Please provide a valid company email.",
      "string.max": "Company email cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .max(20)
    .allow("", null)
    .messages({
      "string.max": "Phone number cannot exceed 20 characters.",
    }),

  address: Joi.string()
    .trim()
    .max(1000)
    .allow("", null),

  city: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  state: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  country: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  status: Joi.string()
    .valid("active", "inactive")
    .messages({
      "any.only": "Status must be either active or inactive.",
    }),
}).min(1).options({
  abortEarly: false,
  stripUnknown: true,
});


/**
 * Company ID Validation
 */
export const companyIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Company ID must be a number.",
      "number.integer": "Company ID must be an integer.",
      "number.positive": "Company ID must be a positive number.",
      "any.required": "Company ID is required.",
    }),
});


/**
 * Get Companies Query Validation
 */
export const getCompaniesValidation = Joi.object({
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
    .default(10)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .default(""),

  status: Joi.string()
    .valid("active", "inactive")
    .messages({
      "any.only": "Status must be either active or inactive.",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});