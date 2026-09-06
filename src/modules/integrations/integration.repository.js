import { Op } from "sequelize";
import {
  Integration,
  Company,
  LeadSource,
} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createIntegration = async (data, transaction = null) => {
  return await Integration.create(data, {
    transaction,
  });
};

/*
|--------------------------------------------------------------------------
| FIND BY ID
|--------------------------------------------------------------------------
*/

export const findIntegrationById = async (
  integrationId,
  companyId = null
) => {
  const where = {
    id: integrationId,
  };

  // Company isolation
  if (companyId !== null) {
    where.company_id = companyId;
  }

  return await Integration.findOne({
    where,
    include: [
      {
        model: Company,
        as: "company",
        attributes: ["id", "name"],
      },
      {
        model: LeadSource,
        as: "leadSource",
        attributes: ["id", "name", "code", "status"],
      },
    ],
  });
};

/*
|--------------------------------------------------------------------------
| FIND ALL
|--------------------------------------------------------------------------
*/

export const findAllIntegrations = async ({
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
  const where = {
    company_id: companyId,
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  if (search) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        platform: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  if (platform) {
    where.platform = platform;
  }

  if (status) {
    where.status = status;
  }

  if (leadSourceId) {
    where.lead_source_id = leadSourceId;
  }

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const offset = (page - 1) * limit;

  const { rows, count } = await Integration.findAndCountAll({
    where,

    include: [
      {
        model: LeadSource,
        as: "leadSource",
        attributes: ["id", "name", "code", "status"],
      },
    ],

    order: [[sortBy, sortOrder]],

    limit,
    offset,

    distinct: true,
  });

  return {
    rows,
    count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

/*
|--------------------------------------------------------------------------
| FIND ACTIVE INTEGRATIONS
|--------------------------------------------------------------------------
*/

export const findActiveIntegrations = async (companyId) => {
  return await Integration.findAll({
    where: {
      company_id: companyId,
      status: "active",
    },

    include: [
      {
        model: LeadSource,
        as: "leadSource",
        attributes: ["id", "name", "code", "status"],
      },
    ],

    order: [["created_at", "DESC"]],
  });
};

/*
|--------------------------------------------------------------------------
| FIND BY PLATFORM
|--------------------------------------------------------------------------
*/

export const findIntegrationByPlatform = async (
  companyId,
  platform
) => {
  return await Integration.findAll({
    where: {
      company_id: companyId,
      platform,
    },

    order: [["created_at", "DESC"]],
  });
};

/*
|--------------------------------------------------------------------------
| FIND BY LEAD SOURCE
|--------------------------------------------------------------------------
*/

export const findIntegrationByLeadSource = async (
  companyId,
  leadSourceId
) => {
  return await Integration.findAll({
    where: {
      company_id: companyId,
      lead_source_id: leadSourceId,
    },

    order: [["created_at", "DESC"]],
  });
};

/*
|--------------------------------------------------------------------------
| FIND BY NAME
|--------------------------------------------------------------------------
*/

export const findIntegrationByName = async (
  companyId,
  name,
  excludeId = null
) => {
  const where = {
    company_id: companyId,
    name,
  };

  if (excludeId) {
    where.id = {
      [Op.ne]: excludeId,
    };
  }

  return await Integration.findOne({
    where,
  });
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateIntegration = async (
  integrationId,
  companyId,
  data,
  transaction = null
) => {
  const [updatedRows] = await Integration.update(data, {
    where: {
      id: integrationId,
      company_id: companyId,
    },

    transaction,
  });

  if (!updatedRows) {
    return null;
  }

  return await findIntegrationById(
    integrationId,
    companyId
  );
};

/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/

export const updateIntegrationStatus = async (
  integrationId,
  companyId,
  status,
  transaction = null
) => {
  const [updatedRows] = await Integration.update(
    {
      status,
    },
    {
      where: {
        id: integrationId,
        company_id: companyId,
      },

      transaction,
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findIntegrationById(
    integrationId,
    companyId
  );
};

/*
|--------------------------------------------------------------------------
| UPDATE SYNC STATUS
|--------------------------------------------------------------------------
*/

export const updateSyncStatus = async (
  integrationId,
  companyId,
  {
    lastSyncedAt = null,
    lastError = null,
  },
  transaction = null
) => {
  const updateData = {};

  if (lastSyncedAt !== undefined) {
    updateData.last_synced_at = lastSyncedAt;
  }

  if (lastError !== undefined) {
    updateData.last_error = lastError;
  }

  const [updatedRows] = await Integration.update(
    updateData,
    {
      where: {
        id: integrationId,
        company_id: companyId,
      },

      transaction,
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findIntegrationById(
    integrationId,
    companyId
  );
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteIntegration = async (
  integrationId,
  companyId,
  transaction = null
) => {
  return await Integration.destroy({
    where: {
      id: integrationId,
      company_id: companyId,
    },

    transaction,
  });
};