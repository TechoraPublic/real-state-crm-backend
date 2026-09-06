import dealService from "./deals.service.js";

/*
|--------------------------------------------------------------------------
| CREATE DEAL
|--------------------------------------------------------------------------
| POST /api/v1/deals
*/
export const createDeal = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const createdBy = req.user.userId;

    const deal = await dealService.createDeal(
      req.body,
      companyId,
      createdBy
    );

    return res.status(201).json({
      success: true,
      message: "Deal created successfully.",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL DEALS
|--------------------------------------------------------------------------
| GET /api/v1/deals
*/
export const getAllDeals = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const result = await dealService.getAllDeals({
      ...req.validatedQuery,
      companyId,
    });

    return res.status(200).json({
      success: true,
      message: "Deals fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET DEAL BY ID
|--------------------------------------------------------------------------
| GET /api/v1/deals/:id
*/
export const getDealById = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const dealId = req.validatedParams.id;

    const deal = await dealService.getDealById(
      dealId,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Deal fetched successfully.",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE DEAL
|--------------------------------------------------------------------------
| PUT /api/v1/deals/:id
*/
export const updateDeal = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const dealId = req.validatedParams.id;
    const updatedBy = req.user.userId;

    const deal = await dealService.updateDeal(
      dealId,
      req.body,
      companyId,
      updatedBy
    );

    return res.status(200).json({
      success: true,
      message: "Deal updated successfully.",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE DEAL STAGE
|--------------------------------------------------------------------------
| PATCH /api/v1/deals/:id/stage
*/
export const changeDealStage = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const dealId = req.validatedParams.id;
    const updatedBy = req.user.userId;
    const { stage } = req.body;

    const deal = await dealService.changeDealStage(
      dealId,
      stage,
      companyId,
      updatedBy
    );

    return res.status(200).json({
      success: true,
      message: "Deal stage updated successfully.",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| CHANGE DEAL STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/deals/:id/status
*/
export const changeDealStatus = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const dealId = req.validatedParams.id;
    const updatedBy = req.user.userId;

    const { status, lost_reason } = req.body;

    const deal = await dealService.changeDealStatus(
      dealId,
      status,
      companyId,
      updatedBy,
      lost_reason
    );

    return res.status(200).json({
      success: true,
      message: "Deal status updated successfully.",
      data: deal,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| DELETE DEAL
|--------------------------------------------------------------------------
| DELETE /api/v1/deals/:id
*/
export const deleteDeal = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const dealId = req.validatedParams.id;

    await dealService.deleteDeal(
      dealId,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Deal deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET DEALS BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/deals/lead/:leadId
*/
export const getDealsByLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;
    const query = req.validatedQuery || req.query;

    const result = await dealService.getDealsByLead({
      leadId: params.leadId,
      companyId,
      ...query,
    });

    return res.status(200).json({
      success: true,
      message: "Lead deals fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET DEALS BY CUSTOMER
|--------------------------------------------------------------------------
| GET /api/v1/deals/customer/:customerId
*/
export const getDealsByCustomer = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params = req.validatedParams || req.params;
    const query = req.validatedQuery || req.query;

    const result = await dealService.getDealsByCustomer({
      customerId: params.customerId,
      companyId,
      ...query,
    });

    return res.status(200).json({
      success: true,
      message: "Customer deals fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};