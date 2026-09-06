/**
 * Normalize a value.
 */
const normalizeValue = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    return trimmedValue || null;
  }

  return value;
};

/**
 * Get a field value from Facebook Lead Ads field_data.
 *
 * Example:
 *
 * field_data: [
 *   {
 *     name: "full_name",
 *     values: ["Rahul Sharma"]
 *   },
 *   {
 *     name: "email",
 *     values: ["rahul@example.com"]
 *   }
 * ]
 */
const getFacebookField = (fieldData, fieldName) => {
  if (!Array.isArray(fieldData)) {
    return null;
  }

  const field = fieldData.find(
    (item) =>
      String(item?.name || "").toLowerCase() === fieldName.toLowerCase()
  );

  return normalizeValue(field?.values?.[0]);
};

/**
 * Normalize Facebook Lead Ads lead.
 */
export const normalizeFacebookLead = (rawLead, integration) => {
  if (!rawLead) {
    throw new Error("Facebook lead data is required.");
  }

  if (!integration) {
    throw new Error("Integration is required.");
  }

  const fieldData = rawLead.field_data || [];

  const fullName = getFacebookField(fieldData, "full_name");

  const firstName = getFacebookField(fieldData, "first_name");

  const lastName = getFacebookField(fieldData, "last_name");

  return {
    company_id: integration.company_id,

    customer_id: null,

    assigned_to: null,

    property_id: null,

    lead_source_id: integration.lead_source_id,

    integration_id: integration.id,

    source_lead_id: normalizeValue(rawLead.id),

    status: "new",

    priority: "medium",

    property_type: null,

    budget_min: null,

    budget_max: null,

    preferred_location: null,

    requirements: null,

    notes: fullName
      ? `Facebook Lead: ${fullName}`
      : "Facebook Lead",

    next_followup_at: null,

    created_at_source: rawLead.created_time
      ? new Date(rawLead.created_time)
      : null,
  };
};

/**
 * Normalize Instagram lead.
 *
 * Instagram payload structure can vary depending
 * on the Meta API product being used.
 *
 * This handles the common fields available to us.
 */
export const normalizeInstagramLead = (rawLead, integration) => {
  if (!rawLead) {
    throw new Error("Instagram lead data is required.");
  }

  if (!integration) {
    throw new Error("Integration is required.");
  }

  const name = normalizeValue(
    rawLead.name ||
      rawLead.full_name ||
      rawLead.username
  );

  return {
    company_id: integration.company_id,

    customer_id: null,

    assigned_to: null,

    property_id: null,

    lead_source_id: integration.lead_source_id,

    integration_id: integration.id,

    source_lead_id: normalizeValue(rawLead.id),

    status: "new",

    priority: "medium",

    property_type: null,

    budget_min: null,

    budget_max: null,

    preferred_location: null,

    requirements: null,

    notes: name
      ? `Instagram Lead: ${name}`
      : "Instagram Lead",

    next_followup_at: null,

    created_at_source: rawLead.created_time
      ? new Date(rawLead.created_time)
      : null,
  };
};

/**
 * Main Lead Normalizer.
 *
 * Automatically selects the correct
 * normalizer based on integration platform.
 */
export const normalizeLead = (rawLead, integration) => {
  if (!integration) {
    throw new Error("Integration is required for lead normalization.");
  }

  const platform = String(integration.platform || "")
    .trim()
    .toLowerCase();

  switch (platform) {
    case "facebook":
      return normalizeFacebookLead(rawLead, integration);

    case "instagram":
      return normalizeInstagramLead(rawLead, integration);

    default: {
      const error = new Error(
        `Lead normalization is not supported for platform: ${platform}`
      );

      error.statusCode = 400;

      throw error;
    }
  }
};

export default normalizeLead;