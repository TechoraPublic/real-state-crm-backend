import { Op } from "sequelize";
import FollowUp from "./followUps.model.js";


/*
|--------------------------------------------------------------------------
| CREATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const createFollowUp = async (data) => {
  return await FollowUp.create(data);
};


/*
|--------------------------------------------------------------------------
| FIND FOLLOW-UP BY ID
|--------------------------------------------------------------------------
*/

export const findFollowUpById = async (id) => {
  return await FollowUp.findByPk(id);
};


/*
|--------------------------------------------------------------------------
| FIND FOLLOW-UP BY ID + LEAD
|--------------------------------------------------------------------------
*/

export const findFollowUpByIdAndLead = async (id, leadId) => {
  return await FollowUp.findOne({
    where: {
      id,
      lead_id: leadId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| FIND ALL FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const findAllFollowUps = async ({
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
  const offset = (page - 1) * limit;

  const where = {};

  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  if (leadId) {
    where.lead_id = leadId;
  }

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  if (createdBy) {
    where.created_by = createdBy;
  }

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | SEARCH
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
      {
        outcome: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  /*
  |--------------------------------------------------------------------------
  | DATE RANGE
  |--------------------------------------------------------------------------
  */

  if (fromDate || toDate) {
    where.scheduled_at = {};

    if (fromDate) {
      where.scheduled_at[Op.gte] = fromDate;
    }

    if (toDate) {
      where.scheduled_at[Op.lte] = toDate;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAFE SORTING
  |--------------------------------------------------------------------------
  */

  const allowedSortFields = [
    "id",
    "scheduled_at",
    "created_at",
    "updated_at",
    "status",
    "type",
    "completed_at",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "scheduled_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

  /*
  |--------------------------------------------------------------------------
  | QUERY
  |--------------------------------------------------------------------------
  */

  return await FollowUp.findAndCountAll({
    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [
      [safeSortBy, safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| FIND FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
*/

export const findFollowUpsByLead = async ({
  leadId,
  page = 1,
  limit = 20,
  status,
  type,
  assignedTo,
  sortOrder = "ASC",
}) => {
  const offset = (page - 1) * limit;

  const where = {
    lead_id: leadId,
  };

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

  return await FollowUp.findAndCountAll({
    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [
      ["scheduled_at", safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| FIND FOLLOW-UPS BY USER
|--------------------------------------------------------------------------
*/

export const findFollowUpsByUser = async ({
  assignedTo,
  page = 1,
  limit = 20,
  status,
  type,
  fromDate,
  toDate,
  sortOrder = "ASC",
}) => {
  const offset = (page - 1) * limit;

  const where = {
    assigned_to: assignedTo,
  };

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (fromDate || toDate) {
    where.scheduled_at = {};

    if (fromDate) {
      where.scheduled_at[Op.gte] = fromDate;
    }

    if (toDate) {
      where.scheduled_at[Op.lte] = toDate;
    }
  }

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "DESC"
      ? "DESC"
      : "ASC";

  return await FollowUp.findAndCountAll({
    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [
      ["scheduled_at", safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| UPDATE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const updateFollowUp = async (id, data) => {
  const [updatedRows] = await FollowUp.update(data, {
    where: {
      id,
    },
  });

  if (!updatedRows) {
    return null;
  }

  return await FollowUp.findByPk(id);
};


/*
|--------------------------------------------------------------------------
| COMPLETE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const completeFollowUp = async (
  id,
  completedAt,
  outcome
) => {
  const [updatedRows] = await FollowUp.update(
    {
      status: "completed",
      completed_at: completedAt,
      outcome,
    },
    {
      where: {
        id,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await FollowUp.findByPk(id);
};


/*
|--------------------------------------------------------------------------
| CANCEL FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const cancelFollowUp = async (id) => {
  const [updatedRows] = await FollowUp.update(
    {
      status: "cancelled",
    },
    {
      where: {
        id,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await FollowUp.findByPk(id);
};


/*
|--------------------------------------------------------------------------
| RESCHEDULE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const rescheduleFollowUp = async (
  id,
  scheduledAt
) => {
  const [updatedRows] = await FollowUp.update(
    {
      scheduled_at: scheduledAt,
      status: "pending",
      completed_at: null,
    },
    {
      where: {
        id,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await FollowUp.findByPk(id);
};


/*
|--------------------------------------------------------------------------
| DELETE FOLLOW-UP
|--------------------------------------------------------------------------
*/

export const deleteFollowUp = async (id) => {
  return await FollowUp.destroy({
    where: {
      id,
    },
  });
};


/*
|--------------------------------------------------------------------------
| COUNT FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
*/

export const countFollowUpsByLead = async (leadId) => {
  return await FollowUp.count({
    where: {
      lead_id: leadId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| COUNT FOLLOW-UPS BY STATUS
|--------------------------------------------------------------------------
*/

export const countFollowUpsByStatus = async () => {
  return await FollowUp.findAll({
    attributes: [
      "status",
      [
        FollowUp.sequelize.fn(
          "COUNT",
          FollowUp.sequelize.col("id")
        ),
        "count",
      ],
    ],

    group: ["status"],

    raw: true,
  });
};


/*
|--------------------------------------------------------------------------
| FIND UPCOMING FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const findUpcomingFollowUps = async ({
  fromDate,
  toDate,
  assignedTo,
  limit = 20,
}) => {
  const where = {
    status: "pending",

    scheduled_at: {
      [Op.gte]: fromDate,
      [Op.lte]: toDate,
    },
  };

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  return await FollowUp.findAll({
    where,

    limit: Number(limit),

    order: [
      ["scheduled_at", "ASC"],
      ["id", "ASC"],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| FIND OVERDUE FOLLOW-UPS
|--------------------------------------------------------------------------
| Overdue is derived from:
| status = pending
| AND scheduled_at < current time
|--------------------------------------------------------------------------
*/

export const findOverdueFollowUps = async ({
  currentDate,
  assignedTo,
  limit = 20,
}) => {
  const where = {
    status: "pending",

    scheduled_at: {
      [Op.lt]: currentDate,
    },
  };

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  return await FollowUp.findAll({
    where,

    limit: Number(limit),

    order: [
      ["scheduled_at", "ASC"],
      ["id", "ASC"],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| FIND TODAY'S FOLLOW-UPS
|--------------------------------------------------------------------------
*/

export const findTodayFollowUps = async ({
  startOfDay,
  endOfDay,
  assignedTo,
}) => {
  const where = {
    scheduled_at: {
      [Op.gte]: startOfDay,
      [Op.lte]: endOfDay,
    },
  };

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  return await FollowUp.findAll({
    where,

    order: [
      ["scheduled_at", "ASC"],
      ["id", "ASC"],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| FIND LATEST FOLLOW-UP FOR LEAD
|--------------------------------------------------------------------------
*/

export const findLatestFollowUp = async (leadId) => {
  return await FollowUp.findOne({
    where: {
      lead_id: leadId,
    },

    order: [
      ["scheduled_at", "DESC"],
      ["id", "DESC"],
    ],
  });
};