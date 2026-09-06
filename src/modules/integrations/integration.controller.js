import * as integrationService from "./integration.service.js";

/*
|--------------------------------------------------------------------------
| CREATE INTEGRATION
|--------------------------------------------------------------------------
*/

export const createIntegration = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const body = req.body;

    const integration =
      await integrationService.createIntegration({
        companyId,
        leadSourceId: body.lead_source_id,
        name: body.name,
        platform: body.platform,
        config: body.config,
        status: body.status,
      });

    return res.status(201).json({
      success: true,
      message: "Integration created successfully.",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL INTEGRATIONS
|--------------------------------------------------------------------------
*/

export const getAllIntegrations = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const query =
      req.validatedQuery || req.query;

    const result =
      await integrationService.getAllIntegrations({
        ...query,
        companyId,
      });

    return res.status(200).json({
      success: true,
      message: "Integrations fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ACTIVE INTEGRATIONS
|--------------------------------------------------------------------------
*/

export const getActiveIntegrations = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const integrations =
      await integrationService.getActiveIntegrations({
        companyId,
      });

    return res.status(200).json({
      success: true,
      message: "Active integrations fetched successfully.",
      data: integrations,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET INTEGRATION BY ID
|--------------------------------------------------------------------------
*/

export const getIntegrationById = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const integration =
      await integrationService.getIntegrationById({
        integrationId: params.id,
        companyId,
      });

    return res.status(200).json({
      success: true,
      message: "Integration fetched successfully.",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE INTEGRATION
|--------------------------------------------------------------------------
*/

export const updateIntegration = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const body = req.body;

    const integration =
      await integrationService.updateIntegration({
        integrationId: params.id,
        companyId,

        leadSourceId:
          body.lead_source_id,

        name: body.name,

        platform:
          body.platform,

        config:
          body.config,

        status:
          body.status,
      });

    return res.status(200).json({
      success: true,
      message: "Integration updated successfully.",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CHANGE INTEGRATION STATUS
|--------------------------------------------------------------------------
*/

export const changeIntegrationStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const body = req.body;

    const integration =
      await integrationService.changeIntegrationStatus({
        integrationId: params.id,
        companyId,
        status: body.status,
      });

    return res.status(200).json({
      success: true,
      message: "Integration status updated successfully.",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SYNC STATUS
|--------------------------------------------------------------------------
*/

export const updateSyncStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const body = req.body;

    const integration =
      await integrationService.updateIntegrationSyncStatus({
        integrationId: params.id,
        companyId,

        lastSyncedAt:
          body.last_synced_at,

        lastError:
          body.last_error,
      });

    return res.status(200).json({
      success: true,
      message: "Integration sync status updated successfully.",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE INTEGRATION
|--------------------------------------------------------------------------
*/

export const deleteIntegration = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const result =
      await integrationService.deleteIntegration({
        integrationId: params.id,
        companyId,
      });

    return res.status(200).json({
      success: true,
      message: "Integration deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};