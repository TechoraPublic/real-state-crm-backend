import * as leadRepository from "./lead.repository.js";
import {
    Customer,
    User,
    Property,
    LeadSource,
    Integration
} from "../../databases/models.js";



// ============================================================
// CONSTANTS
// ============================================================

const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site_visit",
  "negotiation",
  "won",
  "lost",
  "on_hold",
];

const VALID_PRIORITIES = [
  "low",
  "medium",
  "high",
];

const VALID_PROPERTY_TYPES = [
  "residential",
  "commercial",
  "plot",
  "land",
  "other",
];

// ============================================================
// HELPER
// ============================================================

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ============================================================
// VALIDATE COMPANY ID
// ============================================================

const validateCompanyId = (companyId) => {
  if (!companyId) {
    throw createError(
      "Company ID is required.",
      401
    );
  }

  const numericCompanyId = Number(companyId);

  if (!Number.isInteger(numericCompanyId) || numericCompanyId <= 0) {
    throw createError(
      "Invalid company ID.",
      400
    );
  }

  return numericCompanyId;
};

// ============================================================
// VALIDATE ID
// ============================================================

const validateId = (id, fieldName = "ID") => {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw createError(
      `Invalid ${fieldName}.`,
      400
    );
  }

  return numericId;
};

// ============================================================
// VALIDATE CUSTOMER
// ============================================================

const validateCustomer = async (
  customerId,
  companyId
) => {
  if (!customerId) {
    return null;
  }

  const customer = await Customer.findOne({
    where: {
      id: customerId,
      company_id: companyId,
    },
  });

  if (!customer) {
    throw createError(
      "Customer not found or does not belong to this company.",
      400
    );
  }

  return customer;
};

// ============================================================
// VALIDATE ASSIGNED USER
// ============================================================

const validateAssignedUser = async (
  assignedTo,
  companyId
) => {
  if (!assignedTo) {
    return null;
  }

  const user = await User.findOne({
    where: {
      id: assignedTo,
      company_id: companyId,
    },
  });

  if (!user) {
    throw createError(
      "Assigned user not found or does not belong to this company.",
      400
    );
  }

  if (user.status !== "active") {
    throw createError(
      "Cannot assign lead to an inactive user.",
      400
    );
  }

  return user;
};

// ============================================================
// VALIDATE PROPERTY
// ============================================================

const validateProperty = async (
  propertyId,
  companyId
) => {
  if (!propertyId) {
    return null;
  }

  const property = await Property.findOne({
    where: {
      id: propertyId,
      company_id: companyId,
    },
  });

  if (!property) {
    throw createError(
      "Property not found or does not belong to this company.",
      400
    );
  }

  return property;
};

// ============================================================
// VALIDATE LEAD SOURCE
// ============================================================

const validateLeadSource = async (
  leadSourceId,
  companyId
) => {
  if (!leadSourceId) {
    throw createError(
      "Lead source is required.",
      400
    );
  }

  const leadSource = await LeadSource.findOne({
    where: {
      id: leadSourceId,
      company_id: companyId,
    },
  });

  if (!leadSource) {
    throw createError(
      "Lead source not found or does not belong to this company.",
      400
    );
  }

  if (leadSource.status !== "active") {
    throw createError(
      "Cannot create a lead using an inactive lead source.",
      400
    );
  }

  return leadSource;
};

// ============================================================
// VALIDATE INTEGRATION
// ============================================================

const validateIntegration = async (
  integrationId,
  companyId
) => {
  if (!integrationId) {
    return null;
  }

  const integration = await Integration.findOne({
    where: {
      id: integrationId,
      company_id: companyId,
    },
  });

  if (!integration) {
    throw createError(
      "Integration not found or does not belong to this company.",
      400
    );
  }

  return integration;
};

// ============================================================
// VALIDATE STATUS
// ============================================================

const validateStatus = (status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw createError(
      `Invalid lead status. Allowed values: ${VALID_STATUSES.join(", ")}.`,
      400
    );
  }
};

// ============================================================
// VALIDATE PRIORITY
// ============================================================

const validatePriority = (priority) => {
  if (!VALID_PRIORITIES.includes(priority)) {
    throw createError(
      `Invalid lead priority. Allowed values: ${VALID_PRIORITIES.join(", ")}.`,
      400
    );
  }
};

// ============================================================
// VALIDATE PROPERTY TYPE
// ============================================================

const validatePropertyType = (propertyType) => {
  if (
    propertyType &&
    !VALID_PROPERTY_TYPES.includes(propertyType)
  ) {
    throw createError(
      `Invalid property type. Allowed values: ${VALID_PROPERTY_TYPES.join(", ")}.`,
      400
    );
  }
};

// ============================================================
// VALIDATE BUDGET
// ============================================================

const validateBudget = (
  budgetMin,
  budgetMax
) => {
  if (
    budgetMin !== undefined &&
    budgetMin !== null &&
    Number(budgetMin) < 0
  ) {
    throw createError(
      "Minimum budget cannot be negative.",
      400
    );
  }

  if (
    budgetMax !== undefined &&
    budgetMax !== null &&
    Number(budgetMax) < 0
  ) {
    throw createError(
      "Maximum budget cannot be negative.",
      400
    );
  }

  if (
    budgetMin !== undefined &&
    budgetMin !== null &&
    budgetMax !== undefined &&
    budgetMax !== null &&
    Number(budgetMin) > Number(budgetMax)
  ) {
    throw createError(
      "Minimum budget cannot be greater than maximum budget.",
      400
    );
  }
};

// ============================================================
// CREATE LEAD
// ============================================================

export const createLead = async (
  data,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  // ----------------------------------------------------------
  // BASIC VALIDATION
  // ----------------------------------------------------------

  if (!data.lead_source_id) {
    throw createError(
      "Lead source is required.",
      400
    );
  }

  validateStatus(data.status || "new");

  validatePriority(data.priority || "medium");

  validatePropertyType(data.property_type);

  validateBudget(
    data.budget_min,
    data.budget_max
  );

  // ----------------------------------------------------------
  // VALIDATE RELATED RECORDS
  // ----------------------------------------------------------

  await validateCustomer(
    data.customer_id,
    numericCompanyId
  );

  await validateAssignedUser(
    data.assigned_to,
    numericCompanyId
  );

  await validateProperty(
    data.property_id,
    numericCompanyId
  );

  await validateLeadSource(
    data.lead_source_id,
    numericCompanyId
  );

  await validateIntegration(
    data.integration_id,
    numericCompanyId
  );

  // ----------------------------------------------------------
  // CHECK DUPLICATE EXTERNAL LEAD
  // ----------------------------------------------------------

  if (
    data.source_lead_id &&
    data.lead_source_id
  ) {
    const existingLead =
      await leadRepository.findLeadBySourceLeadId({
        companyId: numericCompanyId,
        leadSourceId: data.lead_source_id,
        sourceLeadId: data.source_lead_id,
      });

    if (existingLead) {
      throw createError(
        "A lead with the same external source ID already exists.",
        409
      );
    }
  }

  // PREPARE DATA
  // ----------------------------------------------------------

  const leadData = {
    ...data,
    company_id: numericCompanyId,

    status: data.status || "new",

    priority: data.priority || "medium",
  };

  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  return await leadRepository.createLead(
    leadData
  );
};

// ============================================================
// GET LEAD BY ID
// ============================================================

export const getLeadById = async (
  id,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  const lead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!lead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  return lead;
};

// ============================================================
// GET ALL LEADS
// ============================================================

export const getAllLeads = async ({
  companyId,
  page = 1,
  limit = 10,
  search,
  status,
  priority,
  leadSourceId,
  assignedTo,
  propertyId,
  integrationId,
  sortBy,
  sortOrder,
}) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  let numericPage = Number(page);
  let numericLimit = Number(limit);

  if (
    !Number.isInteger(numericPage) ||
    numericPage < 1
  ) {
    numericPage = 1;
  }

  if (
    !Number.isInteger(numericLimit) ||
    numericLimit < 1
  ) {
    numericLimit = 10;
  }

  // Maximum 100 records per request
  if (numericLimit > 100) {
    numericLimit = 100;
  }

  // ----------------------------------------------------------
  // FILTER VALIDATION
  // ----------------------------------------------------------

  if (status) {
    validateStatus(status);
  }

  if (priority) {
    validatePriority(priority);
  }

  if (leadSourceId) {
    validateId(
      leadSourceId,
      "lead source ID"
    );
  }

  if (assignedTo) {
    validateId(
      assignedTo,
      "assigned user ID"
    );
  }

  if (propertyId) {
    validateId(
      propertyId,
      "property ID"
    );
  }

  if (integrationId) {
    validateId(
      integrationId,
      "integration ID"
    );
  }

  // ----------------------------------------------------------
  // REPOSITORY
  // ----------------------------------------------------------

  const result =
    await leadRepository.findAllLeads({
      companyId: numericCompanyId,

      page: numericPage,

      limit: numericLimit,

      search:
        search?.trim() || undefined,

      status,

      priority,

      leadSourceId,

      assignedTo,

      propertyId,

      integrationId,

      sortBy,

      sortOrder,
    });

  const total =
    Number(result.count) || 0;

  const totalPages =
    Math.ceil(total / numericLimit);

  return {
    leads: result.rows,

    pagination: {
      page: numericPage,

      limit: numericLimit,

      total,

      totalPages,

      hasNextPage:
        numericPage < totalPages,

      hasPreviousPage:
        numericPage > 1,
    },
  };
};

// ============================================================
// UPDATE LEAD
// ============================================================

export const updateLead = async (
  id,
  data,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  // ----------------------------------------------------------
  // FIND EXISTING LEAD
  // ----------------------------------------------------------

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  // ----------------------------------------------------------
  // VALIDATE FIELDS IF PROVIDED
  // ----------------------------------------------------------

  if (data.status !== undefined) {
    validateStatus(data.status);
  }

  if (data.priority !== undefined) {
    validatePriority(data.priority);
  }

  if (data.property_type !== undefined) {
    validatePropertyType(
      data.property_type
    );
  }

  validateBudget(
    data.budget_min !== undefined
      ? data.budget_min
      : existingLead.budget_min,

    data.budget_max !== undefined
      ? data.budget_max
      : existingLead.budget_max
  );

  // ----------------------------------------------------------
  // VALIDATE RELATED RECORDS
  // ----------------------------------------------------------

  if (data.customer_id !== undefined) {
    await validateCustomer(
      data.customer_id,
      numericCompanyId
    );
  }

  if (data.assigned_to !== undefined) {
    await validateAssignedUser(
      data.assigned_to,
      numericCompanyId
    );
  }

  if (data.property_id !== undefined) {
    await validateProperty(
      data.property_id,
      numericCompanyId
    );
  }

  if (data.lead_source_id !== undefined) {
    await validateLeadSource(
      data.lead_source_id,
      numericCompanyId
    );
  }

  if (data.integration_id !== undefined) {
    await validateIntegration(
      data.integration_id,
      numericCompanyId
    );
  }

  // ----------------------------------------------------------
  // DUPLICATE EXTERNAL LEAD CHECK
  // ----------------------------------------------------------

  const finalLeadSourceId =
    data.lead_source_id ??
    existingLead.lead_source_id;

  const finalSourceLeadId =
    data.source_lead_id ??
    existingLead.source_lead_id;

  if (
    finalSourceLeadId &&
    finalLeadSourceId &&
    (
      data.source_lead_id !==
        existingLead.source_lead_id ||
      data.lead_source_id !==
        existingLead.lead_source_id
    )
  ) {
    const duplicateLead =
      await leadRepository.findLeadBySourceLeadId({
        companyId: numericCompanyId,
        leadSourceId: finalLeadSourceId,
        sourceLeadId: finalSourceLeadId,
      });

    if (
      duplicateLead &&
      Number(duplicateLead.id) !==
        numericLeadId
    ) {
      throw createError(
        "Another lead with the same external source ID already exists.",
        409
      );
    }
  }

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  return await leadRepository.updateLead(
    numericLeadId,
    numericCompanyId,
    data
  );
};

// ============================================================
// CHANGE STATUS
// ============================================================

export const changeLeadStatus = async (
  id,
  status,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  validateStatus(status);

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  // ----------------------------------------------------------
  // STATUS TRANSITION RULES
  // ----------------------------------------------------------

  if (
    existingLead.status === "won" &&
    status !== "won"
  ) {
    throw createError(
      "A won lead cannot be moved back to another status.",
      400
    );
  }

  if (
    existingLead.status === "lost" &&
    status !== "lost"
  ) {
    throw createError(
      "A lost lead cannot be moved back to another status.",
      400
    );
  }

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  return await leadRepository.updateLeadStatus(
    numericLeadId,
    numericCompanyId,
    status
  );
};

// ============================================================
// CHANGE PRIORITY
// ============================================================

export const changeLeadPriority = async (
  id,
  priority,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  validatePriority(priority);

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  return await leadRepository.updateLeadPriority(
    numericLeadId,
    numericCompanyId,
    priority
  );
};

// ============================================================
// ASSIGN LEAD
// ============================================================

export const assignLead = async (
  id,
  assignedTo,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  const numericUserId =
    assignedTo === null ||
    assignedTo === undefined ||
    assignedTo === ""
      ? null
      : validateId(
          assignedTo,
          "assigned user ID"
        );

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  // null means unassign
  if (numericUserId !== null) {
    await validateAssignedUser(
      numericUserId,
      numericCompanyId
    );
  }

  return await leadRepository.assignLead(
    numericLeadId,
    numericCompanyId,
    numericUserId
  );
};

// ============================================================
// UPDATE FOLLOW-UP
// ============================================================

export const updateLeadFollowup = async (
  id,
  nextFollowupAt,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  if (
    nextFollowupAt !== null &&
    nextFollowupAt !== undefined
  ) {
    const date =
      new Date(nextFollowupAt);

    if (Number.isNaN(date.getTime())) {
      throw createError(
        "Invalid follow-up date.",
        400
      );
    }
  }

  return await leadRepository.updateLeadFollowup(
    numericLeadId,
    numericCompanyId,
    nextFollowupAt
  );
};

// ============================================================
// DELETE LEAD
// ============================================================

export const removeLead = async (
  id,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericLeadId =
    validateId(id, "lead ID");

  const existingLead =
    await leadRepository.findLeadById(
      numericLeadId,
      numericCompanyId
    );

  if (!existingLead) {
    throw createError(
      "Lead not found.",
      404
    );
  }

  // ----------------------------------------------------------
  // PROTECT WON LEADS
  // ----------------------------------------------------------

  if (existingLead.status === "won") {
    throw createError(
      "Won leads cannot be deleted.",
      400
    );
  }

  const deleted =
    await leadRepository.deleteLead(
      numericLeadId,
      numericCompanyId
    );

  if (!deleted) {
    throw createError(
      "Unable to delete lead.",
      500
    );
  }

  return true;
};

// ============================================================
// GET LEADS BY CUSTOMER
// ============================================================

export const getLeadsByCustomer = async (
  customerId,
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericCustomerId =
    validateId(
      customerId,
      "customer ID"
    );

  await validateCustomer(
    numericCustomerId,
    numericCompanyId
  );

  return await leadRepository.findLeadsByCustomer(
    numericCustomerId,
    numericCompanyId
  );
};

// ============================================================
// GET LEADS BY ASSIGNED USER
// ============================================================

export const getLeadsByAssignedUser = async (
  assignedTo,
  companyId,
  options = {}
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const numericUserId =
    validateId(
      assignedTo,
      "assigned user ID"
    );

  await validateAssignedUser(
    numericUserId,
    numericCompanyId
  );

  let page = Number(options.page) || 1;
  let limit = Number(options.limit) || 10;

  if (page < 1) {
    page = 1;
  }

  if (limit < 1) {
    limit = 10;
  }

  if (limit > 100) {
    limit = 100;
  }

  const result =
    await leadRepository.findLeadsByAssignedUser(
      numericUserId,
      numericCompanyId,
      {
        page,
        limit,
      }
    );

  const total =
    Number(result.count) || 0;

  return {
    leads: result.rows,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

// ============================================================
// GET LEADS BY STATUS
// ============================================================

export const getLeadsByStatus = async (
  status,
  companyId,
  options = {}
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  validateStatus(status);

  let page = Number(options.page) || 1;
  let limit = Number(options.limit) || 10;

  if (page < 1) {
    page = 1;
  }

  if (limit < 1) {
    limit = 10;
  }

  if (limit > 100) {
    limit = 100;
  }

  const result =
    await leadRepository.findLeadsByStatus(
      status,
      numericCompanyId,
      {
        page,
        limit,
      }
    );

  const total =
    Number(result.count) || 0;

  return {
    leads: result.rows,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

// ============================================================
// GET UPCOMING FOLLOW-UPS
// ============================================================

export const getUpcomingFollowups = async (
  companyId,
  fromDate,
  toDate
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  const from =
    new Date(fromDate);

  const to =
    new Date(toDate);

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime())
  ) {
    throw createError(
      "Invalid follow-up date range.",
      400
    );
  }

  if (from > to) {
    throw createError(
      "From date cannot be greater than to date.",
      400
    );
  }

  return await leadRepository.findUpcomingFollowups(
    numericCompanyId,
    from,
    to
  );
};

// ============================================================
// GET OVERDUE FOLLOW-UPS
// ============================================================

export const getOverdueFollowups = async (
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  return await leadRepository.findOverdueFollowups(
    numericCompanyId,
    new Date()
  );
};

// ============================================================
// GET LEAD COUNTS BY STATUS
// ============================================================

export const getLeadCountsByStatus = async (
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  return await leadRepository.countLeadsByStatus(
    numericCompanyId
  );
};

// ============================================================
// GET LEAD COUNTS BY PRIORITY
// ============================================================

export const getLeadCountsByPriority = async (
  companyId
) => {
  const numericCompanyId =
    validateCompanyId(companyId);

  return await leadRepository.countLeadsByPriority(
    numericCompanyId
  );
};