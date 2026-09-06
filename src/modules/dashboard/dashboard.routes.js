import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import dashboardValidation from "./dashboard.validation.js";
import * as dashboardController from "./dashboard.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| DASHBOARD ROUTES
|--------------------------------------------------------------------------
*/

/**
 * GET DASHBOARD
 *
 * GET /api/v1/dashboard?period=30d
 *
 * Supported periods:
 * - 7d
 * - 30d
 * - 90d
 */
router.get(
  "/get-all-dashboard",
  authMiddleware,
  validate(dashboardValidation.getDashboard.query, "query"),
  dashboardController.getDashboard
);

export default router;