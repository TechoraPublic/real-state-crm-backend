import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import followUpValidation from "./FollowUps.validation.js";

import {
  createFollowUp,
  getFollowUpById,
  getAllFollowUps,
  getFollowUpsByLead,
  getFollowUpsByUser,
  updateFollowUp,
  completeFollowUp,
  cancelFollowUp,
  rescheduleFollowUp,
  deleteFollowUp,
  getUpcomingFollowUps,
  getOverdueFollowUps,
  getTodayFollowUps,
  getLatestFollowUp,
  getFollowUpCountByLead,
  getFollowUpCountsByStatus,
} from "./followUps.controller.js";

const router = express.Router();




router.post(
  "/create-followup",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.createFollowUp.body, "body"),
  createFollowUp
);




router.get(
  "/get-all-followups",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getAllFollowUps.query, "query"),
  getAllFollowUps
);




router.get(
  "/upcoming-followups",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getUpcomingFollowUps.query, "query"),
  getUpcomingFollowUps
);




router.get(
  "/overdue-followups",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getOverdueFollowUps.query, "query"),
  getOverdueFollowUps
);




router.get(
  "/today-followups",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getTodayFollowUps.query, "query"),
  getTodayFollowUps
);




router.get(
  "/followup-counts/status",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  getFollowUpCountsByStatus
);




router.get(
  "/get-latest-followup-by-lead-id/lead/:leadId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getLatestFollowUp.params, "params"),
  getLatestFollowUp
);



router.get(
  "/get-followup-count-by-lead/:leadId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getFollowUpCountByLead.params, "params"),
  getFollowUpCountByLead
);



router.get(
  "/get-followups-by-lead/:leadId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getFollowUpsByLead.params, "params"),
  validate(followUpValidation.getFollowUpsByLead.query, "query"),
  getFollowUpsByLead
);



router.get(
  "/get-followups-by-user/:userId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getFollowUpsByUser.params, "params"),
  validate(followUpValidation.getFollowUpsByUser.query, "query"),
  getFollowUpsByUser
);


/*
|--------------------------------------------------------------------------
| GET FOLLOW-UP BY ID
|--------------------------------------------------------------------------
| GET /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/get-followup-by-id/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.getFollowUpById.params, "params"),
  getFollowUpById
);


/*
|--------------------------------------------------------------------------
| UPDATE FOLLOW-UP
|--------------------------------------------------------------------------
| PUT /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

router.put(
  "/update-followup/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.updateFollowUp.params, "params"),
  validate(followUpValidation.updateFollowUp.body, "body"),
  updateFollowUp
);


/*
|--------------------------------------------------------------------------
| COMPLETE FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/complete
|--------------------------------------------------------------------------
*/

router.patch(
  "/complete-followup/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.completeFollowUp.params, "params"),
  validate(followUpValidation.completeFollowUp.body, "body"),
  completeFollowUp
);


/*
|--------------------------------------------------------------------------
| CANCEL FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/cancel
|--------------------------------------------------------------------------
*/

router.patch(
  "/cancel-followup/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.cancelFollowUp.params, "params"),
  cancelFollowUp
);


/*
|--------------------------------------------------------------------------
| RESCHEDULE FOLLOW-UP
|--------------------------------------------------------------------------
| PATCH /api/v1/followups/:id/reschedule
|--------------------------------------------------------------------------
*/

router.patch(
  "/reschedule-followup/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(followUpValidation.rescheduleFollowUp.params, "params"),
  validate(followUpValidation.rescheduleFollowUp.body, "body"),
  rescheduleFollowUp
);


/*
|--------------------------------------------------------------------------
| DELETE FOLLOW-UP
|--------------------------------------------------------------------------
| DELETE /api/v1/followups/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-followup/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(followUpValidation.deleteFollowUp.params, "params"),
  deleteFollowUp
);


export default router;