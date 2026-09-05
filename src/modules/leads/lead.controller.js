import * as leadService from "./lead.service.js";

// ============================================================
// CREATE LEAD
// POST /api/v1/leads/create-lead
// ============================================================

export const createLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const lead = await leadService.createLead(
      req.body,
      companyId
    );

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET ALL LEADS
// GET /api/v1/leads/get-all-leads
// ============================================================

export const getAllLeads = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const result = await leadService.getAllLeads({
      companyId,

      page: req.query.page,

      limit: req.query.limit,

      search: req.query.search,

      status: req.query.status,

      priority: req.query.priority,

      leadSourceId: req.query.leadSourceId,

      assignedTo: req.query.assignedTo,

      propertyId: req.query.propertyId,

      integrationId: req.query.integrationId,

      sortBy: req.query.sortBy,

      sortOrder: req.query.sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully.",
      data: result.leads,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET LEAD BY ID
// GET /api/v1/leads/get-lead-by-id/:id
// ============================================================

export const getLeadById = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const lead = await leadService.getLeadById(
      req.params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Lead fetched successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE LEAD
// PUT /api/v1/leads/update-lead/:id
// ============================================================

export const updateLead = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const lead = await leadService.updateLead(
      req.params.id,
      req.body,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CHANGE LEAD STATUS
// PATCH /api/v1/leads/change-lead-status/:id
// ============================================================

export const changeLeadStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const { status } = req.body;

    const lead =
      await leadService.changeLeadStatus(
        req.params.id,
        status,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CHANGE LEAD PRIORITY
// PATCH /api/v1/leads/change-lead-priority/:id
// ============================================================

export const changeLeadPriority = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const { priority } = req.body;

    const lead =
      await leadService.changeLeadPriority(
        req.params.id,
        priority,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Lead priority updated successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ASSIGN LEAD
// PATCH /api/v1/leads/assign-lead/:id
// ============================================================

export const assignLead = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const { assigned_to } = req.body;

    const lead =
      await leadService.assignLead(
        req.params.id,
        assigned_to,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: assigned_to
        ? "Lead assigned successfully."
        : "Lead unassigned successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE FOLLOW-UP
// PATCH /api/v1/leads/update-followup/:id
// ============================================================

export const updateLeadFollowup = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const { next_followup_at } = req.body;

    const lead =
      await leadService.updateLeadFollowup(
        req.params.id,
        next_followup_at,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: next_followup_at
        ? "Lead follow-up updated successfully."
        : "Lead follow-up removed successfully.",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE LEAD
// DELETE /api/v1/leads/delete-lead/:id
// ============================================================

export const deleteLead = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    await leadService.removeLead(
      req.params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET LEADS BY CUSTOMER
// GET /api/v1/leads/customer/:customerId
// ============================================================

export const getLeadsByCustomer = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;

    const leads =
      await leadService.getLeadsByCustomer(
        req.params.customerId,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Customer leads fetched successfully.",
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};