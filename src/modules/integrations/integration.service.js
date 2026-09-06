import * as integrationRepository from "./integration.repository.js";
import { LeadSource } from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const INTEGRATION_STATUSES = [
  "active",
  "inactive",
  "error",
];

const PLATFORM_PATTERN = /^[a-z0-9_-]+$/i;

/*
|--------------------------------------------------------------------------
| VALIDATORS
|--------------------------------------------------------------------------
*/

const validateId = (value, fieldName = "ID") => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(
      `${fieldName} must be a positive integer.`
    );
    error.statusCode = 400;
    throw error;
  }

  return id;
};

const validateCompanyId = (companyId) => {
  return validateId(companyId, "Company ID");
};

const validateIntegrationId = (integrationId) => {
  return validateId(integrationId, "Integration ID");
};

const validateLeadSourceId = (leadSourceId) => {
  return validateId(leadSourceId, "Lead source ID");
};

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();

  return normalized || null;
};

const validateName = (name) => {
  const normalizedName = normalizeString(name);

  if (!normalizedName) {
    const error = new Error(
      "Integration name is required."
    );

    error.statusCode = 400;
    throw error;
  }

  if (normalizedName.length > 150) {
    const error = new Error(
      "Integration name cannot exceed 150 characters."
    );

    error.statusCode = 400;
    throw error;
  }

  return normalizedName;
};

const validatePlatform = (platform) => {
  const normalizedPlatform =
    normalizeString(platform)?.toLowerCase();

  if (!normalizedPlatform) {
    const error = new Error(
      "Platform is required."
    );

    error.statusCode = 400;
    throw error;
  }

  if (normalizedPlatform.length > 100) {
    const error = new Error(
      "Platform cannot exceed 100 characters."
    );

    error.statusCode = 400;
    throw error;
  }

  if (!PLATFORM_PATTERN.test(normalizedPlatform)) {
    const error = new Error(
      "Platform can contain only letters, numbers, hyphens and underscores."
    );

    error.statusCode = 400;
    throw error;
  }

  return normalizedPlatform;
};

const validateStatus = (status) => {
  const normalizedStatus =
    normalizeString(status)?.toLowerCase();

  if (!INTEGRATION_STATUSES.includes(normalizedStatus)) {
    const error = new Error(
      `Invalid integration status. Allowed values: ${INTEGRATION_STATUSES.join(
        ", "
      )}.`
    );

    error.statusCode = 400;
    throw error;
  }

  return normalizedStatus;
};

/*
|--------------------------------------------------------------------------
| VERIFY LEAD SOURCE
|--------------------------------------------------------------------------
*/

const verifyLeadSource = async (
  leadSourceId,
  companyId
) => {
  const leadSource = await LeadSource.findOne({
    where: {
      id: leadSourceId,
      company_id: companyId,
    },
  });

  if (!leadSource) {
    const error = new Error(
      "Lead source not found for this company."
    );

    error.statusCode = 404;
    throw error;
  }

  return leadSource;
};

/*
|--------------------------------------------------------------------------
| SANITIZE INTEGRATION RESPONSE
|--------------------------------------------------------------------------
|
| config may contain API keys, access tokens,
| client secrets, webhook secrets etc.
|
| Never expose config directly in normal API responses.
|
*/

const sanitizeIntegration = (integration) => {
  if (!integration) {
    return null;
  }

  const data =
    typeof integration.toJSON === "function"
      ? integration.toJSON()
      : { ...integration };

  delete data.config;

  return data;
};

/*
|--------------------------------------------------------------------------
| CREATE INTEGRATION
|--------------------------------------------------------------------------
*/

export const createIntegration = async ({
  companyId,
  leadSourceId,
  name,
  platform,
  config = null,
  status = "inactive",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validLeadSourceId =
    validateLeadSourceId(leadSourceId);

  const validName =
    validateName(name);

  const validPlatform =
    validatePlatform(platform);

  const validStatus =
    validateStatus(status);

  /*
  |--------------------------------------------------------------------------
  | Verify lead source belongs to company
  |--------------------------------------------------------------------------
  */

  await verifyLeadSource(
    validLeadSourceId,
    validCompanyId
  );

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate integration name
  |--------------------------------------------------------------------------
  */

  const existingIntegration =
    await integrationRepository.findIntegrationByName(
      validCompanyId,
      validName
    );

  if (existingIntegration) {
    const error = new Error(
      "An integration with this name already exists."
    );

    error.statusCode = 409;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  const integration =
    await integrationRepository.createIntegration({
      company_id: validCompanyId,
      lead_source_id: validLeadSourceId,
      name: validName,
      platform: validPlatform,
      config,
      status: validStatus,
    });

  return sanitizeIntegration(
    integration
  );
};

/*
|--------------------------------------------------------------------------
| GET INTEGRATION BY ID
|--------------------------------------------------------------------------
*/

export const getIntegrationById = async ({
  integrationId,
  companyId,
}) => {
  const validIntegrationId =
    validateIntegrationId(integrationId);

  const validCompanyId =
    validateCompanyId(companyId);

  const integration =
    await integrationRepository.findIntegrationById(
      validIntegrationId,
      validCompanyId
    );

  if (!integration) {
    const error = new Error(
      "Integration not found."
    );

    error.statusCode = 404;
    throw error;
  }

  return sanitizeIntegration(
    integration
  );
};

/*
|--------------------------------------------------------------------------
| GET ALL INTEGRATIONS
|--------------------------------------------------------------------------
*/

export const getAllIntegrations = async ({
  companyId,
  page = 1,
  limit = 20,
  search,
  platform,
  status,
  leadSourceId,
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validPage = Math.max(
    Number(page) || 1,
    1
  );

  const validLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const normalizedSearch =
    normalizeString(search);

  const normalizedPlatform =
    platform
      ? validatePlatform(platform)
      : undefined;

  const normalizedStatus =
    status
      ? validateStatus(status)
      : undefined;

  const normalizedLeadSourceId =
    leadSourceId
      ? validateLeadSourceId(leadSourceId)
      : undefined;

  /*
  |--------------------------------------------------------------------------
  | Allowed sorting fields
  |--------------------------------------------------------------------------
  */

  const allowedSortFields = [
    "id",
    "name",
    "platform",
    "status",
    "last_synced_at",
    "created_at",
    "updated_at",
  ];

  const finalSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

  const finalSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await integrationRepository.findAllIntegrations({
      companyId: validCompanyId,
      page: validPage,
      limit: validLimit,
      search: normalizedSearch,
      platform: normalizedPlatform,
      status: normalizedStatus,
      leadSourceId: normalizedLeadSourceId,
      sortBy: finalSortBy,
      sortOrder: finalSortOrder,
    });

  /*
  |--------------------------------------------------------------------------
  | Remove config from every response
  |--------------------------------------------------------------------------
  */

  result.rows = result.rows.map(
    sanitizeIntegration
  );

  return result;
};

/*
|--------------------------------------------------------------------------
| GET ACTIVE INTEGRATIONS
|--------------------------------------------------------------------------
*/

export const getActiveIntegrations = async ({
  companyId,
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const integrations =
    await integrationRepository.findActiveIntegrations(
      validCompanyId
    );

  return integrations.map(
    sanitizeIntegration
  );
};

/*
|--------------------------------------------------------------------------
| UPDATE INTEGRATION
|--------------------------------------------------------------------------
*/

export const updateIntegration = async ({
  integrationId,
  companyId,
  leadSourceId,
  name,
  platform,
  config,
  status,
}) => {
  const validIntegrationId =
    validateIntegrationId(integrationId);

  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Check existing integration
  |--------------------------------------------------------------------------
  */

  const existingIntegration =
    await integrationRepository.findIntegrationById(
      validIntegrationId,
      validCompanyId
    );

  if (!existingIntegration) {
    const error = new Error(
      "Integration not found."
    );

    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  /*
  |--------------------------------------------------------------------------
  | NAME
  |--------------------------------------------------------------------------
  */

  if (name !== undefined) {
    const validName =
      validateName(name);

    const duplicateIntegration =
      await integrationRepository.findIntegrationByName(
        validCompanyId,
        validName,
        validIntegrationId
      );

    if (duplicateIntegration) {
      const error = new Error(
        "An integration with this name already exists."
      );

      error.statusCode = 409;
      throw error;
    }

    updateData.name = validName;
  }

  /*
  |--------------------------------------------------------------------------
  | LEAD SOURCE
  |--------------------------------------------------------------------------
  */

  if (leadSourceId !== undefined) {
    const validLeadSourceId =
      validateLeadSourceId(leadSourceId);

    await verifyLeadSource(
      validLeadSourceId,
      validCompanyId
    );

    updateData.lead_source_id =
      validLeadSourceId;
  }

  /*
  |--------------------------------------------------------------------------
  | PLATFORM
  |--------------------------------------------------------------------------
  */

  if (platform !== undefined) {
    updateData.platform =
      validatePlatform(platform);
  }

  /*
  |--------------------------------------------------------------------------
  | CONFIG
  |--------------------------------------------------------------------------
  */

  if (config !== undefined) {
    updateData.config = config;
  }

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  if (status !== undefined) {
    updateData.status =
      validateStatus(status);
  }

  /*
  |--------------------------------------------------------------------------
  | No fields provided
  |--------------------------------------------------------------------------
  */

  if (Object.keys(updateData).length === 0) {
    const error = new Error(
      "No valid fields provided for update."
    );

    error.statusCode = 400;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const updatedIntegration =
    await integrationRepository.updateIntegration(
      validIntegrationId,
      validCompanyId,
      updateData
    );

  if (!updatedIntegration) {
    const error = new Error(
      "Integration could not be updated."
    );

    error.statusCode = 500;
    throw error;
  }

  return sanitizeIntegration(
    updatedIntegration
  );
};

/*
|--------------------------------------------------------------------------
| CHANGE INTEGRATION STATUS
|--------------------------------------------------------------------------
*/

export const changeIntegrationStatus = async ({
  integrationId,
  companyId,
  status,
}) => {
  const validIntegrationId =
    validateIntegrationId(integrationId);

  const validCompanyId =
    validateCompanyId(companyId);

  const validStatus =
    validateStatus(status);

  /*
  |--------------------------------------------------------------------------
  | Check existing integration
  |--------------------------------------------------------------------------
  */

  const existingIntegration =
    await integrationRepository.findIntegrationById(
      validIntegrationId,
      validCompanyId
    );

  if (!existingIntegration) {
    const error = new Error(
      "Integration not found."
    );

    error.statusCode = 404;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Same status
  |--------------------------------------------------------------------------
  */

  if (
    existingIntegration.status ===
    validStatus
  ) {
    const error = new Error(
      `Integration is already ${validStatus}.`
    );

    error.statusCode = 400;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Update status
  |--------------------------------------------------------------------------
  */

  const updatedIntegration =
    await integrationRepository.updateIntegrationStatus(
      validIntegrationId,
      validCompanyId,
      validStatus
    );

  if (!updatedIntegration) {
    const error = new Error(
      "Integration status could not be updated."
    );

    error.statusCode = 500;
    throw error;
  }

  return sanitizeIntegration(
    updatedIntegration
  );
};

/*
|--------------------------------------------------------------------------
| UPDATE SYNC STATUS
|--------------------------------------------------------------------------
*/

export const updateIntegrationSyncStatus = async ({
  integrationId,
  companyId,
  lastSyncedAt,
  lastError,
}) => {
  const validIntegrationId =
    validateIntegrationId(integrationId);

  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Check existing integration
  |--------------------------------------------------------------------------
  */

  const existingIntegration =
    await integrationRepository.findIntegrationById(
      validIntegrationId,
      validCompanyId
    );

  if (!existingIntegration) {
    const error = new Error(
      "Integration not found."
    );

    error.statusCode = 404;
    throw error;
  }

  const syncData = {};

  /*
  |--------------------------------------------------------------------------
  | LAST SYNCED AT
  |--------------------------------------------------------------------------
  */

  if (lastSyncedAt !== undefined) {
    if (
      lastSyncedAt === null ||
      lastSyncedAt === ""
    ) {
      syncData.lastSyncedAt = null;
    } else {
      const parsedDate =
        new Date(lastSyncedAt);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        const error = new Error(
          "Invalid last synced date."
        );

        error.statusCode = 400;
        throw error;
      }

      syncData.lastSyncedAt =
        parsedDate;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LAST ERROR
  |--------------------------------------------------------------------------
  */

  if (lastError !== undefined) {
    const normalizedError =
      normalizeString(lastError);

    if (
      normalizedError &&
      normalizedError.length > 5000
    ) {
      const error = new Error(
        "Last error cannot exceed 5000 characters."
      );

      error.statusCode = 400;
      throw error;
    }

    syncData.lastError =
      normalizedError;
  }

  /*
  |--------------------------------------------------------------------------
  | No sync fields
  |--------------------------------------------------------------------------
  */

  if (
    Object.keys(syncData).length === 0
  ) {
    const error = new Error(
      "At least one sync status field is required."
    );

    error.statusCode = 400;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  const updatedIntegration =
    await integrationRepository.updateSyncStatus(
      validIntegrationId,
      validCompanyId,
      syncData
    );

  if (!updatedIntegration) {
    const error = new Error(
      "Integration sync status could not be updated."
    );

    error.statusCode = 500;
    throw error;
  }

  return sanitizeIntegration(
    updatedIntegration
  );
};

/*
|--------------------------------------------------------------------------
| DELETE INTEGRATION
|--------------------------------------------------------------------------
*/

export const deleteIntegration = async ({
  integrationId,
  companyId,
}) => {
  const validIntegrationId =
    validateIntegrationId(integrationId);

  const validCompanyId =
    validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Check existing integration
  |--------------------------------------------------------------------------
  */

  const existingIntegration =
    await integrationRepository.findIntegrationById(
      validIntegrationId,
      validCompanyId
    );

  if (!existingIntegration) {
    const error = new Error(
      "Integration not found."
    );

    error.statusCode = 404;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Active integration protection
  |--------------------------------------------------------------------------
  */

  if (
    existingIntegration.status ===
    "active"
  ) {
    const error = new Error(
      "Active integration cannot be deleted. Deactivate the integration first."
    );

    error.statusCode = 400;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleted =
    await integrationRepository.deleteIntegration(
      validIntegrationId,
      validCompanyId
    );

  if (!deleted) {
    const error = new Error(
      "Integration could not be deleted."
    );

    error.statusCode = 500;
    throw error;
  }

  return {
    integrationId: validIntegrationId,
    deleted: true,
  };
};