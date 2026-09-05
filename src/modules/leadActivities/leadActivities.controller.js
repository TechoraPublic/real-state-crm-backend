import * as leadActivityService from "./leadActivities.service.js";

/*
|--------------------------------------------------------------------------
| CREATE LEAD ACTIVITY
|--------------------------------------------------------------------------
| POST /api/v1/lead-activities
|--------------------------------------------------------------------------
*/

export const createLeadActivity = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const activity = await leadActivityService.createLeadActivity(
      req.body,
      companyId,
      userId
    );

    return res.status(201).json({
      success: true,
      message: "Lead activity created successfully.",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET ACTIVITY BY ID
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities/:id
|--------------------------------------------------------------------------
*/

export const getLeadActivityById = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const activity = await leadActivityService.getLeadActivityById(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Lead activity fetched successfully.",
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET ACTIVITIES BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities/lead/:leadId
|--------------------------------------------------------------------------
*/

export const getActivitiesByLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;
    const query = req.validatedQuery || req.query;

    const result = await leadActivityService.getActivitiesByLead({
      leadId: params.leadId,
      companyId,

      page: query.page,
      limit: query.limit,
      type: query.type,
      userId: query.userId,
      search: query.search,
      sortOrder: query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Lead activities fetched successfully.",
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVITIES
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities
|--------------------------------------------------------------------------
*/

export const getAllActivities = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query = req.validatedQuery || req.query;

    const result = await leadActivityService.getAllActivities({
      companyId,

      page: query.page,
      limit: query.limit,
      leadId: query.leadId,
      userId: query.userId,
      type: query.type,
      search: query.search,
      fromDate: query.fromDate,
      toDate: query.toDate,
      sortOrder: query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Lead activities fetched successfully.",
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| DELETE LEAD ACTIVITY
|--------------------------------------------------------------------------
| DELETE /api/v1/lead-activities/:id
|--------------------------------------------------------------------------
*/

export const deleteLeadActivity = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    await leadActivityService.deleteLeadActivity(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Lead activity deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};