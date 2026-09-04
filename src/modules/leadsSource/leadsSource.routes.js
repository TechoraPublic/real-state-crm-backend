import express from "express";

import leadSourceController from "./leadsSource.controller.js";

import {
  createLeadSourceValidation,
  getLeadSourcesValidation,
  leadSourceIdValidation,
  updateLeadSourceValidation,
  changeLeadSourceStatusValidation,
  deleteLeadSourceValidation,
} from "./leadsSource.validation.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CREATE LEAD SOURCE
|--------------------------------------------------------------------------
| POST /api/lead-sources/create-lead-source
|
| Allowed:
| SUPER_ADMIN
| ADMIN
|--------------------------------------------------------------------------
*/

router.post(
  "/create-lead-source",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(createLeadSourceValidation.body, "body"),
  leadSourceController.create
);

/*
|--------------------------------------------------------------------------
| GET ALL LEAD SOURCES
|--------------------------------------------------------------------------
| GET /api/lead-sources/get-all-lead-sources
|
| Query:
| ?status=active
| ?search=facebook
| ?page=1
| ?limit=20
| ?order=name
| ?direction=ASC
|--------------------------------------------------------------------------
*/

router.get(
  "/get-all-lead-sources",
  authMiddleware,
  validate(getLeadSourcesValidation.query, "query"),
  leadSourceController.getAll
);

/*
|--------------------------------------------------------------------------
| GET ACTIVE LEAD SOURCES
|--------------------------------------------------------------------------
| GET /api/lead-sources/get-active-lead-sources
|--------------------------------------------------------------------------
*/

router.get(
  "/get-active-lead-sources",
  authMiddleware,
  leadSourceController.getActive
);

/*
|--------------------------------------------------------------------------
| GET LEAD SOURCE BY ID
|--------------------------------------------------------------------------
| GET /api/lead-sources/get-lead-source-by-id/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/get-lead-source-by-id/:id",
  authMiddleware,
  validate(leadSourceIdValidation.params, "params"),
  leadSourceController.getById
);

/*
|--------------------------------------------------------------------------
| UPDATE LEAD SOURCE
|--------------------------------------------------------------------------
| PUT /api/lead-sources/update-lead-source/:id
|
| Allowed:
| SUPER_ADMIN
| ADMIN
|--------------------------------------------------------------------------
*/

router.put(
  "/update-lead-source/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(updateLeadSourceValidation.params, "params"),
  validate(updateLeadSourceValidation.body, "body"),
  leadSourceController.update
);

/*
|--------------------------------------------------------------------------
| CHANGE LEAD SOURCE STATUS
|--------------------------------------------------------------------------
| PATCH /api/lead-sources/change-lead-source-status/:id
|
| Allowed:
| SUPER_ADMIN
| ADMIN
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-lead-source-status/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(changeLeadSourceStatusValidation.params, "params"),
  validate(changeLeadSourceStatusValidation.body, "body"),
  leadSourceController.changeStatus
);

/*
|--------------------------------------------------------------------------
| DELETE LEAD SOURCE
|--------------------------------------------------------------------------
| DELETE /api/lead-sources/delete-lead-source/:id
|
| Allowed:
| SUPER_ADMIN
| ADMIN
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-lead-source/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(deleteLeadSourceValidation.params, "params"),
  leadSourceController.delete
);

export default router;