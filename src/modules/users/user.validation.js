import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Fields
|--------------------------------------------------------------------------
*/

const idSchema = Joi.number()
  .integer()
  .positive()
  .messages({
    "number.base": "ID must be a number.",
    "number.integer": "ID must be an integer.",
    "number.positive": "ID must be a positive number.",
  });

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email()
  .max(150)
  .messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.max": "Email cannot exceed 150 characters.",
  });

const passwordSchema = Joi.string()
  .min(6)
  .max(255)
  .messages({
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password cannot exceed 255 characters.",
    "string.empty": "Password is required.",
  });

/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
*/

export const createUserSchema = Joi.object({
  company_id: idSchema
    .allow(null)
    .optional(),

  role_id: idSchema.required().messages({
    "any.required": "Role is required.",
  }),

  first_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters.",
      "string.max": "First name cannot exceed 100 characters.",
      "any.required": "First name is required.",
    }),

  last_name: Joi.string()
    .trim()
    .max(100)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Last name cannot exceed 100 characters.",
    }),

  email: emailSchema.required().messages({
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
  }),

  phone: Joi.string()
    .trim()
    .max(20)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Phone cannot exceed 20 characters.",
    }),

  password: passwordSchema.required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password is required.",
  }),

  status: Joi.string()
    .valid("active", "inactive")
    .default("active")
    .messages({
      "any.only": "Status must be either active or inactive.",
    }),
});

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

export const updateUserSchema = Joi.object({
  company_id: idSchema
    .allow(null)
    .optional(),

  role_id: idSchema
    .optional(),

  first_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      "string.min": "First name must be at least 2 characters.",
      "string.max": "First name cannot exceed 100 characters.",
    }),

  last_name: Joi.string()
    .trim()
    .max(100)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Last name cannot exceed 100 characters.",
    }),

  email: emailSchema.optional(),

  phone: Joi.string()
    .trim()
    .max(20)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Phone cannot exceed 20 characters.",
    }),

  password: passwordSchema.optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional()
    .messages({
      "any.only": "Status must be either active or inactive.",
    }),
});

/*
|--------------------------------------------------------------------------
| UPDATE PASSWORD
|--------------------------------------------------------------------------
*/

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      "string.empty": "Current password is required.",
      "any.required": "Current password is required.",
    }),

  newPassword: passwordSchema
    .required()
    .messages({
      "any.required": "New password is required.",
      "string.empty": "New password is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| CHANGE USER STATUS
|--------------------------------------------------------------------------
*/

export const changeStatusSchema = Joi.object({
  status: Joi.string()
    .valid("active", "inactive")
    .required()
    .messages({
      "any.only": "Status must be either active or inactive.",
      "any.required": "Status is required.",
      "string.empty": "Status is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| USER ID PARAM
|--------------------------------------------------------------------------
*/

export const userIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "User ID is required.",
  }),
});