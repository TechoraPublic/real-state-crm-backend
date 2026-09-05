import * as followUpRepository from "./followUps.repository.js";

import {User,Lead} from "../../databases/models.js"



/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const VALID_FOLLOWUP_TYPES = [
  "call",
  "whatsapp",
  "email",
  "meeting",
  "reminder",
  "other",
];

const VALID_FOLLOWUP_STATUSES = [
  "pending",
  "completed",
  "cancelled",
];


/*
|--------------------------------------------------------------------------
| ERROR HELPER
|--------------------------------------------------------------------------
*/

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};


/*
|--------------------------------------------------------------------------
| VALIDATE COMPANY ID
|--------------------------------------------------------------------------
*/

const validateCompanyId = (companyId) => {
  if (
    companyId === undefined ||
    companyId === null ||
    Number.isNaN(Number(companyId)) ||
    Number(companyId) <= 0
  ) {
    throw createError("Invalid company ID.", 400);
  }

  return Number(companyId);
};


/*
|--------------------------------------------------------------------------
| VALIDATE ID
|--------------------------------------------------------------------------
*/

const validateId = (id, fieldName = "ID") => {
  if (
    id === undefined ||
    id === null ||
    Number.isNaN(Number(id)) ||
    Number(id) <= 0
  ) {
    throw createError(`Invalid ${fieldName}.`, 400);
  }

  return Number(id);
};


/*
|--------------------------------------------------------------------------
| VALIDATE DATE
|--------------------------------------------------------------------------
*/

const validateDate = (date, fieldName = "Date") => {
  if (!date) {
    throw createError(`${fieldName} is required.`, 400);
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw createError(`Invalid ${fieldName}.`, 400);
  }

  return parsedDate;
};


/*
|--------------------------------------------------------------------------
| VALIDATE FOLLOW-UP TYPE
|--------------------------------------------------------------------------
*/

const validateFollowUpType = (type) => {
  if (!type) {
    throw createError("Follow-up type is required.", 400);
  }

  if (!VALID_FOLLOWUP_TYPES.includes(type)) {
    throw createError(
      `Invalid follow-up type. Allowed types: ${VALID_FOLLOWUP_TYPES.join(
        ", "
      )}.`,
      400
    );
  }

  return type;
};


/*
|--------------------------------------------------------------------------
| VALIDATE FOLLOW-UP STATUS
|--------------------------------------------------------------------------
*/

const validateFollowUpStatus = (status) => {
  if (!status) {
    throw createError("Follow-up status is required.", 400);
  }

  if (!VALID_FOLLOWUP_STATUSES.includes(status)) {
    throw createError(
      `Invalid follow-up status. Allowed statuses: ${VALID_FOLLOWUP_STATUSES.join(
        ", "
      )}.`,
      400
    );
  }

  return status;
};


/*
|--------------------------------------------------------------------------
| VALIDATE LEAD
|--------------------------------------------------------------------------
| Ensures lead belongs to the logged-in company.
|--------------------------------------------------------------------------
*/

const validateLead = async (leadId, companyId) => {
  const lead = await Lead.findOne({
    where: {
      id: leadId,
      company_id: companyId,
    },
  });

  if (!lead) {
    throw createError(
      "Lead not found or does not belong to your company.",
      404
    );
  }

  return lead;
};


/*
|--------------------------------------------------------------------------
| VALIDATE USER
|--------------------------------------------------------------------------
| Ensures user belongs to same company and is active.
|--------------------------------------------------------------------------
*/

const validateUser = async (userId, companyId) => {
  if (userId === null || userId === undefined) {
    return null;
  }

  const user = await User.findOne({
    where: {
      id: userId,
      company_id: companyId,
    },
  });

  if (!user) {
    throw createError(
      "User not found or does not belong to your company.",
      404
    );
  }

  if (user.status !== "active") {
    throw createError(
      "Cannot assign follow-up to an inactive user.",
      400
    );
  }

  return user;
};


/*
|--------------------------------------------------------------------------
| VALIDATE DATE RANGE
|--------------------------------------------------------------------------
*/

const validateDateRange = (fromDate, toDate) => {
  let validFromDate = null;
  let validToDate = null;

  if (fromDate) {
    validFromDate = validateDate(fromDate, "From date");
  }

  if (toDate) {
    validToDate = validateDate(toDate, "To date");
  }

  if (
    validFromDate &&
    validToDate &&
    validFromDate > validToDate
  ) {
    throw createError(
      "From date cannot be greater than to date.",
      400
    );
  }

  return {
    fromDate: validFromDate,
    toDate: validToDate,
  };
};


/*
|--------------------------------------------------------------------------
| CREATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const createFollowUp = async (
  data,
  companyId,
  createdBy
) => {
  const validCompanyId = validateCompanyId(companyId);

  const leadId = validateId(data.lead_id, "lead ID");

  const assignedTo = validateId(
    data.assigned_to,
    "assigned user ID"
  );

  const validCreatedBy =
    createdBy !== undefined && createdBy !== null
      ? validateId(createdBy, "creator user ID")
      : null;

  const type = validateFollowUpType(data.type || "call");

  const scheduledAt = validateDate(
    data.scheduled_at,
    "Scheduled date"
  );

  /*
  |--------------------------------------------------------------------------
  | Validate lead
  |--------------------------------------------------------------------------
  */

  await validateLead(
    leadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Validate assigned user
  |--------------------------------------------------------------------------
  */

  await validateUser(
    assignedTo,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Validate creator
  |--------------------------------------------------------------------------
  */

  if (validCreatedBy) {
    await validateUser(
      validCreatedBy,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Business rule
  |--------------------------------------------------------------------------
  | New follow-up should be scheduled for current/future time.
  |--------------------------------------------------------------------------
  */

  if (scheduledAt < new Date()) {
    throw createError(
      "Follow-up scheduled time cannot be in the past.",
      400
    );
  }

  const followUp =
    await followUpRepository.createFollowUp({
      lead_id: leadId,
      assigned_to: assignedTo,
      type,
      title: data.title,
      description: data.description ?? null,
      scheduled_at: scheduledAt,
      status: "pending",
      completed_at: null,
      outcome: null,
      created_by: validCreatedBy,
    });

  return followUp;
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UP BY ID
|--------------------------------------------------------------------------
*/

export const getFollowUpById = async (
  id,
  companyId
) => {
  const validCompanyId = validateCompanyId(companyId);

  const followUpId = validateId(
    id,
    "follow-up ID"
  );

  const followUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!followUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Tenant validation through Lead
  |--------------------------------------------------------------------------
  */

  await validateLead(
    followUp.lead_id,
    validCompanyId
  );

  return followUp;
};


/*
|--------------------------------------------------------------------------
| GET ALL FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const getAllFollowUps = async ({
  companyId,
  page = 1,
  limit = 20,
  leadId,
  assignedTo,
  createdBy,
  type,
  status,
  search,
  fromDate,
  toDate,
  sortBy = "scheduled_at",
  sortOrder = "ASC",
}) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validPage = Math.max(
    1,
    Number(page) || 1
  );

  const validLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 20)
  );

  /*
  |--------------------------------------------------------------------------
  | Validate optional lead
  |--------------------------------------------------------------------------
  */

  let validLeadId = null;

  if (
    leadId !== undefined &&
    leadId !== null
  ) {
    validLeadId = validateId(
      leadId,
      "lead ID"
    );

    await validateLead(
      validLeadId,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate assigned user
  |--------------------------------------------------------------------------
  */

  let validAssignedTo = null;

  if (
    assignedTo !== undefined &&
    assignedTo !== null
  ) {
    validAssignedTo = validateId(
      assignedTo,
      "assigned user ID"
    );

    await validateUser(
      validAssignedTo,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate creator
  |--------------------------------------------------------------------------
  */

  let validCreatedBy = null;

  if (
    createdBy !== undefined &&
    createdBy !== null
  ) {
    validCreatedBy = validateId(
      createdBy,
      "creator user ID"
    );

    await validateUser(
      validCreatedBy,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate type/status
  |--------------------------------------------------------------------------
  */

  if (type) {
    validateFollowUpType(type);
  }

  if (status) {
    validateFollowUpStatus(status);
  }

  /*
  |--------------------------------------------------------------------------
  | Validate dates
  |--------------------------------------------------------------------------
  */

  const {
    fromDate: validFromDate,
    toDate: validToDate,
  } = validateDateRange(
    fromDate,
    toDate
  );

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await followUpRepository.findAllFollowUps({
      page: validPage,
      limit: validLimit,
      leadId: validLeadId,
      assignedTo: validAssignedTo,
      createdBy: validCreatedBy,
      type,
      status,
      search,
      fromDate: validFromDate,
      toDate: validToDate,
      sortBy,
      sortOrder,
      companyId: validCompanyId,
    });

  return {
    followUps: result.rows,

    pagination: {
      total: result.count,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(
        result.count / validLimit
      ),
    },
  };
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
*/

export const getFollowUpsByLead = async ({
  leadId,
  companyId,
  page = 1,
  limit = 20,
  status,
  type,
  assignedTo,
  sortOrder = "ASC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validLeadId =
    validateId(leadId, "lead ID");

  await validateLead(
    validLeadId,
    validCompanyId
  );

  const validPage = Math.max(
    1,
    Number(page) || 1
  );

  const validLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 20)
  );

  if (status) {
    validateFollowUpStatus(status);
  }

  if (type) {
    validateFollowUpType(type);
  }

  let validAssignedTo = null;

  if (
    assignedTo !== undefined &&
    assignedTo !== null
  ) {
    validAssignedTo = validateId(
      assignedTo,
      "assigned user ID"
    );

    await validateUser(
      validAssignedTo,
      validCompanyId
    );
  }

  const result =
    await followUpRepository.findFollowUpsByLead({
      leadId: validLeadId,
      page: validPage,
      limit: validLimit,
      status,
      type,
      assignedTo: validAssignedTo,
      sortOrder,
      companyId: validCompanyId,
    });

  return {
    followUps: result.rows,

    pagination: {
      total: result.count,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(
        result.count / validLimit
      ),
    },
  };
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UPS BY USER
|--------------------------------------------------------------------------
*/

export const getFollowUpsByUser = async ({
  assignedTo,
  companyId,
  page = 1,
  limit = 20,
  status,
  type,
  fromDate,
  toDate,
  sortOrder = "ASC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validAssignedTo =
    validateId(
      assignedTo,
      "assigned user ID"
    );

  await validateUser(
    validAssignedTo,
    validCompanyId
  );

  const validPage = Math.max(
    1,
    Number(page) || 1
  );

  const validLimit = Math.min(
    100,
    Math.max(1, Number(limit) || 20)
  );

  if (status) {
    validateFollowUpStatus(status);
  }

  if (type) {
    validateFollowUpType(type);
  }

  const {
    fromDate: validFromDate,
    toDate: validToDate,
  } = validateDateRange(
    fromDate,
    toDate
  );

  const result =
    await followUpRepository.findFollowUpsByUser({
      assignedTo: validAssignedTo,
      page: validPage,
      limit: validLimit,
      status,
      type,
      fromDate: validFromDate,
      toDate: validToDate,
      sortOrder,
      companyId: validCompanyId,
    });

  return {
    followUps: result.rows,

    pagination: {
      total: result.count,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(
        result.count / validLimit
      ),
    },
  };
};


/*
|--------------------------------------------------------------------------
| UPDATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const updateFollowUp = async (
  id,
  data,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const followUpId =
    validateId(id, "follow-up ID");

  const existingFollowUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!existingFollowUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  await validateLead(
    existingFollowUp.lead_id,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Do not update completed/cancelled follow-ups normally
  |--------------------------------------------------------------------------
  */

  if (
    existingFollowUp.status === "completed"
  ) {
    throw createError(
      "Completed follow-up cannot be updated. Create a new follow-up instead.",
      400
    );
  }

  if (
    existingFollowUp.status === "cancelled"
  ) {
    throw createError(
      "Cancelled follow-up cannot be updated. Create a new follow-up instead.",
      400
    );
  }

  const updateData = {};

  /*
  |--------------------------------------------------------------------------
  | Assigned user
  |--------------------------------------------------------------------------
  */

  if (
    data.assigned_to !== undefined
  ) {
    const assignedTo =
      validateId(
        data.assigned_to,
        "assigned user ID"
      );

    await validateUser(
      assignedTo,
      validCompanyId
    );

    updateData.assigned_to =
      assignedTo;
  }

  /*
  |--------------------------------------------------------------------------
  | Type
  |--------------------------------------------------------------------------
  */

  if (data.type !== undefined) {
    updateData.type =
      validateFollowUpType(data.type);
  }

  /*
  |--------------------------------------------------------------------------
  | Title
  |--------------------------------------------------------------------------
  */

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  /*
  |--------------------------------------------------------------------------
  | Description
  |--------------------------------------------------------------------------
  */

  if (data.description !== undefined) {
    updateData.description =
      data.description;
  }

  /*
  |--------------------------------------------------------------------------
  | Scheduled date
  |--------------------------------------------------------------------------
  */

  if (
    data.scheduled_at !== undefined
  ) {
    const scheduledAt =
      validateDate(
        data.scheduled_at,
        "Scheduled date"
      );

    if (scheduledAt < new Date()) {
      throw createError(
        "Follow-up scheduled time cannot be in the past.",
        400
      );
    }

    updateData.scheduled_at =
      scheduledAt;

    updateData.status = "pending";
    updateData.completed_at = null;
  }

  if (Object.keys(updateData).length === 0) {
    throw createError(
      "No valid fields provided for update.",
      400
    );
  }

  return await followUpRepository.updateFollowUp(
    followUpId,
    updateData
  );
};


/*
|--------------------------------------------------------------------------
| COMPLETE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const completeFollowUp = async (
  id,
  outcome,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const followUpId =
    validateId(id, "follow-up ID");

  const followUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!followUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  await validateLead(
    followUp.lead_id,
    validCompanyId
  );

  if (
    followUp.status === "completed"
  ) {
    throw createError(
      "Follow-up is already completed.",
      400
    );
  }

  if (
    followUp.status === "cancelled"
  ) {
    throw createError(
      "Cancelled follow-up cannot be completed.",
      400
    );
  }

  const completedAt = new Date();

  return await followUpRepository.completeFollowUp(
    followUpId,
    completedAt,
    outcome ?? null
  );
};


/*
|--------------------------------------------------------------------------
| CANCEL FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const cancelFollowUp = async (
  id,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const followUpId =
    validateId(id, "follow-up ID");

  const followUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!followUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  await validateLead(
    followUp.lead_id,
    validCompanyId
  );

  if (
    followUp.status === "completed"
  ) {
    throw createError(
      "Completed follow-up cannot be cancelled.",
      400
    );
  }

  if (
    followUp.status === "cancelled"
  ) {
    throw createError(
      "Follow-up is already cancelled.",
      400
    );
  }

  return await followUpRepository.cancelFollowUp(
    followUpId
  );
};


/*
|--------------------------------------------------------------------------
| RESCHEDULE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const rescheduleFollowUp = async (
  id,
  scheduledAt,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const followUpId =
    validateId(id, "follow-up ID");

  const validScheduledAt =
    validateDate(
      scheduledAt,
      "Scheduled date"
    );

  if (validScheduledAt < new Date()) {
    throw createError(
      "New follow-up scheduled time cannot be in the past.",
      400
    );
  }

  const followUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!followUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  await validateLead(
    followUp.lead_id,
    validCompanyId
  );

  if (
    followUp.status === "completed"
  ) {
    throw createError(
      "Completed follow-up cannot be rescheduled.",
      400
    );
  }

  if (
    followUp.status === "cancelled"
  ) {
    throw createError(
      "Cancelled follow-up cannot be rescheduled.",
      400
    );
  }

  return await followUpRepository.rescheduleFollowUp(
    followUpId,
    validScheduledAt
  );
};


/*
|--------------------------------------------------------------------------
| DELETE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const deleteFollowUp = async (
  id,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const followUpId =
    validateId(id, "follow-up ID");

  const followUp =
    await followUpRepository.findFollowUpById(
      followUpId
    );

  if (!followUp) {
    throw createError(
      "Follow-up not found.",
      404
    );
  }

  await validateLead(
    followUp.lead_id,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Protect completed historical records
  |--------------------------------------------------------------------------
  */

  if (
    followUp.status === "completed"
  ) {
    throw createError(
      "Completed follow-up cannot be deleted because it is part of the sales history.",
      400
    );
  }

  const deleted =
    await followUpRepository.deleteFollowUp(
      followUpId
    );

  if (!deleted) {
    throw createError(
      "Failed to delete follow-up.",
      500
    );
  }

  return true;
};


/*
|--------------------------------------------------------------------------
| UPCOMING FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const getUpcomingFollowUps = async ({
  companyId,
  fromDate,
  toDate,
  assignedTo,
  limit = 20,
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const {
    fromDate: validFromDate,
    toDate: validToDate,
  } = validateDateRange(
    fromDate,
    toDate
  );

  if (!validFromDate || !validToDate) {
    throw createError(
      "From date and to date are required.",
      400
    );
  }

  let validAssignedTo = null;

  if (
    assignedTo !== undefined &&
    assignedTo !== null
  ) {
    validAssignedTo = validateId(
      assignedTo,
      "assigned user ID"
    );

    await validateUser(
      validAssignedTo,
      validCompanyId
    );
  }

  return await followUpRepository.findUpcomingFollowUps(
    {
      fromDate: validFromDate,
      toDate: validToDate,
      assignedTo: validAssignedTo,
      limit: Math.min(
        100,
        Math.max(1, Number(limit) || 20)
      ),
      companyId: validCompanyId,
    }
  );
};


/*
|--------------------------------------------------------------------------
| OVERDUE FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const getOverdueFollowUps = async ({
  companyId,
  assignedTo,
  limit = 20,
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  let validAssignedTo = null;

  if (
    assignedTo !== undefined &&
    assignedTo !== null
  ) {
    validAssignedTo = validateId(
      assignedTo,
      "assigned user ID"
    );

    await validateUser(
      validAssignedTo,
      validCompanyId
    );
  }

  return await followUpRepository.findOverdueFollowUps(
    {
      currentDate: new Date(),
      assignedTo: validAssignedTo,
      limit: Math.min(
        100,
        Math.max(1, Number(limit) || 20)
      ),
      companyId: validCompanyId,
    }
  );
};


/*
|--------------------------------------------------------------------------
| TODAY'S FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const getTodayFollowUps = async ({
  companyId,
  startOfDay,
  endOfDay,
  assignedTo,
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validStartOfDay =
    validateDate(
      startOfDay,
      "Start of day"
    );

  const validEndOfDay =
    validateDate(
      endOfDay,
      "End of day"
    );

  if (
    validStartOfDay > validEndOfDay
  ) {
    throw createError(
      "Start of day cannot be greater than end of day.",
      400
    );
  }

  let validAssignedTo = null;

  if (
    assignedTo !== undefined &&
    assignedTo !== null
  ) {
    validAssignedTo = validateId(
      assignedTo,
      "assigned user ID"
    );

    await validateUser(
      validAssignedTo,
      validCompanyId
    );
  }

  return await followUpRepository.findTodayFollowUps(
    {
      startOfDay: validStartOfDay,
      endOfDay: validEndOfDay,
      assignedTo: validAssignedTo,
      companyId: validCompanyId,
    }
  );
};


/*
|--------------------------------------------------------------------------
| LATEST FOLLOW-UP FOR LEAD
|--------------------------------------------------------------------------
*/

export const getLatestFollowUp = async (
  leadId,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validLeadId =
    validateId(leadId, "lead ID");

  await validateLead(
    validLeadId,
    validCompanyId
  );

  return await followUpRepository.findLatestFollowUp(
    validLeadId
  );
};


/*
|--------------------------------------------------------------------------
| COUNT FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
*/

export const getFollowUpCountByLead = async (
  leadId,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validLeadId =
    validateId(leadId, "lead ID");

  await validateLead(
    validLeadId,
    validCompanyId
  );

  return await followUpRepository.countFollowUpsByLead(
    validLeadId
  );
};


/*
|--------------------------------------------------------------------------
| COUNT FOLLOW-UPS BY STATUS
|--------------------------------------------------------------------------
*/

export const getFollowUpCountsByStatus = async (
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  return await followUpRepository.countFollowUpsByStatus(
    validCompanyId
  );
};