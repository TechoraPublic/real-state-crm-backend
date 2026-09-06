import * as dealRepository from "./deals.repositories.js";
import * as leadRepository from "../leads/lead.repository.js";
import * as propertyRepository from "../properties/properties.repositories.js";
import * as customerRepository from "../customers/customer.repositeries.js";

import {User} from "../../databases/models.js";

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

const TERMINAL_STATUSES = [
  "won",
  "lost",
  "cancelled",
];

/*
|--------------------------------------------------------------------------
| Error Helper
|--------------------------------------------------------------------------
*/

const createError = (
  message,
  statusCode = 400
) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/*
|--------------------------------------------------------------------------
| Validation Helpers
|--------------------------------------------------------------------------
*/

const parsePositiveInteger = (
  value,
  fieldName
) => {
  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    throw createError(
      `${fieldName} must be a positive integer.`
    );
  }

  return parsedValue;
};

const validateCompanyId = (
  companyId
) =>
  parsePositiveInteger(
    companyId,
    "Company ID"
  );

const validateUserId = (
  userId
) =>
  parsePositiveInteger(
    userId,
    "User ID"
  );

const validateDealId = (
  dealId
) =>
  parsePositiveInteger(
    dealId,
    "Deal ID"
  );

const validateLeadId = (
  leadId
) =>
  parsePositiveInteger(
    leadId,
    "Lead ID"
  );

const validateCustomerId = (
  customerId
) =>
  parsePositiveInteger(
    customerId,
    "Customer ID"
  );

const validatePropertyId = (
  propertyId
) =>
  parsePositiveInteger(
    propertyId,
    "Property ID"
  );

const normalizeString = (
  value
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return value;
  }

  const normalizedValue =
    String(value).trim();

  return normalizedValue === ""
    ? null
    : normalizedValue;
};

const validateEnumValue = (
  value,
  allowedValues,
  fieldName
) => {
  if (
    !allowedValues.includes(value)
  ) {
    throw createError(
      `${fieldName} must be one of: ${allowedValues.join(
        ", "
      )}.`
    );
  }

  return value;
};

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

const validateDate = (
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

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    throw createError(
      `${fieldName} must be a valid date.`
    );
  }

  return parsedDate;
};

const calculatePagination = (
  page,
  limit,
  total
) => {
  const parsedPage =
    Number(page) || 1;

  const parsedLimit =
    Number(limit) || 20;

  const parsedTotal =
    Number(total) || 0;

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
| Verify Lead
|--------------------------------------------------------------------------
*/

const verifyLead = async (
  leadId,
  companyId
) => {
  const lead =
    await leadRepository.findLeadById(
      leadId,
      companyId
    );

  if (!lead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  return lead;
};

/*
|--------------------------------------------------------------------------
| Verify Customer
|--------------------------------------------------------------------------
*/

const verifyCustomer = async (
  customerId,
  companyId
) => {
  const customer =
    await customerRepository.findCustomerById(
      customerId,
      companyId
    );

  if (!customer) {
    throw createError(
      "Customer not found.",
      404
    );
  }

  if (
    customer.status !== "active"
  ) {
    throw createError(
      "Customer is inactive."
    );
  }

  return customer;
};

/*
|--------------------------------------------------------------------------
| Verify Property
|--------------------------------------------------------------------------
*/

const verifyProperty = async (
  propertyId,
  companyId
) => {
  const property =
    await propertyRepository.findPropertyById(
      propertyId,
      companyId
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
| Verify Assigned User
|--------------------------------------------------------------------------
*/

const verifyAssignedUser = async (
  userId,
  companyId
) => {
  const user =
    await User.findOne({
      where: {
        id: userId,
        company_id: companyId,
        status: "active",
      },

      attributes: [
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
        "status",
      ],
    });

  if (!user) {
    throw createError(
      "Assigned user not found or inactive.",
      404
    );
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Verify Creator / Updater
|--------------------------------------------------------------------------
*/

const verifyUser = async (
  userId,
  companyId
) => {
  const user =
    await User.findOne({
      where: {
        id: userId,
        company_id: companyId,
        status: "active",
      },

      attributes: [
        "id",
        "company_id",
        "status",
      ],
    });

  if (!user) {
    throw createError(
      "User not found or inactive.",
      404
    );
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Validate Lead / Customer / Property Relationship
|--------------------------------------------------------------------------
*/

const validateDealRelationships = async ({
  leadId,
  customerId,
  propertyId,
  companyId,
}) => {
  const lead =
    await verifyLead(
      leadId,
      companyId
    );

  const customer =
    await verifyCustomer(
      customerId,
      companyId
    );

  const property =
    await verifyProperty(
      propertyId,
      companyId
    );

  /*
  |--------------------------------------------------------------------------
  | Customer must belong to lead
  |--------------------------------------------------------------------------
  */

  if (
    lead.customer_id !== null &&
    lead.customer_id !== undefined &&
    Number(lead.customer_id) !==
      Number(customerId)
  ) {
    throw createError(
      "Selected customer does not belong to this lead."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Property must match lead property when assigned
  |--------------------------------------------------------------------------
  */

  if (
    lead.property_id !== null &&
    lead.property_id !== undefined &&
    Number(lead.property_id) !==
      Number(propertyId)
  ) {
    throw createError(
      "Selected property does not belong to this lead."
    );
  }

  return {
    lead,
    customer,
    property,
  };
};

/*
|--------------------------------------------------------------------------
| Create Deal
|--------------------------------------------------------------------------
*/

export const createDeal = async (
  data,
  companyId,
  createdBy
) => {
  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const validCreatedBy =
    validateUserId(
      createdBy
    );

  const dealData = {
    ...data,
  };

  /*
  |--------------------------------------------------------------------------
  | Required IDs
  |--------------------------------------------------------------------------
  */

  const leadId =
    validateLeadId(
      dealData.lead_id
    );

  const customerId =
    validateCustomerId(
      dealData.customer_id
    );

  const propertyId =
    validatePropertyId(
      dealData.property_id
    );

  const assignedTo =
    validateUserId(
      dealData.assigned_to
    );

  /*
  |--------------------------------------------------------------------------
  | Verify Creator
  |--------------------------------------------------------------------------
  */

  await verifyUser(
    validCreatedBy,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Verify Relationships
  |--------------------------------------------------------------------------
  */

  await validateDealRelationships({
    leadId,
    customerId,
    propertyId,
    companyId:
      validCompanyId,
  });

  /*
  |--------------------------------------------------------------------------
  | Verify Assigned User
  |--------------------------------------------------------------------------
  */

  await verifyAssignedUser(
    assignedTo,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Deal Value
  |--------------------------------------------------------------------------
  */

  dealData.deal_value =
    validateNonNegativeNumber(
      dealData.deal_value,
      "Deal value"
    );

  /*
  |--------------------------------------------------------------------------
  | Stage
  |--------------------------------------------------------------------------
  */

  dealData.stage =
    dealData.stage || "initial";

  validateEnumValue(
    dealData.stage,
    DEAL_STAGES,
    "Deal stage"
  );

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  dealData.status = "open";

  /*
  |--------------------------------------------------------------------------
  | Expected Close Date
  |--------------------------------------------------------------------------
  */

  if (
    dealData.expected_close_date !==
    undefined
  ) {
    dealData.expected_close_date =
      validateDate(
        dealData.expected_close_date,
        "Expected close date"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Initial Deal Rules
  |--------------------------------------------------------------------------
  */

  if (
    dealData.stage === "closed"
  ) {
    throw createError(
      "A new deal cannot be created directly in closed stage."
    );
  }

  dealData.company_id =
    validCompanyId;

  dealData.created_by =
    validCreatedBy;

  dealData.updated_by =
    validCreatedBy;

  dealData.closed_at = null;
  dealData.lost_reason = null;

  /*
  |--------------------------------------------------------------------------
  | Prevent Client-Controlled Fields
  |--------------------------------------------------------------------------
  */

  delete dealData.id;
  delete dealData.created_at;
  delete dealData.updated_at;

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  return await dealRepository.createDeal(
    dealData
  );
};


/*
|--------------------------------------------------------------------------
| Get All Deals
|--------------------------------------------------------------------------
*/

export const getAllDeals = async ({
  companyId,
  page = 1,
  limit = 20,
  search,
  leadId,
  customerId,
  propertyId,
  assignedTo,
  stage,
  status,
  fromDate,
  toDate,
  minValue,
  maxValue,
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(
      companyId
    );

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

  if (parsedLimit > 100) {
    throw createError(
      "Limit cannot exceed 100."
    );
  }

  if (leadId) {
    validateLeadId(
      leadId
    );
  }

  if (customerId) {
    validateCustomerId(
      customerId
    );
  }

  if (propertyId) {
    validatePropertyId(
      propertyId
    );
  }

  if (assignedTo) {
    validateUserId(
      assignedTo
    );
  }

  if (stage) {
    validateEnumValue(
      stage,
      DEAL_STAGES,
      "Deal stage"
    );
  }

  if (status) {
    validateEnumValue(
      status,
      DEAL_STATUSES,
      "Deal status"
    );
  }

  const parsedMinValue =
    validateNonNegativeNumber(
      minValue,
      "Minimum deal value"
    );

  const parsedMaxValue =
    validateNonNegativeNumber(
      maxValue,
      "Maximum deal value"
    );

  if (
    parsedMinValue !== null &&
    parsedMaxValue !== null &&
    parsedMinValue >
      parsedMaxValue
  ) {
    throw createError(
      "Minimum deal value cannot be greater than maximum deal value."
    );
  }

  const parsedFromDate =
    validateDate(
      fromDate,
      "From date"
    );

  const parsedToDate =
    validateDate(
      toDate,
      "To date"
    );

  if (
    parsedFromDate &&
    parsedToDate &&
    parsedFromDate >
      parsedToDate
  ) {
    throw createError(
      "From date cannot be greater than to date."
    );
  }

  const result =
    await dealRepository.findAllDeals({
      companyId:
        validCompanyId,

      page:
        parsedPage,

      limit:
        parsedLimit,

      search:
        normalizeString(
          search
        ),

      leadId:
        leadId
          ? Number(leadId)
          : undefined,

      customerId:
        customerId
          ? Number(customerId)
          : undefined,

      propertyId:
        propertyId
          ? Number(propertyId)
          : undefined,

      assignedTo:
        assignedTo
          ? Number(assignedTo)
          : undefined,

      stage,

      status,

      fromDate:
        parsedFromDate,

      toDate:
        parsedToDate,

      minValue:
        parsedMinValue,

      maxValue:
        parsedMaxValue,

      sortBy,

      sortOrder,
    });

  return {
    deals: result.rows,

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
| Get Deal By ID
|--------------------------------------------------------------------------
*/

export const getDealById = async (
  dealId,
  companyId
) => {
  const validDealId =
    validateDealId(
      dealId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const deal =
    await dealRepository.findDealById(
      validDealId,
      validCompanyId
    );

  if (!deal) {
    throw createError(
      "Deal not found.",
      404
    );
  }

  return deal;
};


/*
|--------------------------------------------------------------------------
| Update Deal
|--------------------------------------------------------------------------
*/

export const updateDeal = async (
  dealId,
  data,
  companyId,
  updatedBy
) => {
  const validDealId =
    validateDealId(
      dealId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const validUpdatedBy =
    validateUserId(
      updatedBy
    );

  await verifyUser(
    validUpdatedBy,
    validCompanyId
  );

  const existingDeal =
    await dealRepository.findDealById(
      validDealId,
      validCompanyId
    );

  if (!existingDeal) {
    throw createError(
      "Deal not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Terminal Deal Protection
  |--------------------------------------------------------------------------
  */

  if (
    TERMINAL_STATUSES.includes(
      existingDeal.status
    )
  ) {
    throw createError(
      `Deal cannot be updated because it is already ${existingDeal.status}.`
    );
  }

  const dealData = {
    ...data,
  };

  /*
  |--------------------------------------------------------------------------
  | Relationship Updates
  |--------------------------------------------------------------------------
  */

  const newLeadId =
    dealData.lead_id !==
    undefined
      ? validateLeadId(
          dealData.lead_id
        )
      : Number(
          existingDeal.lead_id
        );

  const newCustomerId =
    dealData.customer_id !==
    undefined
      ? validateCustomerId(
          dealData.customer_id
        )
      : existingDeal.customer_id
        ? Number(
            existingDeal.customer_id
          )
        : null;

  const newPropertyId =
    dealData.property_id !==
    undefined
      ? validatePropertyId(
          dealData.property_id
        )
      : Number(
          existingDeal.property_id
        );

  /*
  |--------------------------------------------------------------------------
  | If Relationship Fields Are Changing
  |--------------------------------------------------------------------------
  */

  if (
    dealData.lead_id !==
      undefined ||
    dealData.customer_id !==
      undefined ||
    dealData.property_id !==
      undefined
  ) {
    if (!newCustomerId) {
      throw createError(
        "Customer ID is required for a deal."
      );
    }

    await validateDealRelationships({
      leadId:
        newLeadId,

      customerId:
        newCustomerId,

      propertyId:
        newPropertyId,

      companyId:
        validCompanyId,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Assigned User
  |--------------------------------------------------------------------------
  */

  if (
    dealData.assigned_to !==
    undefined
  ) {
    const assignedTo =
      validateUserId(
        dealData.assigned_to
      );

    await verifyAssignedUser(
      assignedTo,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Deal Value
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      dealData,
      "deal_value"
    )
  ) {
    dealData.deal_value =
      validateNonNegativeNumber(
        dealData.deal_value,
        "Deal value"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Expected Close Date
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      dealData,
      "expected_close_date"
    )
  ) {
    dealData.expected_close_date =
      validateDate(
        dealData.expected_close_date,
        "Expected close date"
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Stage / Status Cannot Be Changed Here
  |--------------------------------------------------------------------------
  */

  delete dealData.stage;
  delete dealData.status;
  delete dealData.closed_at;
  delete dealData.lost_reason;

  /*
  |--------------------------------------------------------------------------
  | Protected Fields
  |--------------------------------------------------------------------------
  */

  delete dealData.id;
  delete dealData.company_id;
  delete dealData.created_by;
  delete dealData.created_at;
  delete dealData.updated_at;

  dealData.updated_by =
    validUpdatedBy;

  return await dealRepository.updateDeal(
    validDealId,
    validCompanyId,
    dealData
  );
};


/*
|--------------------------------------------------------------------------
| Change Deal Stage
|--------------------------------------------------------------------------
*/

export const changeDealStage = async (
  dealId,
  stage,
  companyId,
  updatedBy
) => {
  const validDealId =
    validateDealId(
      dealId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const validUpdatedBy =
    validateUserId(
      updatedBy
    );

  validateEnumValue(
    stage,
    DEAL_STAGES,
    "Deal stage"
  );

  await verifyUser(
    validUpdatedBy,
    validCompanyId
  );

  const deal =
    await dealRepository.findDealById(
      validDealId,
      validCompanyId
    );

  if (!deal) {
    throw createError(
      "Deal not found.",
      404
    );
  }

  if (
    TERMINAL_STATUSES.includes(
      deal.status
    )
  ) {
    throw createError(
      `Deal stage cannot be changed because deal is already ${deal.status}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Allowed Stage Transitions
  |--------------------------------------------------------------------------
  */

  const allowedTransitions = {
    initial: [
      "negotiation",
    ],

    negotiation: [
      "documentation",
    ],

    documentation: [
      "closed",
    ],

    closed: [],
  };

  if (
    stage !== deal.stage &&
    !allowedTransitions[
      deal.stage
    ]?.includes(stage)
  ) {
    throw createError(
      `Invalid stage transition from ${deal.stage} to ${stage}.`
    );
  }

  return await dealRepository.updateDealStage(
    validDealId,
    validCompanyId,
    stage,
    validUpdatedBy
  );
};


/*
|--------------------------------------------------------------------------
| Change Deal Status
|--------------------------------------------------------------------------
*/

export const changeDealStatus = async (
  dealId,
  status,
  companyId,
  updatedBy,
  lostReason = undefined
) => {
  const validDealId =
    validateDealId(
      dealId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const validUpdatedBy =
    validateUserId(
      updatedBy
    );

  validateEnumValue(
    status,
    DEAL_STATUSES,
    "Deal status"
  );

  await verifyUser(
    validUpdatedBy,
    validCompanyId
  );

  const deal =
    await dealRepository.findDealById(
      validDealId,
      validCompanyId
    );

  if (!deal) {
    throw createError(
      "Deal not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Already Terminal
  |--------------------------------------------------------------------------
  */

  if (
    TERMINAL_STATUSES.includes(
      deal.status
    )
  ) {
    throw createError(
      `Deal status cannot be changed because it is already ${deal.status}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Won Rules
  |--------------------------------------------------------------------------
  */

  if (
    status === "won"
  ) {
    if (
      deal.stage !== "closed"
    ) {
      throw createError(
        "Deal must be in closed stage before marking it as won."
      );
    }

    return await dealRepository.updateDealStatus(
      validDealId,
      validCompanyId,
      "won",
      validUpdatedBy,
      new Date(),
      null
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Lost Rules
  |--------------------------------------------------------------------------
  */

  if (
    status === "lost"
  ) {
    const normalizedLostReason =
      normalizeString(
        lostReason
      );

    if (
      !normalizedLostReason
    ) {
      throw createError(
        "Lost reason is required when marking a deal as lost."
      );
    }

    return await dealRepository.updateDealStatus(
      validDealId,
      validCompanyId,
      "lost",
      validUpdatedBy,
      new Date(),
      normalizedLostReason
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Cancelled
  |--------------------------------------------------------------------------
  */

  if (
    status === "cancelled"
  ) {
    return await dealRepository.updateDealStatus(
      validDealId,
      validCompanyId,
      "cancelled",
      validUpdatedBy,
      new Date(),
      null
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Re-open
  |--------------------------------------------------------------------------
  */

  if (
    status === "open"
  ) {
    return await dealRepository.updateDealStatus(
      validDealId,
      validCompanyId,
      "open",
      validUpdatedBy,
      null,
      null
    );
  }

  throw createError(
    "Invalid deal status transition."
  );
};


/*
|--------------------------------------------------------------------------
| Delete Deal
|--------------------------------------------------------------------------
*/

export const deleteDeal = async (
  dealId,
  companyId
) => {
  const validDealId =
    validateDealId(
      dealId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

  const deal =
    await dealRepository.findDealById(
      validDealId,
      validCompanyId
    );

  if (!deal) {
    throw createError(
      "Deal not found.",
      404
    );
  }

  if (
    deal.status === "won"
  ) {
    throw createError(
      "Won deals cannot be deleted."
    );
  }

  if (
    deal.status === "lost"
  ) {
    throw createError(
      "Lost deals cannot be deleted."
    );
  }

  return await dealRepository.deleteDeal(
    validDealId,
    validCompanyId
  );
};


/*
|--------------------------------------------------------------------------
| Get Deals By Lead
|--------------------------------------------------------------------------
*/

export const getDealsByLead = async ({
  leadId,
  companyId,
  page = 1,
  limit = 20,
  sortOrder = "DESC",
}) => {
  const validLeadId =
    validateLeadId(
      leadId
    );

  const validCompanyId =
    validateCompanyId(
      companyId
    );

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

  if (
    parsedLimit > 100
  ) {
    throw createError(
      "Limit cannot exceed 100."
    );
  }

  validateEnumValue(
    String(sortOrder).toUpperCase(),
    ["ASC", "DESC"],
    "Sort order"
  );

  await verifyLead(
    validLeadId,
    validCompanyId
  );

  const result =
    await dealRepository.findDealsByLead({
      leadId:
        validLeadId,

      companyId:
        validCompanyId,

      page:
        parsedPage,

      limit:
        parsedLimit,

      sortOrder:
        String(
          sortOrder
        ).toUpperCase(),
    });

  return {
    deals:
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
| Get Deals By Customer
|--------------------------------------------------------------------------
*/

export const getDealsByCustomer =
  async ({
    customerId,
    companyId,
    page = 1,
    limit = 20,
    status,
    sortOrder = "DESC",
  }) => {
    const validCustomerId =
      validateCustomerId(
        customerId
      );

    const validCompanyId =
      validateCompanyId(
        companyId
      );

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

    if (
      parsedLimit > 100
    ) {
      throw createError(
        "Limit cannot exceed 100."
      );
    }

    if (status) {
      validateEnumValue(
        status,
        DEAL_STATUSES,
        "Deal status"
      );
    }

    const normalizedSortOrder =
      String(
        sortOrder
      ).toUpperCase();

    validateEnumValue(
      normalizedSortOrder,
      ["ASC", "DESC"],
      "Sort order"
    );

    await verifyCustomer(
      validCustomerId,
      validCompanyId
    );

    const result =
      await dealRepository.findDealsByCustomer({
        customerId:
          validCustomerId,

        companyId:
          validCompanyId,

        page:
          parsedPage,

        limit:
          parsedLimit,

        status,

        sortOrder:
          normalizedSortOrder,
      });

    return {
      deals:
        result.rows,

      pagination:
        calculatePagination(
          parsedPage,
          parsedLimit,
          result.count
        ),
    };
  };


  export default {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  changeDealStage,
  changeDealStatus,
  deleteDeal,
  getDealsByLead,
  getDealsByCustomer,
};