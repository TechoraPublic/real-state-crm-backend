import * as siteVisitService from "./siteVisit.service.js";

/*
|--------------------------------------------------------------------------
| CREATE SITE VISIT
|--------------------------------------------------------------------------
| POST /api/v1/site-visits
|--------------------------------------------------------------------------
*/

export const createSiteVisit = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const data = req.body;

    const siteVisit =
      await siteVisitService.createSiteVisit(
        data,
        companyId,
        userId
      );

    return res.status(201).json({
      success: true,
      message: "Site visit scheduled successfully.",
      data: siteVisit,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL SITE VISITS
|--------------------------------------------------------------------------
| GET /api/v1/site-visits
|--------------------------------------------------------------------------
*/

export const getAllSiteVisits = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const query =
      req.validatedQuery || req.query;

    const result =
      await siteVisitService.getAllSiteVisits({
        companyId,

        page: query.page,

        limit: query.limit,

        status: query.status,

        leadId: query.leadId,

        propertyId:
          query.propertyId,

        assignedTo:
          query.assignedTo,

        fromDate:
          query.fromDate,

        toDate:
          query.toDate,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Site visits fetched successfully.",

      data: result.siteVisits,

      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SITE VISIT BY ID
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

export const getSiteVisitById = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const siteVisit =
      await siteVisitService.getSiteVisitById(
        params.id,
        companyId
      );

    return res.status(200).json({
      success: true,
      message:
        "Site visit fetched successfully.",
      data: siteVisit,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SITE VISIT
|--------------------------------------------------------------------------
| PUT /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

export const updateSiteVisit = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const userId =
      req.user.userId;

    const params =
      req.validatedParams || req.params;

    const data =
      req.body;

    const siteVisit =
      await siteVisitService.updateSiteVisit(
        params.id,
        data,
        companyId,
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Site visit updated successfully.",
      data: siteVisit,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CHANGE SITE VISIT STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/site-visits/:id/status
|--------------------------------------------------------------------------
*/

export const changeSiteVisitStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const userId =
      req.user.userId;

    const params =
      req.validatedParams || req.params;

    const body =
      req.body;

    const siteVisit =
      await siteVisitService.changeSiteVisitStatus(
        params.id,
        body.status,
        companyId,
        userId,
        body.outcome
      );

    return res.status(200).json({
      success: true,
      message:
        "Site visit status updated successfully.",
      data: siteVisit,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE SITE VISIT
|--------------------------------------------------------------------------
| DELETE /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

export const deleteSiteVisit = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const params =
      req.validatedParams || req.params;

    await siteVisitService.deleteSiteVisit(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message:
        "Site visit deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SITE VISITS BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/lead/:leadId
|--------------------------------------------------------------------------
*/

export const getSiteVisitsByLead = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const query =
      req.validatedQuery || req.query;

    const result =
      await siteVisitService.getSiteVisitsByLead({
        leadId:
          params.leadId,

        companyId,

        page:
          query.page,

        limit:
          query.limit,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Lead site visits fetched successfully.",

      data:
        result.siteVisits,

      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SITE VISITS BY PROPERTY
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/property/:propertyId
|--------------------------------------------------------------------------
*/

export const getSiteVisitsByProperty = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const query =
      req.validatedQuery || req.query;

    const result =
      await siteVisitService.getSiteVisitsByProperty({
        propertyId:
          params.propertyId,

        companyId,

        page:
          query.page,

        limit:
          query.limit,

        status:
          query.status,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Property site visits fetched successfully.",

      data:
        result.siteVisits,

      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
};