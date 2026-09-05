import * as siteVisitRepository from "./siteVisit.repositories.js";
import * as leadRepository from "../leads/lead.repository.js";
import * as propertyRepository from "../properties/properties.repositories.js";
import {User} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const SITE_VISIT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const TERMINAL_STATUSES = [
  "completed",
  "cancelled",
  "no_show",
];

const ACTIVE_STATUSES = [
  "scheduled",
  "confirmed",
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

const validateCompanyId = (companyId) =>
  parsePositiveInteger(companyId, "Company ID");

const validateUserId = (userId) =>
  parsePositiveInteger(userId, "User ID");

const validateLeadId = (leadId) =>
  parsePositiveInteger(leadId, "Lead ID");

const validatePropertyId = (propertyId) =>
  parsePositiveInteger(propertyId, "Property ID");

const validateSiteVisitId = (siteVisitId) =>
  parsePositiveInteger(siteVisitId, "Site visit ID");

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue === "" ? null : normalizedValue;
};

/*
|--------------------------------------------------------------------------
| Date Validation
|--------------------------------------------------------------------------
*/

const validateScheduledAt = (scheduledAt) => {
  if (!scheduledAt) {
    throw createError("Scheduled date and time are required.");
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    throw createError("Scheduled date and time must be valid.");
  }

  return date;
};

const validateFutureDate = (scheduledAt) => {
  const date = validateScheduledAt(scheduledAt);

  if (date.getTime() <= Date.now()) {
    throw createError(
      "Site visit scheduled date and time must be in the future."
    );
  }

  return date;
};

/*
|--------------------------------------------------------------------------
| Status Validation
|--------------------------------------------------------------------------
*/

const validateStatus = (status) => {
  if (!SITE_VISIT_STATUSES.includes(status)) {
    throw createError(
      `Site visit status must be one of: ${SITE_VISIT_STATUSES.join(", ")}.`
    );
  }

  return status;
};

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

const calculatePagination = (page, limit, total) => {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 20;
  const parsedTotal = Number(total) || 0;

  const totalPages =
    parsedTotal === 0
      ? 0
      : Math.ceil(parsedTotal / parsedLimit);

  return {
    page: parsedPage,
    limit: parsedLimit,
    total: parsedTotal,
    totalPages,
    hasNextPage: parsedPage < totalPages,
    hasPreviousPage:
      parsedPage > 1 && totalPages > 0,
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
  const validLeadId = validateLeadId(leadId);
  const validCompanyId = validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Lead repository should return company-scoped lead
  |--------------------------------------------------------------------------
  */

  const lead =
    await leadRepository.findLeadById(
      validLeadId,
      validCompanyId
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
| Verify Property
|--------------------------------------------------------------------------
*/

const verifyProperty = async (
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

  if (property.status !== "available") {
    throw createError(
      `Property is currently ${property.status} and cannot be scheduled for a site visit.`
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
  const validUserId =
    validateUserId(userId);

  const validCompanyId =
    validateCompanyId(companyId);

  const user =
    await User.findOne({
      where: {
        id: validUserId,
        company_id: validCompanyId,
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
      "Assigned user not found.",
      404
    );
  }

  if (user.status !== "active") {
    throw createError(
      "Assigned user is inactive."
    );
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Create Site Visit
|--------------------------------------------------------------------------
*/

export const createSiteVisit = async (
  data,
  companyId,
  createdBy
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validCreatedBy =
    validateUserId(createdBy);

  const leadId =
    validateLeadId(data.lead_id);

  const propertyId =
    validatePropertyId(data.property_id);

  const assignedTo =
    validateUserId(data.assigned_to);

  /*
  |--------------------------------------------------------------------------
  | Verify Lead
  |--------------------------------------------------------------------------
  */

  const lead = await verifyLead(
    leadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Verify Property
  |--------------------------------------------------------------------------
  */

  const property =
    await verifyProperty(
      propertyId,
      validCompanyId
    );

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
  | Verify Creator
  |--------------------------------------------------------------------------
  */

  await verifyAssignedUser(
    validCreatedBy,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Lead and Property Relationship
  |--------------------------------------------------------------------------
  | If lead already has a property assigned,
  | make sure requested property is consistent.
  |--------------------------------------------------------------------------
  */

  if (
    lead.property_id &&
    Number(lead.property_id) !== propertyId
  ) {
    throw createError(
      "The selected property does not match the property assigned to this lead."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Scheduled Time
  |--------------------------------------------------------------------------
  */

  const scheduledAt =
    validateFutureDate(
      data.scheduled_at
    );

  /*
  |--------------------------------------------------------------------------
  | Prepare Data
  |--------------------------------------------------------------------------
  */

  const siteVisitData = {
    lead_id: leadId,
    property_id: propertyId,
    assigned_to: assignedTo,
    scheduled_at: scheduledAt,
    status: "scheduled",
    notes: normalizeString(data.notes),
    outcome: null,
    created_by: validCreatedBy,
  };

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  return await siteVisitRepository.createSiteVisit(
    siteVisitData
  );
};

/*
|--------------------------------------------------------------------------
| Get All Site Visits
|--------------------------------------------------------------------------
*/

export const getAllSiteVisits = async ({
  companyId,
  page = 1,
  limit = 20,
  status,
  leadId,
  propertyId,
  assignedTo,
  fromDate,
  toDate,
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

  if (parsedLimit > 100) {
    throw createError(
      "Limit cannot exceed 100."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Status
  |--------------------------------------------------------------------------
  */

  if (status) {
    validateStatus(status);
  }

  /*
  |--------------------------------------------------------------------------
  | Validate IDs
  |--------------------------------------------------------------------------
  */

  if (leadId) {
    validateLeadId(leadId);
  }

  if (propertyId) {
    validatePropertyId(propertyId);
  }

  if (assignedTo) {
    validateUserId(assignedTo);
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Date Range
  |--------------------------------------------------------------------------
  */

  let parsedFromDate = null;
  let parsedToDate = null;

  if (fromDate) {
    parsedFromDate =
      validateScheduledAt(fromDate);
  }

  if (toDate) {
    parsedToDate =
      validateScheduledAt(toDate);
  }

  if (
    parsedFromDate &&
    parsedToDate &&
    parsedFromDate > parsedToDate
  ) {
    throw createError(
      "From date cannot be greater than to date."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Sort Order
  |--------------------------------------------------------------------------
  */

  const normalizedSortOrder =
    String(sortOrder || "DESC")
      .toUpperCase();

  if (
    !["ASC", "DESC"].includes(
      normalizedSortOrder
    )
  ) {
    throw createError(
      "Sort order must be ASC or DESC."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await siteVisitRepository.findAllSiteVisits({
      companyId: validCompanyId,
      page: parsedPage,
      limit: parsedLimit,
      status,
      leadId,
      propertyId,
      assignedTo,
      fromDate: parsedFromDate,
      toDate: parsedToDate,
      sortOrder: normalizedSortOrder,
    });

  return {
    siteVisits: result.rows,

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
| Get Site Visit By ID
|--------------------------------------------------------------------------
*/

export const getSiteVisitById = async (
  siteVisitId,
  companyId
) => {
  const validSiteVisitId =
    validateSiteVisitId(siteVisitId);

  const validCompanyId =
    validateCompanyId(companyId);

  const siteVisit =
    await siteVisitRepository.findSiteVisitById(
      validSiteVisitId,
      validCompanyId
    );

  if (!siteVisit) {
    throw createError(
      "Site visit not found.",
      404
    );
  }

  return siteVisit;
};

/*
|--------------------------------------------------------------------------
| Update Site Visit
|--------------------------------------------------------------------------
*/

export const updateSiteVisit = async (
  siteVisitId,
  data,
  companyId,
  userId
) => {
  const validSiteVisitId =
    validateSiteVisitId(siteVisitId);

  const validCompanyId =
    validateCompanyId(companyId);

  const validUserId =
    validateUserId(userId);

  /*
  |--------------------------------------------------------------------------
  | Get Existing Visit
  |--------------------------------------------------------------------------
  */

  const existingVisit =
    await siteVisitRepository.findSiteVisitById(
      validSiteVisitId,
      validCompanyId
    );

  if (!existingVisit) {
    throw createError(
      "Site visit not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Terminal Visit Protection
  |--------------------------------------------------------------------------
  */

  if (
    TERMINAL_STATUSES.includes(
      existingVisit.status
    )
  ) {
    throw createError(
      `Site visit cannot be updated because it is already ${existingVisit.status}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Prepare Update Data
  |--------------------------------------------------------------------------
  */

  const updateData = {};

  /*
  |--------------------------------------------------------------------------
  | Property
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "property_id"
    )
  ) {
    const propertyId =
      validatePropertyId(
        data.property_id
      );

    await verifyProperty(
      propertyId,
      validCompanyId
    );

    updateData.property_id =
      propertyId;
  }

  /*
  |--------------------------------------------------------------------------
  | Assigned User
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "assigned_to"
    )
  ) {
    const assignedTo =
      validateUserId(
        data.assigned_to
      );

    await verifyAssignedUser(
      assignedTo,
      validCompanyId
    );

    updateData.assigned_to =
      assignedTo;
  }

  /*
  |--------------------------------------------------------------------------
  | Scheduled At
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "scheduled_at"
    )
  ) {
    updateData.scheduled_at =
      validateFutureDate(
        data.scheduled_at
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Notes
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      data,
      "notes"
    )
  ) {
    updateData.notes =
      normalizeString(
        data.notes
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent Forbidden Fields
  |--------------------------------------------------------------------------
  */

  delete updateData.status;
  delete updateData.outcome;
  delete updateData.lead_id;
  delete updateData.created_by;
  delete updateData.id;

  /*
  |--------------------------------------------------------------------------
  | Validate User Making Update
  |--------------------------------------------------------------------------
  */

  await verifyAssignedUser(
    validUserId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  return await siteVisitRepository.updateSiteVisit(
    validSiteVisitId,
    validCompanyId,
    updateData
  );
};

/*
|--------------------------------------------------------------------------
| Change Site Visit Status
|--------------------------------------------------------------------------
*/

export const changeSiteVisitStatus = async (
  siteVisitId,
  status,
  companyId,
  userId,
  outcome
) => {
  const validSiteVisitId =
    validateSiteVisitId(siteVisitId);

  const validCompanyId =
    validateCompanyId(companyId);

  const validUserId =
    validateUserId(userId);

  validateStatus(status);

  /*
  |--------------------------------------------------------------------------
  | Verify User
  |--------------------------------------------------------------------------
  */

  await verifyAssignedUser(
    validUserId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Get Existing Visit
  |--------------------------------------------------------------------------
  */

  const existingVisit =
    await siteVisitRepository.findSiteVisitById(
      validSiteVisitId,
      validCompanyId
    );

  if (!existingVisit) {
    throw createError(
      "Site visit not found.",
      404
    );
  }

  const currentStatus =
    existingVisit.status;

  /*
  |--------------------------------------------------------------------------
  | Same Status
  |--------------------------------------------------------------------------
  */

  if (currentStatus === status) {
    throw createError(
      `Site visit is already ${status}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Terminal Status Protection
  |--------------------------------------------------------------------------
  */

  if (
    TERMINAL_STATUSES.includes(
      currentStatus
    )
  ) {
    throw createError(
      `Site visit cannot be changed because it is already ${currentStatus}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Status Transition Rules
  |--------------------------------------------------------------------------
  */

  const allowedTransitions = {
    scheduled: [
      "confirmed",
      "cancelled",
      "no_show",
    ],

    confirmed: [
      "completed",
      "cancelled",
      "no_show",
    ],
  };

  const allowedNextStatuses =
    allowedTransitions[
      currentStatus
    ] || [];

  if (
    !allowedNextStatuses.includes(
      status
    )
  ) {
    throw createError(
      `Cannot change site visit status from ${currentStatus} to ${status}.`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Outcome Validation
  |--------------------------------------------------------------------------
  */

  let normalizedOutcome;

  if (outcome !== undefined) {
    normalizedOutcome =
      normalizeString(outcome);
  }

  if (
    status === "completed" &&
    !normalizedOutcome &&
    !existingVisit.outcome
  ) {
    throw createError(
      "Outcome is required when completing a site visit."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Status Update
  |--------------------------------------------------------------------------
  */

  return await siteVisitRepository.updateSiteVisitStatus(
    validSiteVisitId,
    validCompanyId,
    status,
    normalizedOutcome
  );
};

/*
|--------------------------------------------------------------------------
| Delete Site Visit
|--------------------------------------------------------------------------
*/

export const deleteSiteVisit = async (
  siteVisitId,
  companyId
) => {
  const validSiteVisitId =
    validateSiteVisitId(siteVisitId);

  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Find Existing Visit
  |--------------------------------------------------------------------------
  */

  const existingVisit =
    await siteVisitRepository.findSiteVisitById(
      validSiteVisitId,
      validCompanyId
    );

  if (!existingVisit) {
    throw createError(
      "Site visit not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Protect Historical Data
  |--------------------------------------------------------------------------
  */

  if (
    existingVisit.status === "completed"
  ) {
    throw createError(
      "Completed site visits cannot be deleted."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleted =
    await siteVisitRepository.deleteSiteVisit(
      validSiteVisitId,
      validCompanyId
    );

  if (!deleted) {
    throw createError(
      "Site visit could not be deleted.",
      500
    );
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Get Site Visits By Lead
|--------------------------------------------------------------------------
*/

export const getSiteVisitsByLead = async ({
  leadId,
  companyId,
  page = 1,
  limit = 20,
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validLeadId =
    validateLeadId(leadId);

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

  const normalizedSortOrder =
    String(sortOrder || "DESC")
      .toUpperCase();

  if (
    !["ASC", "DESC"].includes(
      normalizedSortOrder
    )
  ) {
    throw createError(
      "Sort order must be ASC or DESC."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Lead
  |--------------------------------------------------------------------------
  */

  await verifyLead(
    validLeadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Fetch Visits
  |--------------------------------------------------------------------------
  */

  const result =
    await siteVisitRepository.findSiteVisitsByLead({
      leadId: validLeadId,
      companyId: validCompanyId,
      page: parsedPage,
      limit: parsedLimit,
      sortOrder: normalizedSortOrder,
    });

  return {
    siteVisits: result.rows,

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
| Get Site Visits By Property
|--------------------------------------------------------------------------
*/

export const getSiteVisitsByProperty = async ({
  propertyId,
  companyId,
  page = 1,
  limit = 20,
  status,
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validPropertyId =
    validatePropertyId(propertyId);

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

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  if (status) {
    validateStatus(status);
  }

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  */

  const normalizedSortOrder =
    String(sortOrder || "DESC")
      .toUpperCase();

  if (
    !["ASC", "DESC"].includes(
      normalizedSortOrder
    )
  ) {
    throw createError(
      "Sort order must be ASC or DESC."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Property
  |--------------------------------------------------------------------------
  */

  await propertyRepository.findPropertyById(
    validPropertyId,
    validCompanyId
  ).then((property) => {
    if (!property) {
      throw createError(
        "Property not found.",
        404
      );
    }
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Visits
  |--------------------------------------------------------------------------
  */

  const result =
    await siteVisitRepository.findSiteVisitsByProperty({
      propertyId: validPropertyId,
      companyId: validCompanyId,
      page: parsedPage,
      limit: parsedLimit,
      status,
      sortOrder: normalizedSortOrder,
    });

  return {
    siteVisits: result.rows,

    pagination:
      calculatePagination(
        parsedPage,
        parsedLimit,
        result.count
      ),
  };
};