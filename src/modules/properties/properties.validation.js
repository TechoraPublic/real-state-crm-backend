import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const PROPERTY_TYPES = [
  "residential",
  "commercial",
  "plot",
  "land",
  "other",
];

const LISTING_TYPES = [
  "sale",
  "rent",
  "lease",
];

const PROPERTY_STATUSES = [
  "available",
  "sold",
  "rented",
  "inactive",
];

const AREA_UNITS = [
  "sqft",
  "sqm",
  "sqyd",
  "acre",
  "bigha",
];

/*
|--------------------------------------------------------------------------
| Common Parameters
|--------------------------------------------------------------------------
*/

const propertyIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base":
        "Property ID must be a number.",
      "number.integer":
        "Property ID must be an integer.",
      "number.positive":
        "Property ID must be greater than 0.",
      "any.required":
        "Property ID is required.",
    }),
});

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
*/

const createPropertyBody = Joi.object({
  property_code: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      "string.base":
        "Property code must be a string.",
      "string.empty":
        "Property code is required.",
      "string.max":
        "Property code cannot exceed 50 characters.",
      "any.required":
        "Property code is required.",
    }),

  title: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      "string.base":
        "Property title must be a string.",
      "string.empty":
        "Property title is required.",
      "string.max":
        "Property title cannot exceed 200 characters.",
      "any.required":
        "Property title is required.",
    }),

  property_type: Joi.string()
    .valid(...PROPERTY_TYPES)
    .required()
    .messages({
      "string.base":
        "Property type must be a string.",
      "any.only":
        `Property type must be one of: ${PROPERTY_TYPES.join(", ")}.`,
      "any.required":
        "Property type is required.",
    }),

  listing_type: Joi.string()
    .valid(...LISTING_TYPES)
    .default("sale")
    .messages({
      "string.base":
        "Listing type must be a string.",
      "any.only":
        `Listing type must be one of: ${LISTING_TYPES.join(", ")}.`,
    }),

  description: Joi.string()
    .trim()
    .max(10000)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Description must be a string.",
      "string.max":
        "Description cannot exceed 10000 characters.",
    }),

  price: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Price must be a number.",
      "number.min":
        "Price cannot be negative.",
      "number.precision":
        "Price can have maximum 2 decimal places.",
    }),

  address: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Address must be a string.",
      "string.max":
        "Address cannot exceed 255 characters.",
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "City must be a string.",
      "string.max":
        "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "State must be a string.",
      "string.max":
        "State cannot exceed 100 characters.",
    }),

  country: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .default("India")
    .messages({
      "string.base":
        "Country must be a string.",
      "string.max":
        "Country cannot exceed 100 characters.",
    }),

  pincode: Joi.string()
    .trim()
    .max(10)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Pincode must be a string.",
      "string.max":
        "Pincode cannot exceed 10 characters.",
    }),

  bedrooms: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Bedrooms must be a number.",
      "number.integer":
        "Bedrooms must be an integer.",
      "number.min":
        "Bedrooms cannot be negative.",
    }),

  bathrooms: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Bathrooms must be a number.",
      "number.integer":
        "Bathrooms must be an integer.",
      "number.min":
        "Bathrooms cannot be negative.",
    }),

  area: Joi.number()
    .greater(0)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Area must be a number.",
      "number.greater":
        "Area must be greater than 0.",
      "number.precision":
        "Area can have maximum 2 decimal places.",
    }),

  area_unit: Joi.string()
    .valid(...AREA_UNITS)
    .default("sqft")
    .messages({
      "string.base":
        "Area unit must be a string.",
      "any.only":
        `Area unit must be one of: ${AREA_UNITS.join(", ")}.`,
    }),

  amenities: Joi.object()
    .allow(null)
    .optional()
    .messages({
      "object.base":
        "Amenities must be a valid object.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  |
  | These fields are controlled by backend/JWT.
  |
  */

  company_id: Joi.forbidden(),

  status: Joi.forbidden(),

  created_by: Joi.forbidden(),

  updated_by: Joi.forbidden(),

  id: Joi.forbidden(),

  created_at: Joi.forbidden(),

  updated_at: Joi.forbidden(),
});

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
*/

const updatePropertyBody = Joi.object({
  property_code: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      "string.base":
        "Property code must be a string.",
      "string.empty":
        "Property code cannot be empty.",
      "string.max":
        "Property code cannot exceed 50 characters.",
    }),

  title: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      "string.base":
        "Property title must be a string.",
      "string.empty":
        "Property title cannot be empty.",
      "string.max":
        "Property title cannot exceed 200 characters.",
    }),

  property_type: Joi.string()
    .valid(...PROPERTY_TYPES)
    .optional()
    .messages({
      "string.base":
        "Property type must be a string.",
      "any.only":
        `Property type must be one of: ${PROPERTY_TYPES.join(", ")}.`,
    }),

  listing_type: Joi.string()
    .valid(...LISTING_TYPES)
    .optional()
    .messages({
      "string.base":
        "Listing type must be a string.",
      "any.only":
        `Listing type must be one of: ${LISTING_TYPES.join(", ")}.`,
    }),

  description: Joi.string()
    .trim()
    .max(10000)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Description must be a string.",
      "string.max":
        "Description cannot exceed 10000 characters.",
    }),

  price: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Price must be a number.",
      "number.min":
        "Price cannot be negative.",
      "number.precision":
        "Price can have maximum 2 decimal places.",
    }),

  address: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Address must be a string.",
      "string.max":
        "Address cannot exceed 255 characters.",
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "City must be a string.",
      "string.max":
        "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "State must be a string.",
      "string.max":
        "State cannot exceed 100 characters.",
    }),

  country: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Country must be a string.",
      "string.max":
        "Country cannot exceed 100 characters.",
    }),

  pincode: Joi.string()
    .trim()
    .max(10)
    .allow(null, "")
    .optional()
    .messages({
      "string.base":
        "Pincode must be a string.",
      "string.max":
        "Pincode cannot exceed 10 characters.",
    }),

  bedrooms: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Bedrooms must be a number.",
      "number.integer":
        "Bedrooms must be an integer.",
      "number.min":
        "Bedrooms cannot be negative.",
    }),

  bathrooms: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Bathrooms must be a number.",
      "number.integer":
        "Bathrooms must be an integer.",
      "number.min":
        "Bathrooms cannot be negative.",
    }),

  area: Joi.number()
    .greater(0)
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "Area must be a number.",
      "number.greater":
        "Area must be greater than 0.",
      "number.precision":
        "Area can have maximum 2 decimal places.",
    }),

  area_unit: Joi.string()
    .valid(...AREA_UNITS)
    .optional()
    .messages({
      "string.base":
        "Area unit must be a string.",
      "any.only":
        `Area unit must be one of: ${AREA_UNITS.join(", ")}.`,
    }),

  amenities: Joi.object()
    .allow(null)
    .optional()
    .messages({
      "object.base":
        "Amenities must be a valid object.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  company_id: Joi.forbidden(),

  status: Joi.forbidden(),

  created_by: Joi.forbidden(),

  updated_by: Joi.forbidden(),

  id: Joi.forbidden(),

  created_at: Joi.forbidden(),

  updated_at: Joi.forbidden(),
})
  .min(1)
  .messages({
    "object.min":
      "At least one property field is required for update.",
  });

/*
|--------------------------------------------------------------------------
| CHANGE PROPERTY STATUS
|--------------------------------------------------------------------------
*/

const changePropertyStatusBody = Joi.object({
  status: Joi.string()
    .valid(...PROPERTY_STATUSES)
    .required()
    .messages({
      "string.base":
        "Property status must be a string.",
      "any.only":
        `Property status must be one of: ${PROPERTY_STATUSES.join(", ")}.`,
      "any.required":
        "Property status is required.",
    }),

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  id: Joi.forbidden(),

  company_id: Joi.forbidden(),

  created_by: Joi.forbidden(),

  updated_by: Joi.forbidden(),

  created_at: Joi.forbidden(),

  updated_at: Joi.forbidden(),
});

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
*/




const getAllPropertiesQuery = Joi.object({
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
    .allow("")
    .optional()
    .messages({
      "string.base":
        "Search must be a string.",
      "string.max":
        "Search cannot exceed 150 characters.",
    }),

  propertyType: Joi.string()
    .valid(...PROPERTY_TYPES)
    .optional()
    .messages({
      "any.only":
        `Property type must be one of: ${PROPERTY_TYPES.join(", ")}.`,
    }),

  listingType: Joi.string()
    .valid(...LISTING_TYPES)
    .optional()
    .messages({
      "any.only":
        `Listing type must be one of: ${LISTING_TYPES.join(", ")}.`,
    }),

  status: Joi.string()
    .valid(...PROPERTY_STATUSES)
    .optional()
    .messages({
      "any.only":
        `Property status must be one of: ${PROPERTY_STATUSES.join(", ")}.`,
    }),

  city: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.base":
        "City must be a string.",
      "string.max":
        "City cannot exceed 100 characters.",
    }),

  state: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages({
      "string.base":
        "State must be a string.",
      "string.max":
        "State cannot exceed 100 characters.",
    }),

  minPrice: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.base":
        "Minimum price must be a number.",
      "number.min":
        "Minimum price cannot be negative.",
      "number.precision":
        "Minimum price can have maximum 2 decimal places.",
    }),

  maxPrice: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.base":
        "Maximum price must be a number.",
      "number.min":
        "Maximum price cannot be negative.",
      "number.precision":
        "Maximum price can have maximum 2 decimal places.",
    }),

  minArea: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.base":
        "Minimum area must be a number.",
      "number.min":
        "Minimum area cannot be negative.",
      "number.precision":
        "Minimum area can have maximum 2 decimal places.",
    }),

  maxArea: Joi.number()
    .min(0)
    .precision(2)
    .optional()
    .messages({
      "number.base":
        "Maximum area must be a number.",
      "number.min":
        "Maximum area cannot be negative.",
      "number.precision":
        "Maximum area can have maximum 2 decimal places.",
    }),

  sortBy: Joi.string()
    .valid(
      "id",
      "property_code",
      "title",
      "property_type",
      "listing_type",
      "price",
      "city",
      "state",
      "area",
      "status",
      "created_at",
      "updated_at"
    )
    .default("created_at")
    .messages({
      "any.only":
        "Invalid sort field.",
    }),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC")
    .messages({
      "any.only":
        "Sort order must be ASC or DESC.",
    }),
})
  .custom((value, helpers) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      return helpers.message({
        custom:
          "Minimum price cannot be greater than maximum price.",
      });
    }

    if (
      value.minArea !== undefined &&
      value.maxArea !== undefined &&
      value.minArea > value.maxArea
    ) {
      return helpers.message({
        custom:
          "Minimum area cannot be greater than maximum area.",
      });
    }

    return value;
  });

  
/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY TYPE
|--------------------------------------------------------------------------
*/
const getPropertiesByTypeQuery = Joi.object({
  propertyType: Joi.string()
    .valid(...PROPERTY_TYPES)
    .required()
    .messages({
      "string.base":
        "Property type must be a string.",
      "string.empty":
        "Property type is required.",
      "any.only":
        `Property type must be one of: ${PROPERTY_TYPES.join(", ")}.`,
      "any.required":
        "Property type is required.",
    }),

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
    .valid(...PROPERTY_STATUSES)
    .optional()
    .messages({
      "string.base":
        "Property status must be a string.",
      "any.only":
        `Property status must be one of: ${PROPERTY_STATUSES.join(", ")}.`,
    }),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC")
    .messages({
      "any.only":
        "Sort order must be ASC or DESC.",
    }),
});

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY CITY
|--------------------------------------------------------------------------
*/

const getPropertiesByCityQuery = Joi.object({
  city: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      "string.base":
        "City must be a string.",
      "string.empty":
        "City is required.",
      "string.max":
        "City cannot exceed 100 characters.",
      "any.required":
        "City is required.",
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),

  propertyType: Joi.string()
    .valid(...PROPERTY_TYPES)
    .optional(),

  listingType: Joi.string()
    .valid(...LISTING_TYPES)
    .optional(),

  status: Joi.string()
    .valid(...PROPERTY_STATUSES)
    .optional(),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC"),
});

/*
|--------------------------------------------------------------------------
| EXPORT VALIDATION OBJECT
|--------------------------------------------------------------------------
*/



export default {
  createProperty: {
    body: createPropertyBody,
  },

  getPropertyById: {
    params: propertyIdParams,
  },

  getAllProperties: {
    query: getAllPropertiesQuery,
  },

  updateProperty: {
    params: propertyIdParams,
    body: updatePropertyBody,
  },

  changePropertyStatus: {
    params: propertyIdParams,
    body: changePropertyStatusBody,
  },

  deleteProperty: {
    params: propertyIdParams,
  },

  getPropertiesByType: {
    query: getPropertiesByTypeQuery,
  },

  getPropertiesByCity: {
    query: getPropertiesByCityQuery,
  },
};

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY TYPE
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| EXPORT VALIDATION OBJECT
|--------------------------------------------------------------------------
*/

