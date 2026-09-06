
import * as dashboardService from "./dashboard.service.js";

/*
|--------------------------------------------------------------------------
| GET DASHBOARD
|--------------------------------------------------------------------------
*/

export const getDashboard = async (req, res, next) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | AUTH DATA FROM JWT
    |--------------------------------------------------------------------------
    */

    const userId = req.user.userId;
    const roleId = req.user.roleId;
    const companyId = req.user.companyId;

    /*
    |--------------------------------------------------------------------------
    | VALIDATED QUERY
    |--------------------------------------------------------------------------
    */

    const query = req.validatedQuery || req.query;

    const period = query.period || "30d";

    /*
    |--------------------------------------------------------------------------
    | GET DASHBOARD
    |--------------------------------------------------------------------------
    */

    const dashboard = await dashboardService.getDashboard({
      userId,
      roleId,
      companyId,
      period,
    });

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
