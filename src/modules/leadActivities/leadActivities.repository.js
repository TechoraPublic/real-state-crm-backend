import { Op } from "sequelize";
import { LeadActivity } from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| Create Lead Activity
|--------------------------------------------------------------------------
*/
export const createLeadActivity = async (data) => {
  return await LeadActivity.create(data);
};


/*
|--------------------------------------------------------------------------
| Find Activity By ID
|--------------------------------------------------------------------------
*/
export const findLeadActivityById = async (id, leadId = null) => {
  const where = {
    id,
  };

  if (leadId !== null && leadId !== undefined) {
    where.lead_id = leadId;
  }

  return await LeadActivity.findOne({
    where,
  });
};


/*
|--------------------------------------------------------------------------
| Get Activities By Lead
|--------------------------------------------------------------------------
*/
export const findActivitiesByLead = async ({
  leadId,
  page = 1,
  limit = 20,
  type,
  userId,
  search,
  sortOrder = "DESC",
}) => {
  const offset = (page - 1) * limit;

  const where = {
    lead_id: leadId,
  };

  /*
  |--------------------------------------------------------------------------
  | Filter By Activity Type
  |--------------------------------------------------------------------------
  */
  if (type) {
    where.type = type;
  }

  /*
  |--------------------------------------------------------------------------
  | Filter By User
  |--------------------------------------------------------------------------
  */
  if (userId) {
    where.user_id = userId;
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  /*
  |--------------------------------------------------------------------------
  | Safe Sort Order
  |--------------------------------------------------------------------------
  */
  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await LeadActivity.findAndCountAll({
    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [
      ["created_at", safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| Get All Activities
|--------------------------------------------------------------------------
| Company filtering will be handled by service-level lead validation.
| Repository works directly with activity records.
|--------------------------------------------------------------------------
*/
export const findAllActivities = async ({
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
  const offset = (page - 1) * limit;

  const where = {};

  /*
  |--------------------------------------------------------------------------
  | Lead Filter
  |--------------------------------------------------------------------------
  */
  if (leadId) {
    where.lead_id = leadId;
  }

  /*
  |--------------------------------------------------------------------------
  | User Filter
  |--------------------------------------------------------------------------
  */
  if (userId) {
    where.user_id = userId;
  }

  /*
  |--------------------------------------------------------------------------
  | Type Filter
  |--------------------------------------------------------------------------
  */
  if (type) {
    where.type = type;
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  /*
  |--------------------------------------------------------------------------
  | Date Filter
  |--------------------------------------------------------------------------
  */
  if (fromDate || toDate) {
    where.created_at = {};

    if (fromDate) {
      where.created_at[Op.gte] = fromDate;
    }

    if (toDate) {
      where.created_at[Op.lte] = toDate;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Safe Sort Order
  |--------------------------------------------------------------------------
  */
  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await LeadActivity.findAndCountAll({
    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [
      ["created_at", safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| Delete Lead Activity
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/
export const deleteLeadActivity = async (id, leadId = null) => {
  const where = {
    id,
  };

  if (leadId !== null && leadId !== undefined) {
    where.lead_id = leadId;
  }

  return await LeadActivity.destroy({
    where,
  });
};


/*
|--------------------------------------------------------------------------
| Count Activities For A Lead
|--------------------------------------------------------------------------
*/
export const countActivitiesByLead = async (leadId) => {
  return await LeadActivity.count({
    where: {
      lead_id: leadId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| Count Activities By Type
|--------------------------------------------------------------------------
*/
export const countActivitiesByType = async (leadId) => {
  return await LeadActivity.findAll({
    attributes: [
      "type",
      [
        LeadActivity.sequelize.fn(
          "COUNT",
          LeadActivity.sequelize.col("id")
        ),
        "count",
      ],
    ],

    where: {
      lead_id: leadId,
    },

    group: ["type"],

    raw: true,
  });
};


/*
|--------------------------------------------------------------------------
| Find Latest Activity
|--------------------------------------------------------------------------
*/
export const findLatestActivity = async (leadId) => {
  return await LeadActivity.findOne({
    where: {
      lead_id: leadId,
    },

    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
  });
};