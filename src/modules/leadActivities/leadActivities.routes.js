import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import leadActivityValidation from "./leadActivities.validation.js";

import {
  createLeadActivity,
  getLeadActivityById,
  getActivitiesByLead,
  getAllActivities,
  deleteLeadActivity,
} from "./leadActivities.controller.js";

const router = express.Router();


/*
|--------------------------------------------------------------------------
| CREATE LEAD ACTIVITY
|--------------------------------------------------------------------------
| POST /api/v1/lead-activities
|--------------------------------------------------------------------------
*/

router.post(
  "/create-lead-activity",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(
    leadActivityValidation.createLeadActivity.body,
    "body"
  ),
  createLeadActivity
);


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVITIES
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities
|--------------------------------------------------------------------------
*/

router.get(
  "/get-all-activities",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(
    leadActivityValidation.getAllActivities.query,
    "query"
  ),
  getAllActivities
);


/*
|--------------------------------------------------------------------------
| GET ACTIVITIES BY LEAD
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities/lead/:leadId
|--------------------------------------------------------------------------
*/

router.get(
  "/get-lead-activity-by-lead-id/:leadId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(
    leadActivityValidation.getActivitiesByLead.params,
    "params"
  ),
  validate(
    leadActivityValidation.getActivitiesByLead.query,
    "query"
  ),
  getActivitiesByLead
);


/*
|--------------------------------------------------------------------------
| GET ACTIVITY BY ID
|--------------------------------------------------------------------------
| GET /api/v1/lead-activities/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/get-lead-activity-by-id/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(
    leadActivityValidation.getLeadActivityById.params,
    "params"
  ),
  getLeadActivityById
);


/*
|--------------------------------------------------------------------------
| DELETE LEAD ACTIVITY
|--------------------------------------------------------------------------
| DELETE /api/v1/lead-activities/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-lead-activity/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(
    leadActivityValidation.deleteLeadActivity.params,
    "params"
  ),
  deleteLeadActivity
);


export default router;