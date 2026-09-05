import * as propertyRepository from "./properties.repository.js";

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
| Error Helper
|--------------------------------------------------------------------------
*/

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/*
|--------------------------------------------------------------------------
| Validation Helpers
|--------------------------------------------------------------------------
*/

const parsePositiveInteger = (value, fieldName) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw createError(`${fieldName} must be a positive integer.`);
  }

  return parsedValue;
};

const validateCompanyId = (companyId) => {
  return parsePositiveInteger(companyId, "Company ID");
};

const validateUserId = (userId) => {
  return parsePositiveInteger(userId, "User ID");
};

const validatePropertyId = (propertyId) => {
  return parsePositiveInteger(propertyId, "Property ID");
};

/*
|--------------------------------------------------------------------------
| String Normalization
|--------------------------------------------------------------------------
*/

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue === "" ? null : normalizedValue;
};

const normalizePropertyCode = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const normalizedValue = String(value)
    .trim()
    .toUpperCase();

  return normalizedValue === "" ? null : normalizedValue;
};

/*
|--------------------------------------------------------------------------
| Enum Validation
|--------------------------------------------------------------------------
*/

const validateEnumValue = (
  value,
  allowedValues,
  fieldName
) => {
  if (!allowedValues.includes(value)) {
    throw createError(
      `${fieldName} must be one of: ${allowedValues.join(", ")}.`
    );
  }

  return value;
};

/*
|--------------------------------------------------------------------------
| Number Validation
|--------------------------------------------------------------------------
*/

const validateNonNegativeNumber = (
  value,
  fieldName
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    throw createError(
      `${fieldName} must be a valid non-negative number.`
    );
  }

  return parsedValue;
};

const validatePositiveNumber = (
  value,
  fieldName
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0
  ) {
    throw createError(
      `${fieldName} must be greater than 0.`
    );
  }

  return parsedValue;
};

const validateNonNegativeInteger = (
  value,
  fieldName
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 0
  ) {
    throw createError(
      `${fieldName} must be a non-negative integer.`
    );
  }

  return parsedValue;
};

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

const calculatePagination = (
  page,
  limit,
  total
) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 20;
  const parsedTotal = Number(total) || 0;

  const totalPages =
    parsedTotal === 0
      ? 0
      : Math.ceil(
          parsedTotal / parsedLimit
        );

  return {
    page: parsedPage,
    limit: parsedLimit,
    total: parsedTotal,
    totalPages,
    hasNextPage:
      parsedPage < totalPages,
    hasPreviousPage:
      parsedPage > 1 &&
      totalPages > 0,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
*/

export const createProperty = async (
  data,
  companyId,
  userId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validUserId =
    validateUserId(userId);

  const propertyData = {
    ...data,
  };

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  propertyData.company_id =
    validCompanyId;

  propertyData.created_by =
    validUserId;

  propertyData.updated_by =
    validUserId;

  /*
  |--------------------------------------------------------------------------
  | Normalize Strings
  |--------------------------------------------------------------------------
  */

  propertyData.property_code =
    normalizePropertyCode(
      propertyData.property_code
    );

  propertyData.title =
    normalizeString(
      propertyData.title
    );

  propertyData.description =
    normalizeString(
      propertyData.description
    );

  propertyData.address =
    normalizeString(
      propertyData.address
    );

  propertyData.city =
    normalizeString(
      propertyData.city
    );

  propertyData.state =
    normalizeString(
      propertyData.state
    );

  propertyData.country =
    normalizeString(
      propertyData.country
    ) || "India";

  propertyData.pincode =
    normalizeString(
      propertyData.pincode
    );

  /*
  |--------------------------------------------------------------------------
  | Required Fields
  |--------------------------------------------------------------------------
  */

  if (!propertyData.property_code) {
    throw createError(
      "Property code is required."
    );
  }

  if (!propertyData.title) {
    throw createError(
      "Property title is required."
    );
  }

  if (!propertyData.property_type) {
    throw createError(
      "Property type is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Enum Validation
  |--------------------------------------------------------------------------
  */

  validateEnumValue(
    propertyData.property_type,
    PROPERTY_TYPES,
    "Property type"
  );

  propertyData.listing_type =
    propertyData.listing_type ||
    "sale";

  validateEnumValue(
    propertyData.listing_type,
    LISTING_TYPES,
    "Listing type"
  );

  propertyData.area_unit =
    propertyData.area_unit ||
    "sqft";

  validateEnumValue(
    propertyData.area_unit,
    AREA_UNITS,
    "Area unit"
  );

  /*
  |--------------------------------------------------------------------------
  | New Property Always Starts As Available
  |--------------------------------------------------------------------------
  */

  propertyData.status =
    "available";

  /*
  |--------------------------------------------------------------------------
  | Numeric Validation
  |--------------------------------------------------------------------------
  */

  propertyData.price =
    validateNonNegativeNumber(
      propertyData.price,
      "Price"
    );

  propertyData.area =
    validatePositiveNumber(
      propertyData.area,
      "Area"
    );

  propertyData.bedrooms =
    validateNonNegativeInteger(
      propertyData.bedrooms,
      "Bedrooms"
    );

  propertyData.bathrooms =
    validateNonNegativeInteger(
      propertyData.bathrooms,
      "Bathrooms"
    );

  /*
  |--------------------------------------------------------------------------
  | Duplicate Property Code
  |--------------------------------------------------------------------------
  */

  const existingProperty =
    await propertyRepository.findPropertyByCode(
      propertyData.property_code,
      validCompanyId
    );

  if (existingProperty) {
    throw createError(
      "A property with this property code already exists in your company.",
      409
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Remove Client Controlled Fields
  |--------------------------------------------------------------------------
  */

  delete propertyData.id;
  delete propertyData.created_at;
  delete propertyData.updated_at;

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  return await propertyRepository.createProperty(
    propertyData
  );
};

/*
|--------------------------------------------------------------------------
| GET PROPERTY BY ID
|--------------------------------------------------------------------------
*/

export const getPropertyById = async (
  propertyId,
  companyId
) => {
  const validPropertyId =
    validatePropertyId(propertyId);

  const validCompanyId =
    validateCompanyId(companyId);

  const property =
    await propertyRepository.findPropertyById(
      validPropertyId,
      validCompanyId
    );

  if (!property) {
    throw createError(
      "Property not found.",
      404
    );
  }

  return property;
};

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
*/

export const getAllProperties = async ({
  companyId,
  page = 1,
  limit = 20,
  search,
  propertyType,
  listingType,
  status,
  city,
  state,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const parsedPage =
    parsePositiveInteger(
      page,
      "Page"
    );

  const parsedLimit =
    parsePositiveInteger(
      limit,
      "Limit"
    );

  /*
  |--------------------------------------------------------------------------
  | Filter Validation
  |--------------------------------------------------------------------------
  */

  if (propertyType) {
    validateEnumValue(
      propertyType,
      PROPERTY_TYPES,
      "Property type"
    );
  }

  if (listingType) {
    validateEnumValue(
      listingType,
      LISTING_TYPES,
      "Listing type"
    );
  }

  if (status) {
    validateEnumValue(
      status,
      PROPERTY_STATUSES,
      "Property status"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize Search Filters
  |--------------------------------------------------------------------------
  */

  const normalizedSearch =
    normalizeString(search);

  const normalizedCity =
    normalizeString(city);

  const normalizedState =
    normalizeString(state);

  /*
  |--------------------------------------------------------------------------
  | Price Filters
  |--------------------------------------------------------------------------
  */

  const parsedMinPrice =
    validateNonNegativeNumber(
      minPrice,
      "Minimum price"
    );

  const parsedMaxPrice =
    validateNonNegativeNumber(
      maxPrice,
      "Maximum price"
    );

  if (
    parsedMinPrice !== null &&
    parsedMaxPrice !== null &&
    parsedMinPrice > parsedMaxPrice
  ) {
    throw createError(
      "Minimum price cannot be greater than maximum price."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Area Filters
  |--------------------------------------------------------------------------
  */

  const parsedMinArea =
    validateNonNegativeNumber(
      minArea,
      "Minimum area"
    );

  const parsedMaxArea =
    validateNonNegativeNumber(
      maxArea,
      "Maximum area"
    );

  if (
    parsedMinArea !== null &&
    parsedMaxArea !== null &&
    parsedMinArea > parsedMaxArea
  ) {
    throw createError(
      "Minimum area cannot be greater than maximum area."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Repository Query
  |--------------------------------------------------------------------------
  */

  const result =
    await propertyRepository.findAllProperties({
      companyId:
        validCompanyId,

      page:
        parsedPage,

      limit:
        parsedLimit,

      search:
        normalizedSearch,

      propertyType,

      listingType,

      status,

      city:
        normalizedCity,

      state:
        normalizedState,

      minPrice:
        parsedMinPrice,

      maxPrice:
        parsedMaxPrice,

      minArea:
        parsedMinArea,

      maxArea:
        parsedMaxArea,

      sortBy,

      sortOrder,
    });

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    properties:
      result.rows,

    pagination:
      calculatePagination(
        parsedPage,
        parsedLimit,
        result.count
      ),
  };
};

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
*/

export const updateProperty = async (
  propertyId,
  data,
  companyId,
  userId
) => {
  const validPropertyId =
    validatePropertyId(propertyId);

  const validCompanyId =
    validateCompanyId(companyId);

  const validUserId =
    validateUserId(userId);

  /*
  |--------------------------------------------------------------------------
  | Find Existing Property
  |--------------------------------------------------------------------------
  */

  const existingProperty =
    await propertyRepository.findPropertyById(
      validPropertyId,
      validCompanyId
    );

  if (!existingProperty) {
    throw createError(
      "Property not found.",
      404
    );
  }

  const propertyData = {
    ...data,
  };

  /*
  |--------------------------------------------------------------------------
  | Property Code
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "property_code"
    )
  ) {
    propertyData.property_code =
      normalizePropertyCode(
        propertyData.property_code
      );

    if (!propertyData.property_code) {
      throw createError(
        "Property code cannot be empty."
      );
    }

    if (
      propertyData.property_code !==
      existingProperty.property_code
    ) {
      const duplicateProperty =
        await propertyRepository.findPropertyByCode(
          propertyData.property_code,
          validCompanyId,
          validPropertyId
        );

      if (duplicateProperty) {
        throw createError(
          "A property with this property code already exists in your company.",
          409
        );
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Title
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "title"
    )
  ) {
    propertyData.title =
      normalizeString(
        propertyData.title
      );

    if (!propertyData.title) {
      throw createError(
        "Property title cannot be empty."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | String Fields
  |--------------------------------------------------------------------------
  */

  const stringFields = [
    "description",
    "address",
    "city",
    "state",
    "country",
    "pincode",
  ];

  for (const field of stringFields) {
    if (
      Object.prototype.hasOwnProperty.call(
        propertyData,
        field
      )
    ) {
      propertyData[field] =
        normalizeString(
          propertyData[field]
        );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Country
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "country"
    ) &&
    !propertyData.country
  ) {
    propertyData.country =
      "India";
  }

  /*
  |--------------------------------------------------------------------------
  | Property Type
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "property_type"
    )
  ) {
    validateEnumValue(
      propertyData.property_type,
      PROPERTY_TYPES,
      "Property type"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Listing Type
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "listing_type"
    )
  ) {
    validateEnumValue(
      propertyData.listing_type,
      LISTING_TYPES,
      "Listing type"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Area Unit
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "area_unit"
    )
  ) {
    validateEnumValue(
      propertyData.area_unit,
      AREA_UNITS,
      "Area unit"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Price
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "price"
    )
  ) {
    propertyData.price =
      validateNonNegativeNumber(
        propertyData.price,
        "Price"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Area
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "area"
    )
  ) {
    propertyData.area =
      validatePositiveNumber(
        propertyData.area,
        "Area"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Bedrooms
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "bedrooms"
    )
  ) {
    propertyData.bedrooms =
      validateNonNegativeInteger(
        propertyData.bedrooms,
        "Bedrooms"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Bathrooms
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      propertyData,
      "bathrooms"
    )
  ) {
    propertyData.bathrooms =
      validateNonNegativeInteger(
        propertyData.bathrooms,
        "Bathrooms"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  delete propertyData.id;

  delete propertyData.company_id;

  delete propertyData.created_by;

  delete propertyData.created_at;

  delete propertyData.updated_at;

  /*
  |--------------------------------------------------------------------------
  | Status Must Be Changed Through Dedicated API
  |--------------------------------------------------------------------------
  */

  delete propertyData.status;

  /*
  |--------------------------------------------------------------------------
  | Updated By
  |--------------------------------------------------------------------------
  */

  propertyData.updated_by =
    validUserId;

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  return await propertyRepository.updateProperty(
    validPropertyId,
    validCompanyId,
    propertyData
  );
};

/*
|--------------------------------------------------------------------------
| CHANGE PROPERTY STATUS
|--------------------------------------------------------------------------
*/

export const changePropertyStatus = async (
  propertyId,
  status,
  companyId,
  userId
) => {
  const validPropertyId =
    validatePropertyId(propertyId);

  const validCompanyId =
    validateCompanyId(companyId);

  const validUserId =
    validateUserId(userId);

  /*
  |--------------------------------------------------------------------------
  | Validate Status
  |--------------------------------------------------------------------------
  */

  validateEnumValue(
    status,
    PROPERTY_STATUSES,
    "Property status"
  );

  /*
  |--------------------------------------------------------------------------
  | Find Property
  |--------------------------------------------------------------------------
  */

  const existingProperty =
    await propertyRepository.findPropertyById(
      validPropertyId,
      validCompanyId
    );

  if (!existingProperty) {
    throw createError(
      "Property not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Change Required
  |--------------------------------------------------------------------------
  */

  if (
    existingProperty.status ===
    status
  ) {
    return existingProperty;
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  return await propertyRepository.updatePropertyStatus(
    validPropertyId,
    validCompanyId,
    status,
    validUserId
  );
};

/*
|--------------------------------------------------------------------------
| DELETE PROPERTY
|--------------------------------------------------------------------------
*/

export const deleteProperty = async (
  propertyId,
  companyId
) => {
  const validPropertyId =
    validatePropertyId(propertyId);

  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Find Property
  |--------------------------------------------------------------------------
  */

  const existingProperty =
    await propertyRepository.findPropertyById(
      validPropertyId,
      validCompanyId
    );

  if (!existingProperty) {
    throw createError(
      "Property not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleted =
    await propertyRepository.deleteProperty(
      validPropertyId,
      validCompanyId
    );

  if (!deleted) {
    throw createError(
      "Property could not be deleted.",
      500
    );
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY TYPE
|--------------------------------------------------------------------------
*/

export const getPropertiesByType = async ({
  companyId,
  propertyType,
  page = 1,
  limit = 20,
  status,
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Validate Property Type
  |--------------------------------------------------------------------------
  */

  validateEnumValue(
    propertyType,
    PROPERTY_TYPES,
    "Property type"
  );

  /*
  |--------------------------------------------------------------------------
  | Validate Status
  |--------------------------------------------------------------------------
  */

  if (status) {
    validateEnumValue(
      status,
      PROPERTY_STATUSES,
      "Property status"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const parsedPage =
    parsePositiveInteger(
      page,
      "Page"
    );

  const parsedLimit =
    parsePositiveInteger(
      limit,
      "Limit"
    );

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await propertyRepository.findPropertiesByType({
      companyId:
        validCompanyId,

      propertyType,

      page:
        parsedPage,

      limit:
        parsedLimit,

      status,

      sortOrder,
    });

  return {
    properties:
      result.rows,

    pagination:
      calculatePagination(
        parsedPage,
        parsedLimit,
        result.count
      ),
  };
};

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY CITY
|--------------------------------------------------------------------------
*/

export const getPropertiesByCity = async ({
  companyId,
  city,
  page = 1,
  limit = 20,
  propertyType,
  listingType,
  status,
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Normalize City
  |--------------------------------------------------------------------------
  */

  const normalizedCity =
    normalizeString(city);

  if (!normalizedCity) {
    throw createError(
      "City is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  if (propertyType) {
    validateEnumValue(
      propertyType,
      PROPERTY_TYPES,
      "Property type"
    );
  }

  if (listingType) {
    validateEnumValue(
      listingType,
      LISTING_TYPES,
      "Listing type"
    );
  }

  if (status) {
    validateEnumValue(
      status,
      PROPERTY_STATUSES,
      "Property status"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const parsedPage =
    parsePositiveInteger(
      page,
      "Page"
    );

  const parsedLimit =
    parsePositiveInteger(
      limit,
      "Limit"
    );

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await propertyRepository.findPropertiesByCity({
      companyId:
        validCompanyId,

      city:
        normalizedCity,

      page:
        parsedPage,

      limit:
        parsedLimit,

      propertyType,

      listingType,

      status,

      sortOrder,
    });

  return {
    properties:
      result.rows,

    pagination:
      calculatePagination(
        parsedPage,
        parsedLimit,
        result.count
      ),
  };
};

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY STATUS
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByStatus =
  async (companyId) => {
    const validCompanyId =
      validateCompanyId(companyId);

    return await propertyRepository
      .countPropertiesByStatus(
        validCompanyId
      );
  };

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY TYPE
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByType =
  async (companyId) => {
    const validCompanyId =
      validateCompanyId(companyId);

    return await propertyRepository
      .countPropertiesByType(
        validCompanyId
      );
  };

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY LISTING TYPE
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByListingType =
  async (companyId) => {
    const validCompanyId =
      validateCompanyId(companyId);

    return await propertyRepository
      .countPropertiesByListingType(
        validCompanyId
      );
  };