import * as leadActivityRepository from "./leadActivities.repository.js";

import { Lead, User } from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const VALID_ACTIVITY_TYPES = [
  "note",
  "call",
  "email",
  "whatsapp",
  "status_change",
  "assignment",
  "followup",
  "site_visit",
  "property_view",
  "deal",
];

const SYSTEM_ACTIVITY_TYPES = [
  "status_change",
  "assignment",
  "followup",
  "site_visit",
  "property_view",
  "deal",
];

const MANUAL_ACTIVITY_TYPES = [
  "note",
  "call",
  "email",
  "whatsapp",
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
| Validate Company
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
| Validate ID
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
| Validate Activity Type
|--------------------------------------------------------------------------
*/

const validateActivityType = (type) => {
  if (!type) {
    throw createError("Activity type is required.", 400);
  }

  if (!VALID_ACTIVITY_TYPES.includes(type)) {
    throw createError(
      `Invalid activity type. Allowed types: ${VALID_ACTIVITY_TYPES.join(", ")}.`,
      400
    );
  }

  return type;
};


/*
|--------------------------------------------------------------------------
| Validate Lead
|--------------------------------------------------------------------------
| Important:
| Lead must belong to the authenticated user's company.
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
| Validate User
|--------------------------------------------------------------------------
| If userId is provided, user must belong to the same company.
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
      "Cannot create activity for an inactive user.",
      400
    );
  }

  return user;
};


/*
|--------------------------------------------------------------------------
| Validate Activity Type Rules
|--------------------------------------------------------------------------
*/

const validateActivityRules = (type, { allowSystemGenerated = false }) => {
  /*
  |--------------------------------------------------------------------------
  | System-generated activities
  |--------------------------------------------------------------------------
  */

  if (
    SYSTEM_ACTIVITY_TYPES.includes(type) &&
    !allowSystemGenerated
  ) {
    throw createError(
      `Activity type '${type}' is system-generated and cannot be created manually.`,
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Manual activities
  |--------------------------------------------------------------------------
  */

  if (!MANUAL_ACTIVITY_TYPES.includes(type) &&
      !SYSTEM_ACTIVITY_TYPES.includes(type)) {
    throw createError(
      "Invalid activity type.",
      400
    );
  }
};


/*
|--------------------------------------------------------------------------
| Create Lead Activity
|--------------------------------------------------------------------------
| Used for:
|
| note
| call
| email
| whatsapp
|
| System-generated activities should normally be created internally
| by other services using createSystemActivity().
|--------------------------------------------------------------------------
*/

export const createLeadActivity = async (
  data,
  companyId,
  userId
) => {
  const validCompanyId = validateCompanyId(companyId);

  const leadId = validateId(data.lead_id, "lead ID");

  const type = validateActivityType(data.type);

  /*
  |--------------------------------------------------------------------------
  | Manual creation restriction
  |--------------------------------------------------------------------------
  */

  validateActivityRules(type, {
    allowSystemGenerated: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Validate Lead
  |--------------------------------------------------------------------------
  */

  await validateLead(
    leadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Activity User
  |--------------------------------------------------------------------------
  |
  | Normally the authenticated user becomes the activity owner.
  |
  */

  const activityUserId =
    userId !== undefined && userId !== null
      ? validateId(userId, "user ID")
      : null;

  if (activityUserId) {
    await validateUser(
      activityUserId,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Activity
  |--------------------------------------------------------------------------
  */

  const activity = await leadActivityRepository.createLeadActivity({
    lead_id: leadId,
    user_id: activityUserId,
    type,
    title: data.title ?? null,
    description: data.description ?? null,
    metadata: data.metadata ?? null,
  });

  return activity;
};


/*
|--------------------------------------------------------------------------
| Create System Activity
|--------------------------------------------------------------------------
| Internal function.
|
| Used by:
|
| Lead Service
| Follow-up Service
| Site Visit Service
| Deal Service
|
| Examples:
|
| status_change
| assignment
| followup
| site_visit
| property_view
| deal
|--------------------------------------------------------------------------
*/

export const createSystemActivity = async ({
  leadId,
  companyId,
  userId = null,
  type,
  title = null,
  description = null,
  metadata = null,
}) => {
  const validCompanyId = validateCompanyId(companyId);

  const validLeadId = validateId(
    leadId,
    "lead ID"
  );

  const validType = validateActivityType(type);

  /*
  |--------------------------------------------------------------------------
  | Only system activity types allowed
  |--------------------------------------------------------------------------
  */

  if (!SYSTEM_ACTIVITY_TYPES.includes(validType)) {
    throw createError(
      `Activity type '${validType}' is not a system activity.`,
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Lead
  |--------------------------------------------------------------------------
  */

  await validateLead(
    validLeadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Validate User
  |--------------------------------------------------------------------------
  */

  let validUserId = null;

  if (userId !== null && userId !== undefined) {
    validUserId = validateId(
      userId,
      "user ID"
    );

    await validateUser(
      validUserId,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Activity
  |--------------------------------------------------------------------------
  */

  return await leadActivityRepository.createLeadActivity({
    lead_id: validLeadId,
    user_id: validUserId,
    type: validType,
    title,
    description,
    metadata,
  });
};


/*
|--------------------------------------------------------------------------
| Get Activity By ID
|--------------------------------------------------------------------------
*/

export const getLeadActivityById = async (
  id,
  companyId
) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validActivityId = validateId(
    id,
    "activity ID"
  );

  /*
  |--------------------------------------------------------------------------
  | First find activity
  |--------------------------------------------------------------------------
  */

  const activity =
    await leadActivityRepository.findLeadActivityById(
      validActivityId
    );

  if (!activity) {
    throw createError(
      "Lead activity not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate activity's lead belongs to company
  |--------------------------------------------------------------------------
  */

  await validateLead(
    activity.lead_id,
    validCompanyId
  );

  return activity;
};


/*
|--------------------------------------------------------------------------
| Get Activities By Lead
|--------------------------------------------------------------------------
*/

export const getActivitiesByLead = async ({
  leadId,
  companyId,
  page = 1,
  limit = 20,
  type,
  userId,
  search,
  sortOrder = "DESC",
}) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validLeadId = validateId(
    leadId,
    "lead ID"
  );

  /*
  |--------------------------------------------------------------------------
  | Validate Lead
  |--------------------------------------------------------------------------
  */

  await validateLead(
    validLeadId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Validate pagination
  |--------------------------------------------------------------------------
  */

  const validPage = Math.max(
    1,
    Number(page) || 1
  );

  const validLimit = Math.min(
    100,
    Math.max(
      1,
      Number(limit) || 20
    )
  );

  /*
  |--------------------------------------------------------------------------
  | Validate Type
  |--------------------------------------------------------------------------
  */

  if (type) {
    validateActivityType(type);
  }

  /*
  |--------------------------------------------------------------------------
  | Validate User
  |--------------------------------------------------------------------------
  */

  let validUserId = null;

  if (userId !== undefined && userId !== null) {
    validUserId = validateId(
      userId,
      "user ID"
    );

    await validateUser(
      validUserId,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch Activities
  |--------------------------------------------------------------------------
  */

  const result =
    await leadActivityRepository.findActivitiesByLead({
      leadId: validLeadId,
      page: validPage,
      limit: validLimit,
      type,
      userId: validUserId,
      search,
      sortOrder,
    });

  return {
    activities: result.rows,
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
| Get All Activities
|--------------------------------------------------------------------------
| Company-wide activity feed.
|--------------------------------------------------------------------------
*/

export const getAllActivities = async ({
  companyId,
  page = 1,
  limit = 20,
  leadId,
  userId,
  type,
  search,
  fromDate,
  toDate,
  sortOrder = "DESC",
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
    Math.max(
      1,
      Number(limit) || 20
    )
  );

  /*
  |--------------------------------------------------------------------------
  | Validate Lead If Provided
  |--------------------------------------------------------------------------
  */

  let validLeadId = null;

  if (leadId !== undefined && leadId !== null) {
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
  | Validate User If Provided
  |--------------------------------------------------------------------------
  */

  let validUserId = null;

  if (userId !== undefined && userId !== null) {
    validUserId = validateId(
      userId,
      "user ID"
    );

    await validateUser(
      validUserId,
      validCompanyId
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Type
  |--------------------------------------------------------------------------
  */

  if (type) {
    validateActivityType(type);
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch Activities
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Repository itself doesn't know company_id.
  |
  | Therefore this generic method should eventually be changed to
  | query activities through Lead -> company_id.
  |
  | For now we only allow company-scoped filtering after validating
  | lead/user references.
  |
  |--------------------------------------------------------------------------
  */

  const result =
    await leadActivityRepository.findAllActivities({
      page: validPage,
      limit: validLimit,
      leadId: validLeadId,
      userId: validUserId,
      type,
      search,
      fromDate,
      toDate,
      sortOrder,
    });

  return {
    activities: result.rows,
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
| Delete Lead Activity
|--------------------------------------------------------------------------
*/

export const deleteLeadActivity = async (
  id,
  companyId
) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validActivityId = validateId(
    id,
    "activity ID"
  );

  /*
  |--------------------------------------------------------------------------
  | Find activity
  |--------------------------------------------------------------------------
  */

  const activity =
    await leadActivityRepository.findLeadActivityById(
      validActivityId
    );

  if (!activity) {
    throw createError(
      "Lead activity not found.",
      404
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate company ownership
  |--------------------------------------------------------------------------
  */

  await validateLead(
    activity.lead_id,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | System activities should not be deleted
  |--------------------------------------------------------------------------
  */

  if (
    SYSTEM_ACTIVITY_TYPES.includes(
      activity.type
    )
  ) {
    throw createError(
      "System-generated activities cannot be deleted.",
      400
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleted =
    await leadActivityRepository.deleteLeadActivity(
      validActivityId
    );

  if (!deleted) {
    throw createError(
      "Failed to delete lead activity.",
      500
    );
  }

  return true;
};


/*
|--------------------------------------------------------------------------
| Get Activity Count By Lead
|--------------------------------------------------------------------------
*/

export const getActivityCountByLead = async (
  leadId,
  companyId
) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validLeadId = validateId(
    leadId,
    "lead ID"
  );

  await validateLead(
    validLeadId,
    validCompanyId
  );

  return await leadActivityRepository.countActivitiesByLead(
    validLeadId
  );
};


/*
|--------------------------------------------------------------------------
| Get Activity Counts By Type
|--------------------------------------------------------------------------
*/

export const getActivityCountsByType = async (
  leadId,
  companyId
) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validLeadId = validateId(
    leadId,
    "lead ID"
  );

  await validateLead(
    validLeadId,
    validCompanyId
  );

  return await leadActivityRepository.countActivitiesByType(
    validLeadId
  );
};


/*
|--------------------------------------------------------------------------
| Get Latest Activity
|--------------------------------------------------------------------------
*/

export const getLatestActivity = async (
  leadId,
  companyId
) => {
  const validCompanyId = validateCompanyId(
    companyId
  );

  const validLeadId = validateId(
    leadId,
    "lead ID"
  );

  await validateLead(
    validLeadId,
    validCompanyId
  );

  return await leadActivityRepository.findLatestActivity(
    validLeadId
  );
};