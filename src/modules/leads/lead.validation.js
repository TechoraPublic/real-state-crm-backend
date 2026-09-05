import Joi from "joi";

// ============================================================
// COMMON ENUMS
// ============================================================

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site_visit",
  "negotiation",
  "won",
  "lost",
  "on_hold",
];

const LEAD_PRIORITIES = [
  "low",
  "medium",
  "high",
];

const PROPERTY_TYPES = [
  "residential",
  "commercial",
  "plot",
  "land",
  "other",
];

// ============================================================
// CREATE LEAD
// POST /api/v1/leads/create-lead
// ============================================================

const createLeadBody = Joi.object({
  customer_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Customer ID must be a number.",
      "number.integer": "Customer ID must be an integer.",
      "number.positive": "Customer ID must be greater than 0.",
    }),

  assigned_to: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Assigned user ID must be a number.",
      "number.integer": "Assigned user ID must be an integer.",
      "number.positive":
        "Assigned user ID must be greater than 0.",
    }),

  property_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Property ID must be a number.",
      "number.integer": "Property ID must be an integer.",
      "number.positive":
        "Property ID must be greater than 0.",
    }),

  lead_source_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Lead source ID is required.",
      "number.base": "Lead source ID must be a number.",
      "number.integer": "Lead source ID must be an integer.",
      "number.positive":
        "Lead source ID must be greater than 0.",
    }),

  integration_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Integration ID must be a number.",
      "number.integer": "Integration ID must be an integer.",
      "number.positive":
        "Integration ID must be greater than 0.",
    }),

  source_lead_id: Joi.string()
    .trim()
    .max(150)
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Source lead ID must be a string.",
      "string.max":
        "Source lead ID cannot exceed 150 characters.",
    }),

  status: Joi.string()
    .valid(...LEAD_STATUSES)
    .default("new")
    .messages({
      "any.only":
        "Invalid lead status. Allowed values are new, contacted, qualified, site_visit, negotiation, won, lost, on_hold.",
    }),

  priority: Joi.string()
    .valid(...LEAD_PRIORITIES)
    .default("medium")
    .messages({
      "any.only":
        "Invalid priority. Allowed values are low, medium, high.",
    }),

  property_type: Joi.string()
    .valid(...PROPERTY_TYPES)
    .allow(null)
    .optional()
    .messages({
      "any.only":
        "Invalid property type. Allowed values are residential, commercial, plot, land, other.",
    }),

  budget_min: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Minimum budget must be a number.",
      "number.min":
        "Minimum budget cannot be negative.",
    }),

  budget_max: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Maximum budget must be a number.",
      "number.min":
        "Maximum budget cannot be negative.",
    }),

  preferred_location: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max":
        "Preferred location cannot exceed 255 characters.",
    }),

  requirements: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Requirements must be a string.",
    }),

  notes: Joi.string()
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Notes must be a string.",
    }),

  lost_reason: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional()
    .messages({
      "string.max":
        "Lost reason cannot exceed 255 characters.",
    }),

  next_followup_at: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      "date.base":
        "Next follow-up date must be a valid date.",
      "date.format":
        "Next follow-up date must be in a valid ISO format.",
    }),

  created_at_source: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      "date.base":
        "Source creation date must be a valid date.",
      "date.format":
        "Source creation date must be in a valid ISO format.",
    }),
})
  .custom((value, helpers) => {
    if (
      value.budget_min !== undefined &&
      value.budget_min !== null &&
      value.budget_max !== undefined &&
      value.budget_max !== null &&
      value.budget_min > value.budget_max
    ) {
      return helpers.error(
        "any.custom",
        {
          message:
            "Minimum budget cannot be greater than maximum budget.",
        }
      );
    }

    return value;
  })
  .messages({
    "any.custom":
      "{{#message}}",
  });

// ============================================================
// UPDATE LEAD
// PUT /api/v1/leads/update-lead/:id
// ============================================================

const updateLeadBody = Joi.object({
  customer_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

  assigned_to: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

  property_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

  lead_source_id: Joi.number()
    .integer()
    .positive()
    .optional(),

  integration_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),

  source_lead_id: Joi.string()
    .trim()
    .max(150)
    .allow(null, "")
    .optional(),

  status: Joi.string()
    .valid(...LEAD_STATUSES)
    .optional(),

  priority: Joi.string()
    .valid(...LEAD_PRIORITIES)
    .optional(),

  property_type: Joi.string()
    .valid(...PROPERTY_TYPES)
    .allow(null)
    .optional(),

  budget_min: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional(),

  budget_max: Joi.number()
    .precision(2)
    .min(0)
    .allow(null)
    .optional(),

  preferred_location: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional(),

  requirements: Joi.string()
    .trim()
    .allow(null, "")
    .optional(),

  notes: Joi.string()
    .trim()
    .allow(null, "")
    .optional(),

  lost_reason: Joi.string()
    .trim()
    .max(255)
    .allow(null, "")
    .optional(),

  next_followup_at: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  created_at_source: Joi.date()
    .iso()
    .allow(null)
    .optional(),
})
  .min(1)
  .custom((value, helpers) => {
    if (
      value.budget_min !== undefined &&
      value.budget_min !== null &&
      value.budget_max !== undefined &&
      value.budget_max !== null &&
      value.budget_min > value.budget_max
    ) {
      return helpers.error(
        "any.custom",
        {
          message:
            "Minimum budget cannot be greater than maximum budget.",
        }
      );
    }

    return value;
  })
  .messages({
    "object.min":
      "At least one field is required to update the lead.",
    "any.custom":
      "{{#message}}",
  });

// ============================================================
// LEAD ID PARAM
// ============================================================

const leadIdParams = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Lead ID is required.",
      "number.base": "Lead ID must be a number.",
      "number.integer": "Lead ID must be an integer.",
      "number.positive":
        "Lead ID must be greater than 0.",
    }),
});

// ============================================================
// CUSTOMER ID PARAM
// ============================================================

const customerIdParams = Joi.object({
  customerId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Customer ID is required.",
      "number.base": "Customer ID must be a number.",
      "number.integer": "Customer ID must be an integer.",
      "number.positive":
        "Customer ID must be greater than 0.",
    }),
});

// ============================================================
// CHANGE STATUS
// PATCH /api/v1/leads/change-lead-status/:id
// ============================================================

const changeLeadStatusBody = Joi.object({
  status: Joi.string()
    .valid(...LEAD_STATUSES)
    .required()
    .messages({
      "any.required": "Lead status is required.",
      "any.only":
        "Invalid lead status. Allowed values are new, contacted, qualified, site_visit, negotiation, won, lost, on_hold.",
    }),
});

// ============================================================
// CHANGE PRIORITY
// PATCH /api/v1/leads/change-lead-priority/:id
// ============================================================

const changeLeadPriorityBody = Joi.object({
  priority: Joi.string()
    .valid(...LEAD_PRIORITIES)
    .required()
    .messages({
      "any.required": "Lead priority is required.",
      "any.only":
        "Invalid priority. Allowed values are low, medium, high.",
    }),
});

// ============================================================
// ASSIGN LEAD
// PATCH /api/v1/leads/assign-lead/:id
// ============================================================

const assignLeadBody = Joi.object({
  assigned_to: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .required()
    .messages({
      "any.required":
        "Assigned user ID is required. Use null to unassign the lead.",
      "number.base":
        "Assigned user ID must be a number.",
      "number.integer":
        "Assigned user ID must be an integer.",
      "number.positive":
        "Assigned user ID must be greater than 0.",
    }),
});

// ============================================================
// UPDATE FOLLOW-UP
// PATCH /api/v1/leads/update-followup/:id
// ============================================================

const updateLeadFollowupBody = Joi.object({
  next_followup_at: Joi.date()
    .iso()
    .allow(null)
    .required()
    .messages({
      "any.required":
        "Next follow-up date is required. Use null to remove the follow-up.",
      "date.base":
        "Next follow-up date must be a valid date.",
      "date.format":
        "Next follow-up date must be in ISO format.",
    }),
});

// ============================================================
// GET ALL LEADS QUERY
// GET /api/v1/leads/get-all-leads
// ============================================================

const getAllLeadsQuery = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number.",
      "number.integer": "Page must be an integer.",
      "number.min":
        "Page must be greater than or equal to 1.",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min":
        "Limit must be greater than or equal to 1.",
      "number.max":
        "Limit cannot be greater than 100.",
    }),

  search: Joi.string()
    .trim()
    .max(150)
    .allow("")
    .optional(),

  status: Joi.string()
    .valid(...LEAD_STATUSES)
    .optional()
    .messages({
      "any.only":
        "Invalid lead status.",
    }),

  priority: Joi.string()
    .valid(...LEAD_PRIORITIES)
    .optional()
    .messages({
      "any.only":
        "Invalid lead priority.",
    }),

  leadSourceId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Lead source ID must be a number.",
      "number.integer":
        "Lead source ID must be an integer.",
      "number.positive":
        "Lead source ID must be greater than 0.",
    }),

  assignedTo: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Assigned user ID must be a number.",
      "number.integer":
        "Assigned user ID must be an integer.",
      "number.positive":
        "Assigned user ID must be greater than 0.",
    }),

  propertyId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Property ID must be a number.",
      "number.integer":
        "Property ID must be an integer.",
      "number.positive":
        "Property ID must be greater than 0.",
    }),

  integrationId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":
        "Integration ID must be a number.",
      "number.integer":
        "Integration ID must be an integer.",
      "number.positive":
        "Integration ID must be greater than 0.",
    }),

  sortBy: Joi.string()
    .valid(
      "id",
      "created_at",
      "updated_at",
      "status",
      "priority",
      "budget_min",
      "budget_max",
      "next_followup_at"
    )
    .default("created_at")
    .messages({
      "any.only":
        "Invalid sort field.",
    }),

  sortOrder: Joi.string()
    .valid("ASC", "DESC")
    .insensitive()
    .default("DESC")
    .messages({
      "any.only":
        "Sort order must be ASC or DESC.",
    }),
});

// ============================================================
// EXPORT
// ============================================================

export default {
  createLead: {
    body: createLeadBody,
  },

  updateLead: {
    body: updateLeadBody,
    params: leadIdParams,
  },

  getLeadById: {
    params: leadIdParams,
  },

  getAllLeads: {
    query: getAllLeadsQuery,
  },

  changeLeadStatus: {
    body: changeLeadStatusBody,
    params: leadIdParams,
  },

  changeLeadPriority: {
    body: changeLeadPriorityBody,
    params: leadIdParams,
  },

  assignLead: {
    body: assignLeadBody,
    params: leadIdParams,
  },

  updateLeadFollowup: {
    body: updateLeadFollowupBody,
    params: leadIdParams,
  },

  deleteLead: {
    params: leadIdParams,
  },

  getLeadsByCustomer: {
    params: customerIdParams,
  },
};