import { Op } from "sequelize";
import { Lead } from "../../databases/models.js";


// ============================================================
// CREATE
// ============================================================

export const createLead = async (data) => {
  return await Lead.create(data);
};

// ============================================================
// FIND BY ID
// ============================================================

export const findLeadById = async (id, companyId) => {
  return await Lead.findOne({
    where: {
      id,
      company_id: companyId,
    },
  });
};

// ============================================================
// FIND ALL LEADS
// ============================================================

export const findAllLeads = async ({
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
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const offset = (page - 1) * limit;

  const where = {
    company_id: companyId,
  };

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  /*
   * Lead itself doesn't contain customer name/email/phone.
   *
   * Therefore customer searching should eventually be handled
   * through an include with Customer.
   *
   * For now we search lead-specific fields.
   */

  if (search) {
    where[Op.or] = [
      {
        source_lead_id: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        preferred_location: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        requirements: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        notes: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  // ----------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (leadSourceId) {
    where.lead_source_id = leadSourceId;
  }

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  if (propertyId) {
    where.property_id = propertyId;
  }

  if (integrationId) {
    where.integration_id = integrationId;
  }

  // ----------------------------------------------------------
  // SAFE SORTING
  // ----------------------------------------------------------

  const allowedSortFields = [
    "id",
    "created_at",
    "updated_at",
    "status",
    "priority",
    "budget_min",
    "budget_max",
    "next_followup_at",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

  // ----------------------------------------------------------
  // QUERY
  // ----------------------------------------------------------

  return await Lead.findAndCountAll({
    where,

    limit: Number(limit),
    offset: Number(offset),

    order: [[safeSortBy, safeSortOrder]],

    distinct: true,
  });
};

// ============================================================
// UPDATE
// ============================================================

export const updateLead = async (id, companyId, data) => {
  const [updatedRows] = await Lead.update(data, {
    where: {
      id,
      company_id: companyId,
    },
  });

  if (!updatedRows) {
    return null;
  }

  return await findLeadById(id, companyId);
};

// ============================================================
// UPDATE STATUS
// ============================================================

export const updateLeadStatus = async (id, companyId, status) => {
  const [updatedRows] = await Lead.update(
    {
      status,
    },
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findLeadById(id, companyId);
};

// ============================================================
// UPDATE PRIORITY
// ============================================================

export const updateLeadPriority = async (id, companyId, priority) => {
  const [updatedRows] = await Lead.update(
    {
      priority,
    },
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findLeadById(id, companyId);
};

// ============================================================
// ASSIGN LEAD
// ============================================================

export const assignLead = async (id, companyId, assignedTo) => {
  const [updatedRows] = await Lead.update(
    {
      assigned_to: assignedTo,
    },
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findLeadById(id, companyId);
};

// ============================================================
// UPDATE FOLLOW-UP
// ============================================================

export const updateLeadFollowup = async (
  id,
  companyId,
  nextFollowupAt
) => {
  const [updatedRows] = await Lead.update(
    {
      next_followup_at: nextFollowupAt,
    },
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await findLeadById(id, companyId);
};

// ============================================================
// DELETE
// ============================================================

export const deleteLead = async (id, companyId) => {
  return await Lead.destroy({
    where: {
      id,
      company_id: companyId,
    },
  });
};

// ============================================================
// CHECK LEAD EXISTS
// ============================================================

export const leadExists = async (id, companyId) => {
  return await Lead.count({
    where: {
      id,
      company_id: companyId,
    },
  });
};

// ============================================================
// FIND DUPLICATE EXTERNAL LEAD
// ============================================================

export const findLeadBySourceLeadId = async ({
  companyId,
  leadSourceId,
  sourceLeadId,
}) => {
  if (!sourceLeadId) {
    return null;
  }

  return await Lead.findOne({
    where: {
      company_id: companyId,
      lead_source_id: leadSourceId,
      source_lead_id: sourceLeadId,
    },
  });
};

// ============================================================
// FIND LEADS BY CUSTOMER
// ============================================================

export const findLeadsByCustomer = async (customerId, companyId) => {
  return await Lead.findAll({
    where: {
      customer_id: customerId,
      company_id: companyId,
    },

    order: [["created_at", "DESC"]],
  });
};

// ============================================================
// FIND LEADS BY ASSIGNED USER
// ============================================================

export const findLeadsByAssignedUser = async (
  assignedTo,
  companyId,
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
  } = options;

  const offset = (page - 1) * limit;

  return await Lead.findAndCountAll({
    where: {
      assigned_to: assignedTo,
      company_id: companyId,
    },

    limit: Number(limit),
    offset: Number(offset),

    order: [["created_at", "DESC"]],

    distinct: true,
  });
};

// ============================================================
// FIND LEADS BY STATUS
// ============================================================

export const findLeadsByStatus = async (
  status,
  companyId,
  options = {}
) => {
  const {
    page = 1,
    limit = 10,
  } = options;

  const offset = (page - 1) * limit;

  return await Lead.findAndCountAll({
    where: {
      status,
      company_id: companyId,
    },

    limit: Number(limit),
    offset: Number(offset),

    order: [["created_at", "DESC"]],

    distinct: true,
  });
};

// ============================================================
// FIND UPCOMING FOLLOW-UPS
// ============================================================

export const findUpcomingFollowups = async (
  companyId,
  fromDate,
  toDate
) => {
  return await Lead.findAll({
    where: {
      company_id: companyId,

      next_followup_at: {
        [Op.between]: [fromDate, toDate],
      },
    },

    order: [["next_followup_at", "ASC"]],
  });
};

// ============================================================
// FIND OVERDUE FOLLOW-UPS
// ============================================================

export const findOverdueFollowups = async (companyId, currentDate) => {
  return await Lead.findAll({
    where: {
      company_id: companyId,

      next_followup_at: {
        [Op.lt]: currentDate,
      },

      status: {
        [Op.notIn]: ["won", "lost"],
      },
    },

    order: [["next_followup_at", "ASC"]],
  });
};

// ============================================================
// COUNT LEADS
// ============================================================

export const countLeads = async (companyId, where = {}) => {
  return await Lead.count({
    where: {
      company_id: companyId,
      ...where,
    },
  });
};

// ============================================================
// COUNT LEADS BY STATUS
// ============================================================

export const countLeadsByStatus = async (companyId) => {
  return await Lead.findAll({
    attributes: [
      "status",
      [
        Lead.sequelize.fn("COUNT", Lead.sequelize.col("id")),
        "count",
      ],
    ],

    where: {
      company_id: companyId,
    },

    group: ["status"],

    raw: true,
  });
};

// ============================================================
// COUNT LEADS BY PRIORITY
// ============================================================

export const countLeadsByPriority = async (companyId) => {
  return await Lead.findAll({
    attributes: [
      "priority",
      [
        Lead.sequelize.fn("COUNT", Lead.sequelize.col("id")),
        "count",
      ],
    ],

    where: {
      company_id: companyId,
    },

    group: ["priority"],

    raw: true,
  });
};