import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import leadValidation from "./lead.validation.js";

import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  changeLeadStatus,
  changeLeadPriority,
  assignLead,
  updateLeadFollowup,
  deleteLead,
  getLeadsByCustomer,
} from "./lead.controller.js";

const router = express.Router();

/*
| Lead Routes
|--------------------------------------------------------------------------
| Base URL:
| /api/v1/leads
|
| Authentication:
| All lead APIs require a valid JWT token.
|--------------------------------------------------------------------------
*/


// ============================================================================
// CREATE LEAD
// POST /api/v1/leads/create-lead
// ============================================================================
router.post(
  "/create-lead",
  authMiddleware,
  validate(leadValidation.createLead.body, "body"),
  createLead
);


// ============================================================================
// GET ALL LEADS
// GET /api/v1/leads/get-all-leads
//
// Query params:
// ?page=1
// &limit=10
// &search=delhi
// &status=new
// &priority=high
// &leadSourceId=1
// &assignedTo=2
// &propertyId=5
// &integrationId=1
// &sortBy=created_at
// &sortOrder=DESC
// ============================================================================
router.get(
  "/get-all-leads",
  authMiddleware,
  validate(leadValidation.getAllLeads.query, "query"),
  getAllLeads
);


// ============================================================================
// GET LEAD BY ID
// GET /api/v1/leads/get-lead-by-id/:id
// ============================================================================
router.get(
  "/get-lead-by-id/:id",
  authMiddleware,
  validate(leadValidation.getLeadById.params, "params"),
  getLeadById
);


// ============================================================================
// UPDATE LEAD
// PUT /api/v1/leads/update-lead/:id
// ============================================================================
router.put(
  "/update-lead/:id",
  authMiddleware,
  validate(leadValidation.updateLead.params, "params"),
  validate(leadValidation.updateLead.body, "body"),
  updateLead
);


// ============================================================================
// CHANGE LEAD STATUS
// PATCH /api/v1/leads/change-lead-status/:id
// ============================================================================
router.patch(
  "/change-lead-status/:id",
  authMiddleware,
  validate(leadValidation.changeLeadStatus.params, "params"),
  validate(leadValidation.changeLeadStatus.body, "body"),
  changeLeadStatus
);


// ============================================================================
// CHANGE LEAD PRIORITY
// PATCH /api/v1/leads/change-lead-priority/:id
// ============================================================================
router.patch(
  "/change-lead-priority/:id",
  authMiddleware,
  validate(leadValidation.changeLeadPriority.params, "params"),
  validate(leadValidation.changeLeadPriority.body, "body"),
  changeLeadPriority
);


// ============================================================================
// ASSIGN / UNASSIGN LEAD
// PATCH /api/v1/leads/assign-lead/:id
//
// Body:
// {
//   "assigned_to": 5
// }
//
// Unassign:
// {
//   "assigned_to": null
// }
// ============================================================================
router.patch(
  "/assign-lead/:id",
  authMiddleware,
  validate(leadValidation.assignLead.params, "params"),
  validate(leadValidation.assignLead.body, "body"),
  assignLead
);


// ============================================================================
// UPDATE LEAD FOLLOW-UP
// PATCH /api/v1/leads/update-followup/:id
//
// Body:
// {
//   "next_followup_at": "2026-09-10T10:30:00.000Z"
// }
//
// Remove follow-up:
// {
//   "next_followup_at": null
// }
// ============================================================================
router.patch(
  "/update-followup/:id",
  authMiddleware,
  validate(leadValidation.updateLeadFollowup.params, "params"),
  validate(leadValidation.updateLeadFollowup.body, "body"),
  updateLeadFollowup
);


// ============================================================================
// DELETE LEAD
// DELETE /api/v1/leads/delete-lead/:id
// ============================================================================
router.delete(
  "/delete-lead/:id",
  authMiddleware,
  validate(leadValidation.deleteLead.params, "params"),
  deleteLead
);


// ============================================================================
// GET LEADS BY CUSTOMER
// GET /api/v1/leads/customer/:customerId
// ============================================================================
router.get(
  "/customer/:customerId",
  authMiddleware,
  validate(leadValidation.getLeadsByCustomer.params, "params"),
  getLeadsByCustomer
);


export default router;