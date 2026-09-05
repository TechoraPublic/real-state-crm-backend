import Joi from "joi";


/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const CUSTOMER_STATUSES = [
  "active",
  "inactive",
];

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site_visit",
  "negotiation",
  "won",
  "lost",
  "on_hold",
];

const LEAD_PRIORITIES = [
  "low",
  "medium",
  "high",
];

const SORT_ORDERS = [
  "ASC",
  "DESC",
];

const SORT_FIELDS = [
  "id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "city",
  "state",
  "status",
  "created_at",
  "updated_at",
];


/*
|--------------------------------------------------------------------------
| CUSTOMER ID PARAMS
|--------------------------------------------------------------------------
| Used by:
| GET    /customers/:id
| PUT    /customers/:id
| PATCH  /customers/:id/status
| DELETE /customers/:id
|--------------------------------------------------------------------------
*/

const customerIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Customer ID must be a number.",
      "number.integer": "Customer ID must be an integer.",
      "number.positive": "Customer ID must be greater than 0.",
      "any.required": "Customer ID is required.",
    }),
});


/*
|--------------------------------------------------------------------------
| CREATE CUSTOMER
|--------------------------------------------------------------------------
*/

const createCustomerBody = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "First name must be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least 2 characters.",
      "string.max": "First name cannot exceed 100 characters.",
      "any.required": "First name is required.",
    }),

  last_name: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Last name must be a string.",
      "string.max": "Last name cannot exceed 100 characters.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Please provide a valid email address.",
      "string.max": "Email cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .required()
    .messages({
      "string.base": "Phone number must be a string.",
      "string.empty": "Phone number cannot be empty.",
      "string.min": "Phone number must be at least 7 characters.",
      "string.max": "Phone number cannot exceed 20 characters.",
      "any.required": "Phone number is required.",
    }),

  alternate_phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Alternate phone number must be a string.",
      "string.min": "Alternate phone number must be at least 7 characters.",
      "string.max": "Alternate phone number cannot exceed 20 characters.",
    }),

  address: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Address must be a string.",
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "City must be a string.",
      "string.max": "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "State must be a string.",
      "string.max": "State cannot exceed 100 characters.",
    }),

  country: Joi.string()
    .trim()
    .max(100)
    .default("India")
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Country must be a string.",
      "string.max": "Country cannot exceed 100 characters.",
    }),

  pincode: Joi.string()
    .trim()
    .max(10)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Pincode must be a string.",
      "string.max": "Pincode cannot exceed 10 characters.",
    }),

  notes: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Notes must be a string.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  id: Joi.forbidden(),

  company_id: Joi.forbidden(),

  status: Joi.forbidden(),

  created_at: Joi.forbidden(),

  updated_at: Joi.forbidden(),
});


/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER
|--------------------------------------------------------------------------
|
| All editable fields are optional.
| At least one field must be provided.
|--------------------------------------------------------------------------
*/

const updateCustomerBody = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      "string.base": "First name must be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least 2 characters.",
      "string.max": "First name cannot exceed 100 characters.",
    }),

  last_name: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Last name must be a string.",
      "string.max": "Last name cannot exceed 100 characters.",
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(150)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Please provide a valid email address.",
      "string.max": "Email cannot exceed 150 characters.",
    }),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .optional()
    .messages({
      "string.base": "Phone number must be a string.",
      "string.empty": "Phone number cannot be empty.",
      "string.min": "Phone number must be at least 7 characters.",
      "string.max": "Phone number cannot exceed 20 characters.",
    }),

  alternate_phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Alternate phone number must be a string.",
      "string.min": "Alternate phone number must be at least 7 characters.",
      "string.max": "Alternate phone number cannot exceed 20 characters.",
    }),

  address: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Address must be a string.",
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "City must be a string.",
      "string.max": "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "State must be a string.",
      "string.max": "State cannot exceed 100 characters.",
    }),

  country: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Country must be a string.",
      "string.max": "Country cannot exceed 100 characters.",
    }),

  pincode: Joi.string()
    .trim()
    .max(10)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Pincode must be a string.",
      "string.max": "Pincode cannot exceed 10 characters.",
    }),

  notes: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Notes must be a string.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  id: Joi.forbidden(),

  company_id: Joi.forbidden(),

  status: Joi.forbidden(),

  created_at: Joi.forbidden(),

  updated_at: Joi.forbidden(),
}).min(1).messages({
  "object.min": "At least one field is required to update the customer.",
});


/*
|--------------------------------------------------------------------------
| CHANGE CUSTOMER STATUS
|--------------------------------------------------------------------------
*/

const changeCustomerStatusBody = Joi.object({
  status: Joi.string()
    .valid(...CUSTOMER_STATUSES)
    .required()
    .messages({
      "any.only": `Customer status must be one of: ${CUSTOMER_STATUSES.join(", ")}.`,
      "any.required": "Customer status is required.",
      "string.base": "Customer status must be a string.",
    }),
});


/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMERS
|--------------------------------------------------------------------------
|
| Example:
| GET /customers?page=1&limit=20&search=akash&status=active
|--------------------------------------------------------------------------
*/

const getAllCustomersQuery = Joi.object({
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

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional()
    .messages({
      "string.base": "Search must be a string.",
      "string.max": "Search cannot exceed 150 characters.",
    }),

  status: Joi.string()
    .valid(...CUSTOMER_STATUSES)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${CUSTOMER_STATUSES.join(", ")}.`,
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.base": "City must be a string.",
      "string.max": "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.base": "State must be a string.",
      "string.max": "State cannot exceed 100 characters.",
    }),

  sortBy: Joi.string()
    .valid(...SORT_FIELDS)
    .default("created_at")
    .messages({
      "any.only": `Sort field must be one of: ${SORT_FIELDS.join(", ")}.`,
    }),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .insensitive()
    .default("DESC")
    .messages({
      "any.only": "Sort order must be ASC or DESC.",
    }),
});


/*
|--------------------------------------------------------------------------
| GET CUSTOMER LEADS
|--------------------------------------------------------------------------
|
| GET /customers/:id/leads
|--------------------------------------------------------------------------
*/

const getCustomerLeadsQuery = Joi.object({
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
    .valid(...LEAD_STATUSES)
    .optional()
    .messages({
      "any.only": `Lead status must be one of: ${LEAD_STATUSES.join(", ")}.`,
    }),

  priority: Joi.string()
    .valid(...LEAD_PRIORITIES)
    .optional()
    .messages({
      "any.only": `Lead priority must be one of: ${LEAD_PRIORITIES.join(", ")}.`,
    }),

  sortOrder: Joi.string()
    .valid(...SORT_ORDERS)
    .insensitive()
    .default("DESC"),
});


/*
|--------------------------------------------------------------------------
| EXPORT VALIDATION SCHEMAS
|--------------------------------------------------------------------------
*/

export default {
  createCustomer: {
    body: createCustomerBody,
  },

  getCustomerById: {
    params: customerIdParams,
  },

  getAllCustomers: {
    query: getAllCustomersQuery,
  },

  updateCustomer: {
    params: customerIdParams,
    body: updateCustomerBody,
  },

  changeCustomerStatus: {
    params: customerIdParams,
    body: changeCustomerStatusBody,
  },

  deleteCustomer: {
    params: customerIdParams,
  },

  getCustomerLeads: {
    params: customerIdParams,
    query: getCustomerLeadsQuery,
  },
};