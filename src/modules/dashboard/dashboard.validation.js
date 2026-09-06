import Joi from "joi";

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const DASHBOARD_PERIODS = ["7d", "30d", "90d"];

/*
|--------------------------------------------------------------------------
| GET DASHBOARD QUERY
|--------------------------------------------------------------------------
|
| Example:
| GET /api/v1/dashboard?period=30d
|
*/

const getDashboardQuery = Joi.object({
  period: Joi.string()
    .valid(...DASHBOARD_PERIODS)
    .default("30d"),
});

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

const dashboardValidation = {
  getDashboard: {
    query: getDashboardQuery,
  },
};

export default dashboardValidation;