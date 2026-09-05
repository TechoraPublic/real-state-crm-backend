import * as followUpService from "./folllowUps.service.js";


/*
|--------------------------------------------------------------------------
| CREATE FOLLOW-UP
|--------------------------------------------------------------------------
| POST /api/v1/followups
|--------------------------------------------------------------------------
*/

export const createFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const createdBy = req.user.userId;

    const followUp = await followUpService.createFollowUp(
      req.body,
      companyId,
      createdBy
    );

    return res.status(201).json({
      success: true,
      message: "Follow-up created successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UP BY ID
|--------------------------------------------------------------------------
| GET /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

export const getFollowUpById = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp = await followUpService.getFollowUpById(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up fetched successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL FOLLOW-UPS
|--------------------------------------------------------------------------
| GET /api/v1/followups
|--------------------------------------------------------------------------
*/

export const getAllFollowUps = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query = req.validatedQuery || req.query;

    const result = await followUpService.getAllFollowUps({
      companyId,

      page: query.page,
      limit: query.limit,

      leadId: query.leadId,
      assignedTo: query.assignedTo,
      createdBy: query.createdBy,

      type: query.type,
      status: query.status,

      search: query.search,

      fromDate: query.fromDate,
      toDate: query.toDate,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Follow-ups fetched successfully.",
      data: result.followUps,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UPS BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/followups/lead/:leadId
|--------------------------------------------------------------------------
*/

export const getFollowUpsByLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;
    const query = req.validatedQuery || req.query;

    const result = await followUpService.getFollowUpsByLead({
      leadId: params.leadId,

      companyId,

      page: query.page,
      limit: query.limit,

      status: query.status,
      type: query.type,
      assignedTo: query.assignedTo,

      sortOrder: query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Lead follow-ups fetched successfully.",
      data: result.followUps,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UPS BY USER
|--------------------------------------------------------------------------
| GET /api/v1/followups/user/:userId
|--------------------------------------------------------------------------
*/

export const getFollowUpsByUser = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;
    const query = req.validatedQuery || req.query;

    const result = await followUpService.getFollowUpsByUser({
      assignedTo: params.userId,

      companyId,

      page: query.page,
      limit: query.limit,

      status: query.status,
      type: query.type,

      fromDate: query.fromDate,
      toDate: query.toDate,

      sortOrder: query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "User follow-ups fetched successfully.",
      data: result.followUps,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE FOLLOW-UP
|--------------------------------------------------------------------------
| PUT /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

export const updateFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp = await followUpService.updateFollowUp(
      params.id,
      req.body,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up updated successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| COMPLETE FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/complete
|--------------------------------------------------------------------------
*/

export const completeFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp = await followUpService.completeFollowUp(
      params.id,
      req.body.outcome,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up completed successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| CANCEL FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/cancel
|--------------------------------------------------------------------------
*/

export const cancelFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp = await followUpService.cancelFollowUp(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up cancelled successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| RESCHEDULE FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/reschedule
|--------------------------------------------------------------------------
*/

export const rescheduleFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp = await followUpService.rescheduleFollowUp(
      params.id,
      req.body.scheduled_at,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up rescheduled successfully.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| DELETE FOLLOW-UP
|--------------------------------------------------------------------------
| DELETE /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

export const deleteFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    await followUpService.deleteFollowUp(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET UPCOMING FOLLOW-UPS
|--------------------------------------------------------------------------
| GET /api/v1/followups/upcoming
|--------------------------------------------------------------------------
*/

export const getUpcomingFollowUps = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query = req.validatedQuery || req.query;

    const followUps =
      await followUpService.getUpcomingFollowUps({
        companyId,

        fromDate: query.fromDate,
        toDate: query.toDate,

        assignedTo: query.assignedTo,

        limit: query.limit,
      });

    return res.status(200).json({
      success: true,
      message: "Upcoming follow-ups fetched successfully.",
      data: followUps,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET OVERDUE FOLLOW-UPS
|--------------------------------------------------------------------------
| GET /api/v1/followups/overdue
|--------------------------------------------------------------------------
*/

export const getOverdueFollowUps = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query = req.validatedQuery || req.query;

    const followUps =
      await followUpService.getOverdueFollowUps({
        companyId,

        assignedTo: query.assignedTo,

        limit: query.limit,
      });

    return res.status(200).json({
      success: true,
      message: "Overdue follow-ups fetched successfully.",
      data: followUps,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET TODAY'S FOLLOW-UPS
|--------------------------------------------------------------------------
| GET /api/v1/followups/today
|--------------------------------------------------------------------------
*/

export const getTodayFollowUps = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query = req.validatedQuery || req.query;

    /*
    |--------------------------------------------------------------------------
    | Calculate today's date range
    |--------------------------------------------------------------------------
    */

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const followUps =
      await followUpService.getTodayFollowUps({
        companyId,

        startOfDay,
        endOfDay,

        assignedTo: query.assignedTo,
      });

    return res.status(200).json({
      success: true,
      message: "Today's follow-ups fetched successfully.",
      data: followUps,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET LATEST FOLLOW-UP FOR LEAD
|--------------------------------------------------------------------------
| GET /api/v1/followups/lead/:leadId/latest
|--------------------------------------------------------------------------
*/

export const getLatestFollowUp = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const followUp =
      await followUpService.getLatestFollowUp(
        params.leadId,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: followUp
        ? "Latest follow-up fetched successfully."
        : "No follow-up found for this lead.",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UP COUNT BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/followups/lead/:leadId/count
|--------------------------------------------------------------------------
*/

export const getFollowUpCountByLead = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;

    const count =
      await followUpService.getFollowUpCountByLead(
        params.leadId,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Follow-up count fetched successfully.",
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UP COUNTS BY STATUS
|--------------------------------------------------------------------------
| GET /api/v1/followups/counts/status
|--------------------------------------------------------------------------
*/

export const getFollowUpCountsByStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const counts =
      await followUpService.getFollowUpCountsByStatus(
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Follow-up status counts fetched successfully.",
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};