import express from "express";

import {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  changeDealStage,
  changeDealStatus,
  deleteDeal,
  getDealsByLead,
  getDealsByCustomer,
} from "./deals.controller.js";

import dealValidation from "./deals.validation.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| DEAL ROUTES
|--------------------------------------------------------------------------
| Base URL:
| /api/v1/deals
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| CREATE DEAL
|--------------------------------------------------------------------------
| POST /api/v1/deals/create-deal
|--------------------------------------------------------------------------
*/
router.post(
  "/create-deal",
  authMiddleware,
  validate(
    dealValidation.createDeal.body,
    "body"
  ),
  createDeal
);


/*
|--------------------------------------------------------------------------
| GET ALL DEALS
|--------------------------------------------------------------------------
| GET /api/v1/deals/get-all-deals
|--------------------------------------------------------------------------
*/
router.get(
  "/get-all-deals",
  authMiddleware,
  validate(
    dealValidation.getAllDeals.query,
    "query"
  ),
  getAllDeals
);


/*
|--------------------------------------------------------------------------
| GET DEALS BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/deals/get-deal-by-lead/:leadId
|--------------------------------------------------------------------------
*/
router.get(
  "/get-deal-by-lead/:leadId",
  authMiddleware,
  validate(
    dealValidation.getDealsByLead.params,
    "params"
  ),
  validate(
    dealValidation.getDealsByLead.query,
    "query"
  ),
  getDealsByLead
);


/*
|--------------------------------------------------------------------------
| GET DEALS BY CUSTOMER
|--------------------------------------------------------------------------
| GET /api/v1/deals/get-deal-by-customer/:customerId
|--------------------------------------------------------------------------
*/
router.get(
  "/get-deal-by-customer/:customerId",
  authMiddleware,
  validate(
    dealValidation.getDealsByCustomer.params,
    "params"
  ),
  validate(
    dealValidation.getDealsByCustomer.query,
    "query"
  ),
  getDealsByCustomer
);


/*
|--------------------------------------------------------------------------
| GET DEAL BY ID
|--------------------------------------------------------------------------
| GET /api/v1/deals/get-deal-by-id/:id
|--------------------------------------------------------------------------
*/
router.get(
  "/get-deal-by-id/:id",
  authMiddleware,
  validate(
    dealValidation.getDealById.params,
    "params"
  ),
  getDealById
);


/*
|--------------------------------------------------------------------------
| UPDATE DEAL
|--------------------------------------------------------------------------
| PUT /api/v1/deals/update-deal/:id
|--------------------------------------------------------------------------
*/
router.put(
  "/update-deal/:id",
  authMiddleware,
  validate(
    dealValidation.updateDeal.params,
    "params"
  ),
  validate(
    dealValidation.updateDeal.body,
    "body"
  ),
  updateDeal
);


/*
|--------------------------------------------------------------------------
| CHANGE DEAL STAGE
|--------------------------------------------------------------------------
| PATCH /api/v1/deals/change-deal-stage/:id
|--------------------------------------------------------------------------
*/
router.patch(
  "/change-deal-stage/:id",
  authMiddleware,
  validate(
    dealValidation.changeDealStage.params,
    "params"
  ),
  validate(
    dealValidation.changeDealStage.body,
    "body"
  ),
  changeDealStage
);


/*
|--------------------------------------------------------------------------
| CHANGE DEAL STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/deals/change-deal-status/:id
|--------------------------------------------------------------------------
*/
router.patch(
  "/change-deal-status/:id",
  authMiddleware,
  validate(
    dealValidation.changeDealStatus.params,
    "params"
  ),
  validate(
    dealValidation.changeDealStatus.body,
    "body"
  ),
  changeDealStatus
);


/*
|--------------------------------------------------------------------------
| DELETE DEAL
|--------------------------------------------------------------------------
| DELETE /api/v1/deals/delete-deal/:id
|--------------------------------------------------------------------------
*/
router.delete(
  "/delete-deal/:id",
  authMiddleware,
  validate(
    dealValidation.deleteDeal.params,
    "params"
  ),
  deleteDeal
);


export default router;