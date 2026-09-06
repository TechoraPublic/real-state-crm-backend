/*
|--------------------------------------------------------------------------
| IMPORTS
|--------------------------------------------------------------------------
*/

import * as dashboardRepository from "./dashboard.repository.js";
import { Role } from "../../databases/models.js";


/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const DASHBOARD_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES_MANAGER: "SALES_MANAGER",
};

const DEFAULT_PERIOD = "30d";

const PERIODS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};


/*
|--------------------------------------------------------------------------
| VALIDATION HELPERS
|--------------------------------------------------------------------------
*/

const validateUserId = (userId) => {
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  return id;
};


const validateRoleId = (roleId) => {
  const id = Number(roleId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid role ID.");
    error.statusCode = 400;
    throw error;
  }

  return id;
};


const validateCompanyId = (companyId) => {
  const id = Number(companyId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid company ID.");
    error.statusCode = 400;
    throw error;
  }

  return id;
};


/*
|--------------------------------------------------------------------------
| ROLE RESOLVER
|--------------------------------------------------------------------------
*/

/**
 * JWT contains roleId.
 *
 * Example JWT:
 *
 * {
 *   userId: 1,
 *   roleId: 2,
 *   companyId: 1
 * }
 *
 * We resolve roleId -> Role.key.
 *
 * Example:
 *
 * roleId: 2
 * Role:
 * {
 *   id: 2,
 *   name: "Admin",
 *   key: "ADMIN"
 * }
 */

const getRoleById = async (roleId) => {
  const validRoleId = validateRoleId(roleId);

  const role = await Role.findByPk(validRoleId, {
    attributes: [
      "id",
      "name",
      "key",
      "status",
    ],
  });

  if (!role) {
    const error = new Error("User role not found.");
    error.statusCode = 403;
    throw error;
  }

  if (role.status !== "active") {
    const error = new Error("User role is inactive.");
    error.statusCode = 403;
    throw error;
  }

  return role;
};


/*
|--------------------------------------------------------------------------
| DATE HELPERS
|--------------------------------------------------------------------------
*/

const getDateRange = (period = DEFAULT_PERIOD) => {
  const normalizedPeriod = String(period)
    .trim()
    .toLowerCase();

  const days = PERIODS[normalizedPeriod];

  if (!days) {
    const error = new Error(
      "Invalid dashboard period. Allowed values: 7d, 30d, 90d."
    );

    error.statusCode = 400;
    throw error;
  }

  const endDate = new Date();

  const startDate = new Date(endDate);

  startDate.setDate(
    startDate.getDate() - (days - 1)
  );

  startDate.setHours(0, 0, 0, 0);

  const rangeEndDate = new Date(endDate);

  rangeEndDate.setHours(
    23,
    59,
    59,
    999
  );

  return {
    period: normalizedPeriod,
    startDate,
    endDate: rangeEndDate,
  };
};


const getTodayRange = () => {
  const now = new Date();

  const startOfDay = new Date(now);

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);

  endOfDay.setHours(
    23,
    59,
    59,
    999
  );

  return {
    now,
    startOfDay,
    endOfDay,
  };
};


/*
|--------------------------------------------------------------------------
| ROLE SCOPE
|--------------------------------------------------------------------------
*/

/**
 * Decide dashboard data scope.
 *
 * SUPER_ADMIN
 * -> Entire system
 *
 * ADMIN
 * -> Entire company
 *
 * SALES_MANAGER
 * -> Own assigned sales data
 */

const buildDashboardScope = ({
  role,
  companyId,
  userId,
}) => {
  const normalizedRole = String(role)
    .trim()
    .toUpperCase();

  switch (normalizedRole) {
    case DASHBOARD_ROLES.SUPER_ADMIN:
      return {
        role: normalizedRole,
        companyId: null,
        userId: null,
        scope: "global",
      };

    case DASHBOARD_ROLES.ADMIN:
      return {
        role: normalizedRole,
        companyId,
        userId: null,
        scope: "company",
      };

    case DASHBOARD_ROLES.SALES_MANAGER:
      return {
        role: normalizedRole,
        companyId,
        userId,
        scope: "user",
      };

    default: {
      const error = new Error(
        "You are not authorized to access the dashboard."
      );

      error.statusCode = 403;

      throw error;
    }
  }
};


/*
|--------------------------------------------------------------------------
| OVERVIEW
|--------------------------------------------------------------------------
*/

const getOverview = async ({
  scope,
}) => {
  return dashboardRepository.getOverviewStats({
    companyId: scope.companyId,
    userId: scope.userId,
  });
};


/*
|--------------------------------------------------------------------------
| LEAD ANALYTICS
|--------------------------------------------------------------------------
*/

const getLeadAnalytics = async ({
  scope,
  startDate,
  endDate,
}) => {
  const [
    pipeline,
    sources,
    trend,
  ] = await Promise.all([
    dashboardRepository.getLeadPipeline({
      companyId: scope.companyId,
      userId: scope.userId,
    }),

    dashboardRepository.getLeadSourceStats({
      companyId: scope.companyId,
      userId: scope.userId,
    }),

    dashboardRepository.getLeadTrend({
      companyId: scope.companyId,
      userId: scope.userId,
      startDate,
      endDate,
    }),
  ]);

  return {
    pipeline,
    sources,
    trend,
  };
};


/*
|--------------------------------------------------------------------------
| FOLLOW-UP ANALYTICS
|--------------------------------------------------------------------------
*/

const getFollowUpAnalytics = async ({
  scope,
  now,
  startOfDay,
  endOfDay,
}) => {
  return dashboardRepository.getFollowUpStats({
    companyId: scope.companyId,
    userId: scope.userId,
    startOfDay,
    endOfDay,
    now,
  });
};


/*
|--------------------------------------------------------------------------
| SITE VISIT ANALYTICS
|--------------------------------------------------------------------------
*/

const getSiteVisitAnalytics = async ({
  scope,
}) => {
  return dashboardRepository.getSiteVisitStats({
    companyId: scope.companyId,
    userId: scope.userId,
  });
};


/*
|--------------------------------------------------------------------------
| DEAL ANALYTICS
|--------------------------------------------------------------------------
*/

const getDealAnalytics = async ({
  scope,
  startDate,
  endDate,
}) => {
  const [
    stats,
    revenueTrend,
  ] = await Promise.all([
    dashboardRepository.getDealStats({
      companyId: scope.companyId,
      userId: scope.userId,
    }),

    dashboardRepository.getRevenueTrend({
      companyId: scope.companyId,
      userId: scope.userId,
      startDate,
      endDate,
    }),
  ]);

  return {
    stats,
    revenueTrend,
  };
};


/*
|--------------------------------------------------------------------------
| SALES PERFORMANCE
|--------------------------------------------------------------------------
*/

const getSalesPerformanceAnalytics = async ({
  scope,
}) => {
  /*
  |--------------------------------------------------------------------------
  | SALES MANAGER / SALES AGENT
  |--------------------------------------------------------------------------
  */

  if (
    scope.role === DASHBOARD_ROLES.SALES_MANAGER
  ) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | SUPER ADMIN
  |--------------------------------------------------------------------------
  |
  | Current repository requires companyId.
  | Global salesperson performance can be added later
  | using an optimized repository query.
  |
  */

  if (!scope.companyId) {
    return [];
  }

  return dashboardRepository.getSalesPerformance({
    companyId: scope.companyId,
  });
};


/*
|--------------------------------------------------------------------------
| MAIN DASHBOARD
|--------------------------------------------------------------------------
*/

export const getDashboard = async ({
  userId,
  roleId,
  companyId,
  period = DEFAULT_PERIOD,
}) => {

  /*
  |--------------------------------------------------------------------------
  | VALIDATE AUTH CONTEXT
  |--------------------------------------------------------------------------
  */

  const validUserId = validateUserId(
    userId
  );

  const validRoleId = validateRoleId(
    roleId
  );

  const validCompanyId = validateCompanyId(
    companyId
  );


  /*
  |--------------------------------------------------------------------------
  | RESOLVE ROLE
  |--------------------------------------------------------------------------
  */

  const role = await getRoleById(
    validRoleId
  );


  /*
  |--------------------------------------------------------------------------
  | BUILD ROLE SCOPE
  |--------------------------------------------------------------------------
  */

  const scope = buildDashboardScope({
    role: role.key,
    companyId: validCompanyId,
    userId: validUserId,
  });


  /*
  |--------------------------------------------------------------------------
  | DATE RANGE
  |--------------------------------------------------------------------------
  */

  const {
    period: normalizedPeriod,
    startDate,
    endDate,
  } = getDateRange(period);

  const {
    now,
    startOfDay,
    endOfDay,
  } = getTodayRange();


  /*
  |--------------------------------------------------------------------------
  | RUN DASHBOARD QUERIES IN PARALLEL
  |--------------------------------------------------------------------------
  */

  const [
    overview,
    leadAnalytics,
    followUps,
    siteVisits,
    deals,
    salesPerformance,
  ] = await Promise.all([
    getOverview({
      scope,
    }),

    getLeadAnalytics({
      scope,
      startDate,
      endDate,
    }),

    getFollowUpAnalytics({
      scope,
      now,
      startOfDay,
      endOfDay,
    }),

    getSiteVisitAnalytics({
      scope,
    }),

    getDealAnalytics({
      scope,
      startDate,
      endDate,
    }),

    getSalesPerformanceAnalytics({
      scope,
    }),
  ]);


  /*
  |--------------------------------------------------------------------------
  | FINAL RESPONSE
  |--------------------------------------------------------------------------
  */

  return {
    role: scope.role,
    roleId: validRoleId,
    scope: scope.scope,

    period: {
      type: normalizedPeriod,
      startDate,
      endDate,
    },

    overview,

    leads: {
      pipeline: leadAnalytics.pipeline,
      sources: leadAnalytics.sources,
      trend: leadAnalytics.trend,
    },

    followUps,

    siteVisits,

    deals: {
      stats: deals.stats,
      revenueTrend: deals.revenueTrend,
    },

    salesPerformance,
  };
};


/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getDashboard,
};