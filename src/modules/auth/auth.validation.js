import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(150)
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.max": "Email cannot exceed 150 characters.",
      "any.required": "Email is required.",
      "string.empty": "Email is required.",
    }),

  password: Joi.string()
    .min(6)
    .max(255)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters.",
      "string.max": "Password cannot exceed 255 characters.",
      "any.required": "Password is required.",
      "string.empty": "Password is required.",
    }),
});