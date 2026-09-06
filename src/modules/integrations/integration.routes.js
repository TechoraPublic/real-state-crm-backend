import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import integrationValidation from "./integration.validation.js";

import {
  createIntegration,
  getAllIntegrations,
  getActiveIntegrations,
  getIntegrationById,
  updateIntegration,
  changeIntegrationStatus,
  updateSyncStatus,
  deleteIntegration,
  testIntegration,
  syncIntegration
} from "./integration.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| INTEGRATION ROUTES
|--------------------------------------------------------------------------
| SUPER_ADMIN + ADMIN only
|--------------------------------------------------------------------------
*/

const integrationAdminAccess = roleMiddleware(
  "SUPER_ADMIN",
  "ADMIN"
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
  "/create-integration",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.createIntegration.body ||
    integrationValidation.createIntegration,
    "body"
  ),
  createIntegration
);

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

router.get(
  "/get-all-integrations",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.getAllIntegrations.query,
    "query"
  ),
  getAllIntegrations
);

/*
|--------------------------------------------------------------------------
| GET ACTIVE
|--------------------------------------------------------------------------
*/

router.get(
  "/get-active-integrations",
  authMiddleware,
  integrationAdminAccess,
  getActiveIntegrations
);

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

router.get(
  "/get-integration-by-id/:id",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.getIntegrationById.params ||
    integrationValidation.getIntegrationById,
    "params"
  ),
  getIntegrationById
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put(
  "/update-integration/:id",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.updateIntegration.params,
    "params"
  ),
  validate(
    integrationValidation.updateIntegration.body,
    "body"
  ),
  updateIntegration
);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-integration-status/:id",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.changeIntegrationStatus.params,
    "params"
  ),
  validate(
    integrationValidation.changeIntegrationStatus.body,
    "body"
  ),
  changeIntegrationStatus
);

/*
|--------------------------------------------------------------------------
| UPDATE SYNC STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/update-sync-status/:id",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.updateSyncStatus.params,
    "params"
  ),
  validate(
    integrationValidation.updateSyncStatus.body,
    "body"
  ),
  updateSyncStatus
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-integration/:id",
  authMiddleware,
  integrationAdminAccess,
  validate(
    integrationValidation.deleteIntegration.params ||
    integrationValidation.deleteIntegration,
    "params"
  ),
  deleteIntegration
);

router.post(
  "/test/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(
    integrationValidation.testIntegration.params,
    "params"
  ),
  testIntegration
);

router.post(
  "/sync/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(
    integrationValidation.syncIntegration.params,
    "params"
  ),
  syncIntegration
);

export default router;