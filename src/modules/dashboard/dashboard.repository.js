import { Op, fn, col, literal } from "sequelize";

import {
  Company,
  User,
  Lead,
  Customer,
  Property,
  LeadSource,
  FollowUp,
  SiteVisit,
  Deal,
} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Build company scope.
 *
 * For:
 * - SUPER_ADMIN -> no company filter
 * - ADMIN       -> company_id filter
 * - SALES_AGENT -> company_id + assigned_to filter
 *
 * Repository only receives the already-decided scope.
 */
const buildCompanyWhere = (companyId) => {
  if (!companyId) return {};

  return {
    company_id: companyId,
  };
};

/**
 * Build lead scope.
 */
const buildLeadWhere = ({ companyId, userId }) => {
  const where = {};

  if (companyId) {
    where.company_id = companyId;
  }

  if (userId) {
    where.assigned_to = userId;
  }

  return where;
};

/**
 * Build deal scope.
 */
const buildDealWhere = ({ companyId, userId }) => {
  const where = {};

  if (companyId) {
    where.company_id = companyId;
  }

  if (userId) {
    where.assigned_to = userId;
  }

  return where;
};


/*
|--------------------------------------------------------------------------
| OVERVIEW / KPI
|--------------------------------------------------------------------------
*/

/**
 * Get dashboard overview counts.
 *
 * Returns:
 * - companies
 * - users
 * - leads
 * - customers
 * - properties
 * - followups
 * - site visits
 * - deals
 * - won deals
 * - revenue
 */
export const getOverviewStats = async ({
  companyId = null,
  userId = null,
}) => {
  const leadWhere = buildLeadWhere({
    companyId,
    userId,
  });

  const dealWhere = buildDealWhere({
    companyId,
    userId,
  });

  const customerWhere = buildCompanyWhere(companyId);
  const propertyWhere = buildCompanyWhere(companyId);

  const followUpWhere = {};

  if (companyId) {
    followUpWhere["$lead.company_id$"] = companyId;
  }

  if (userId) {
    followUpWhere["$lead.assigned_to$"] = userId;
  }

  const siteVisitWhere = {};

  if (userId) {
    siteVisitWhere.assigned_to = userId;
  }

  const [
    totalCompanies,
    totalUsers,
    totalLeads,
    totalCustomers,
    totalProperties,
    totalFollowUps,
    totalSiteVisits,
    totalDeals,
    wonDeals,
    revenueResult,
  ] = await Promise.all([
    Company.count(
      companyId
        ? {
            where: {
              id: companyId,
            },
          }
        : {}
    ),

    User.count(
      companyId
        ? {
            where: {
              company_id: companyId,
            },
          }
        : {}
    ),

    Lead.count({
      where: leadWhere,
    }),

    Customer.count({
      where: customerWhere,
    }),

    Property.count({
      where: propertyWhere,
    }),

    FollowUp.count({
      where: followUpWhere,
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),

    SiteVisit.count({
      where: {
        ...(companyId
          ? {
              "$lead.company_id$": companyId,
            }
          : {}),
        ...(userId
          ? {
              assigned_to: userId,
            }
          : {}),
      },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),

    Deal.count({
      where: dealWhere,
    }),

    Deal.count({
      where: {
        ...dealWhere,
        status: "won",
      },
    }),

    Deal.findOne({
      where: {
        ...dealWhere,
        status: "won",
      },
      attributes: [
        [
          fn(
            "COALESCE",
            fn("SUM", col("deal_value")),
            0
          ),
          "total_revenue",
        ],
      ],
      raw: true,
    }),
  ]);

  return {
    companies: totalCompanies,
    users: totalUsers,
    leads: totalLeads,
    customers: totalCustomers,
    properties: totalProperties,
    followUps: totalFollowUps,
    siteVisits: totalSiteVisits,
    deals: totalDeals,
    wonDeals,
    revenue: Number(
      revenueResult?.total_revenue || 0
    ),
  };
};


/*
|--------------------------------------------------------------------------
| LEAD PIPELINE
|--------------------------------------------------------------------------
*/

/**
 * Get lead count by status.
 *
 * Example:
 *
 * new          -> 120
 * contacted    -> 80
 * qualified    -> 60
 * site_visit   -> 40
 * negotiation  -> 20
 * won          -> 10
 * lost         -> 15
 */
export const getLeadPipeline = async ({
  companyId = null,
  userId = null,
}) => {
  const where = buildLeadWhere({
    companyId,
    userId,
  });

  const rows = await Lead.findAll({
    where,
    attributes: [
      "status",
      [
        fn("COUNT", col("id")),
        "count",
      ],
    ],
    group: ["status"],
    order: [["status", "ASC"]],
    raw: true,
  });

  return rows.map((row) => ({
    status: row.status,
    count: Number(row.count),
  }));
};


/*
|--------------------------------------------------------------------------
| LEAD SOURCES
|--------------------------------------------------------------------------
*/

/**
 * Get leads grouped by lead source.
 *
 * Used for:
 * - Pie / Donut chart
 * - Source performance
 */
export const getLeadSourceStats = async ({
  companyId = null,
  userId = null,
}) => {
  const leadWhere = buildLeadWhere({
    companyId,
    userId,
  });

  const rows = await Lead.findAll({
    where: leadWhere,
    attributes: [
      "lead_source_id",
      [
        fn("COUNT", col("Lead.id")),
        "count",
      ],
    ],
    include: [
      {
        model: LeadSource,
        as: "leadSource",
        attributes: ["id", "name", "code"],
        required: true,
      },
    ],
    group: [
      "lead_source_id",
      "leadSource.id",
      "leadSource.name",
      "leadSource.code",
    ],
    order: [
      [literal("count"), "DESC"],
    ],
    raw: true,
    nest: true,
  });

  return rows.map((row) => ({
    leadSourceId: row.lead_source_id,
    source: row.leadSource?.name || null,
    code: row.leadSource?.code || null,
    count: Number(row.count),
  }));
};


/*
|--------------------------------------------------------------------------
| LEAD TREND
|--------------------------------------------------------------------------
*/

/**
 * Get leads created over time.
 *
 * `startDate` and `endDate` should be supplied by service.
 *
 * Example:
 * [
 *   { date: "2026-09-01", count: 15 },
 *   { date: "2026-09-02", count: 22 }
 * ]
 */
export const getLeadTrend = async ({
  companyId = null,
  userId = null,
  startDate,
  endDate,
}) => {
  const where = buildLeadWhere({
    companyId,
    userId,
  });

  if (startDate && endDate) {
    where.created_at = {
      [Op.between]: [startDate, endDate],
    };
  }

  const rows = await Lead.findAll({
    where,
    attributes: [
      [
        fn(
          "DATE",
          col("created_at")
        ),
        "date",
      ],
      [
        fn("COUNT", col("id")),
        "count",
      ],
    ],
    group: [
      fn("DATE", col("created_at")),
    ],
    order: [
      [literal("date"), "ASC"],
    ],
    raw: true,
  });

  return rows.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));
};


/*
|--------------------------------------------------------------------------
| FOLLOW-UP STATS
|--------------------------------------------------------------------------
*/

/**
 * Get follow-up counts.
 *
 * This gives dashboard operational data:
 *
 * - total
 * - today
 * - overdue
 * - upcoming
 */
export const getFollowUpStats = async ({
  companyId = null,
  userId = null,
  startOfDay,
  endOfDay,
  now,
}) => {
  const baseWhere = {};

  if (companyId) {
    baseWhere["$lead.company_id$"] = companyId;
  }

  if (userId) {
    baseWhere["$lead.assigned_to$"] = userId;
  }

  const [
    total,
    today,
    overdue,
    upcoming,
  ] = await Promise.all([
    FollowUp.count({
      where: baseWhere,
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),

    FollowUp.count({
      where: {
        ...baseWhere,
        scheduled_at: {
          [Op.between]: [
            startOfDay,
            endOfDay,
          ],
        },
      },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),

    FollowUp.count({
      where: {
        ...baseWhere,
        scheduled_at: {
          [Op.lt]: now,
        },
        status: {
          [Op.notIn]: [
            "completed",
            "cancelled",
          ],
        },
      },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),

    FollowUp.count({
      where: {
        ...baseWhere,
        scheduled_at: {
          [Op.gt]: endOfDay,
        },
        status: {
          [Op.notIn]: [
            "completed",
            "cancelled",
          ],
        },
      },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
        },
      ],
    }),
  ]);

  return {
    total,
    today,
    overdue,
    upcoming,
  };
};


/*
|--------------------------------------------------------------------------
| SITE VISIT STATS
|--------------------------------------------------------------------------
*/

/**
 * Get site visit counts by status.
 */
export const getSiteVisitStats = async ({
  companyId = null,
  userId = null,
}) => {
  const where = {};

  if (userId) {
    where.assigned_to = userId;
  }

  const include = [
    {
      model: Lead,
      as: "lead",
      attributes: [],
      required: true,
      ...(companyId
        ? {
            where: {
              company_id: companyId,
            },
          }
        : {}),
    },
  ];

  const rows = await SiteVisit.findAll({
    where,
    include,
    attributes: [
      "status",
      [
        fn("COUNT", col("SiteVisit.id")),
        "count",
      ],
    ],
    group: ["status"],
    order: [["status", "ASC"]],
    raw: true,
  });

  return rows.map((row) => ({
    status: row.status,
    count: Number(row.count),
  }));
};


/*
|--------------------------------------------------------------------------
| DEAL STATS
|--------------------------------------------------------------------------
*/

/**
 * Get deal statistics by status.
 *
 * Example:
 *
 * open       -> 50
 * won        -> 20
 * lost       -> 10
 * cancelled  -> 5
 */
export const getDealStats = async ({
  companyId = null,
  userId = null,
}) => {
  const where = buildDealWhere({
    companyId,
    userId,
  });

  const rows = await Deal.findAll({
    where,
    attributes: [
      "status",
      [
        fn("COUNT", col("id")),
        "count",
      ],
      [
        fn("COALESCE", fn("SUM", col("deal_value")), 0),
        "value",
      ],
    ],
    group: ["status"],
    order: [["status", "ASC"]],
    raw: true,
  });

  return rows.map((row) => ({
    status: row.status,
    count: Number(row.count),
    value: Number(row.value || 0),
  }));
};


/*
|--------------------------------------------------------------------------
| DEAL TREND / REVENUE TREND
|--------------------------------------------------------------------------
*/

/**
 * Get won deal revenue trend.
 *
 * Used for:
 * - Revenue line chart
 * - Sales trend
 */
export const getRevenueTrend = async ({
  companyId = null,
  userId = null,
  startDate,
  endDate,
}) => {
  const where = {
    ...buildDealWhere({
      companyId,
      userId,
    }),
    status: "won",
  };

  if (startDate && endDate) {
    where.closed_at = {
      [Op.between]: [
        startDate,
        endDate,
      ],
    };
  }

  const rows = await Deal.findAll({
    where,
    attributes: [
      [
        fn(
          "DATE",
          col("closed_at")
        ),
        "date",
      ],
      [
        fn(
          "COALESCE",
          fn("SUM", col("deal_value")),
          0
        ),
        "revenue",
      ],
      [
        fn("COUNT", col("id")),
        "deals",
      ],
    ],
    group: [
      fn("DATE", col("closed_at")),
    ],
    order: [
      [literal("date"), "ASC"],
    ],
    raw: true,
  });

  return rows.map((row) => ({
    date: row.date,
    revenue: Number(row.revenue || 0),
    deals: Number(row.deals || 0),
  }));
};


/*
|--------------------------------------------------------------------------
| SALES PERFORMANCE
|--------------------------------------------------------------------------
*/

/**
 * Get salesperson performance.
 *
 * Mainly used by ADMIN dashboard.
 *
 * Example:
 *
 * [
 *   {
 *     userId: 5,
 *     userName: "Rahul",
 *     leads: 45,
 *     qualified: 18,
 *     siteVisits: 9,
 *     deals: 4,
 *     wonDeals: 2,
 *     revenue: 2500000
 *   }
 * ]
 */
export const getSalesPerformance = async ({
  companyId,
}) => {
  if (!companyId) {
    return [];
  }

  const users = await User.findAll({
    where: {
      company_id: companyId,
    },
    attributes: [
      "id",
      "first_name",
      "last_name",
    ],
    order: [
      ["first_name", "ASC"],
    ],
    raw: true,
  });

  if (!users.length) {
    return [];
  }

  const userIds = users.map(
    (user) => user.id
  );

  const [
    leadStats,
    qualifiedStats,
    siteVisitStats,
    dealStats,
  ] = await Promise.all([
    Lead.findAll({
      where: {
        company_id: companyId,
        assigned_to: {
          [Op.in]: userIds,
        },
      },
      attributes: [
        "assigned_to",
        [
          fn("COUNT", col("id")),
          "count",
        ],
      ],
      group: ["assigned_to"],
      raw: true,
    }),

    Lead.findAll({
      where: {
        company_id: companyId,
        assigned_to: {
          [Op.in]: userIds,
        },
        status: "qualified",
      },
      attributes: [
        "assigned_to",
        [
          fn("COUNT", col("id")),
          "count",
        ],
      ],
      group: ["assigned_to"],
      raw: true,
    }),

    SiteVisit.findAll({
      where: {
        assigned_to: {
          [Op.in]: userIds,
        },
      },
      include: [
        {
          model: Lead,
          as: "lead",
          attributes: [],
          required: true,
          where: {
            company_id: companyId,
          },
        },
      ],
      attributes: [
        "assigned_to",
        [
          fn(
            "COUNT",
            col("SiteVisit.id")
          ),
          "count",
        ],
      ],
      group: ["assigned_to"],
      raw: true,
    }),

    Deal.findAll({
      where: {
        company_id: companyId,
        assigned_to: {
          [Op.in]: userIds,
        },
      },
      attributes: [
        "assigned_to",
        [
          fn("COUNT", col("id")),
          "count",
        ],
        [
          fn(
            "SUM",
            literal(
              "CASE WHEN status = 'won' THEN 1 ELSE 0 END"
            )
          ),
          "wonDeals",
        ],
        [
          fn(
            "COALESCE",
            fn(
              "SUM",
              literal(
                "CASE WHEN status = 'won' THEN deal_value ELSE 0 END"
              )
            ),
            0
          ),
          "revenue",
        ],
      ],
      group: ["assigned_to"],
      raw: true,
    }),
  ]);

  const leadMap = new Map(
    leadStats.map((row) => [
      Number(row.assigned_to),
      Number(row.count),
    ])
  );

  const qualifiedMap = new Map(
    qualifiedStats.map((row) => [
      Number(row.assigned_to),
      Number(row.count),
    ])
  );

  const siteVisitMap = new Map(
    siteVisitStats.map((row) => [
      Number(row.assigned_to),
      Number(row.count),
    ])
  );

  const dealMap = new Map(
    dealStats.map((row) => [
      Number(row.assigned_to),
      {
        deals: Number(row.count || 0),
        wonDeals: Number(
          row.wonDeals || 0
        ),
        revenue: Number(
          row.revenue || 0
        ),
      },
    ])
  );

  return users.map((user) => {
    const userId = Number(user.id);

    const dealData =
      dealMap.get(userId) || {
        deals: 0,
        wonDeals: 0,
        revenue: 0,
      };

    return {
      userId,
      name: [
        user.first_name,
        user.last_name,
      ]
        .filter(Boolean)
        .join(" "),
      leads:
        leadMap.get(userId) || 0,
      qualified:
        qualifiedMap.get(userId) || 0,
      siteVisits:
        siteVisitMap.get(userId) || 0,
      deals: dealData.deals,
      wonDeals: dealData.wonDeals,
      revenue: dealData.revenue,
    };
  });
};


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getOverviewStats,
  getLeadPipeline,
  getLeadSourceStats,
  getLeadTrend,
  getFollowUpStats,
  getSiteVisitStats,
  getDealStats,
  getRevenueTrend,
  getSalesPerformance,
};