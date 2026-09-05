import { Op } from "sequelize";

import {
  SiteVisit,
  Lead,
  Property,
  User,
  Customer,
} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| Find Site Visit By ID
|--------------------------------------------------------------------------
*/

export const findSiteVisitById = async (
  siteVisitId,
  companyId
) => {
  return await SiteVisit.findOne({
    where: {
      id: siteVisitId,
    },

    include: [
      {
        association: SiteVisit.associations.lead,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "company_id",
          "customer_id",
          "assigned_to",
          "property_id",
          "lead_source_id",
          "status",
          "priority",
        ],

        include: [
          {
            association: Lead.associations.customer,
            required: false,

            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone",
            ],
          },
        ],
      },

      {
        association: SiteVisit.associations.property,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "address",
          "city",
          "state",
          "country",
          "status",
        ],
      },

      {
        association: SiteVisit.associations.assignedUser,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },

      {
        association: SiteVisit.associations.createdBy,
        required: false,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },
    ],
  });
};


/*
|--------------------------------------------------------------------------
| Create Site Visit
|--------------------------------------------------------------------------
*/

export const createSiteVisit = async (data) => {
  return await SiteVisit.create(data);
};


/*
|--------------------------------------------------------------------------
| Get All Site Visits
|--------------------------------------------------------------------------
*/

export const findAllSiteVisits = async ({
  companyId,
  page = 1,
  limit = 20,
  status,
  leadId,
  propertyId,
  assignedTo,
  fromDate,
  toDate,
  sortOrder = "DESC",
}) => {
  const offset =
    (Number(page) - 1) * Number(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (leadId) {
    where.lead_id = leadId;
  }

  if (propertyId) {
    where.property_id = propertyId;
  }

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  if (fromDate && toDate) {
    where.scheduled_at = {
      [Op.between]: [
        fromDate,
        toDate,
      ],
    };
  } else if (fromDate) {
    where.scheduled_at = {
      [Op.gte]: fromDate,
    };
  } else if (toDate) {
    where.scheduled_at = {
      [Op.lte]: toDate,
    };
  }

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await SiteVisit.findAndCountAll({
    where,

    include: [
      {
        association: SiteVisit.associations.lead,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "company_id",
          "customer_id",
          "assigned_to",
          "property_id",
          "lead_source_id",
          "status",
          "priority",
        ],

        include: [
          {
            association: Lead.associations.customer,
            required: false,

            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone",
            ],
          },
        ],
      },

      {
        association: SiteVisit.associations.property,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "address",
          "city",
          "state",
          "country",
          "status",
        ],
      },

      {
        association: SiteVisit.associations.assignedUser,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },

      {
        association: SiteVisit.associations.createdBy,
        required: false,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },
    ],

    order: [
      [
        "scheduled_at",
        safeSortOrder,
      ],
      [
        "id",
        safeSortOrder,
      ],
    ],

    limit: Number(limit),
    offset: Number(offset),

    distinct: true,
  });
};


/*
|--------------------------------------------------------------------------
| Update Site Visit
|--------------------------------------------------------------------------
*/

export const updateSiteVisit = async (
  siteVisitId,
  companyId,
  data
) => {
  const siteVisit =
    await findSiteVisitById(
      siteVisitId,
      companyId
    );

  if (!siteVisit) {
    return null;
  }

  await siteVisit.update(data);

  return await findSiteVisitById(
    siteVisitId,
    companyId
  );
};


/*
|--------------------------------------------------------------------------
| Update Site Visit Status
|--------------------------------------------------------------------------
*/

export const updateSiteVisitStatus = async (
  siteVisitId,
  companyId,
  status,
  outcome = undefined
) => {
  const siteVisit =
    await findSiteVisitById(
      siteVisitId,
      companyId
    );

  if (!siteVisit) {
    return null;
  }

  const updateData = {
    status,
  };

  if (outcome !== undefined) {
    updateData.outcome = outcome;
  }

  await siteVisit.update(updateData);

  return await findSiteVisitById(
    siteVisitId,
    companyId
  );
};


/*
|--------------------------------------------------------------------------
| Delete Site Visit
|--------------------------------------------------------------------------
*/

export const deleteSiteVisit = async (
  siteVisitId,
  companyId
) => {
  const siteVisit =
    await findSiteVisitById(
      siteVisitId,
      companyId
    );

  if (!siteVisit) {
    return false;
  }

  await siteVisit.destroy();

  return true;
};


/*
|--------------------------------------------------------------------------
| Get Site Visits By Lead
|--------------------------------------------------------------------------
*/

export const findSiteVisitsByLead = async ({
  leadId,
  companyId,
  page = 1,
  limit = 20,
  sortOrder = "DESC",
}) => {
  const offset =
    (Number(page) - 1) * Number(limit);

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await SiteVisit.findAndCountAll({
    where: {
      lead_id: leadId,
    },

    include: [
      {
        association: SiteVisit.associations.lead,
        required: true,

        where: {
          id: leadId,
          company_id: companyId,
        },

        attributes: [
          "id",
          "company_id",
          "customer_id",
          "assigned_to",
          "property_id",
          "lead_source_id",
          "status",
          "priority",
        ],

        include: [
          {
            association: Lead.associations.customer,
            required: false,

            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone",
            ],
          },
        ],
      },

      {
        association: SiteVisit.associations.property,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "address",
          "city",
          "state",
          "country",
          "status",
        ],
      },

      {
        association: SiteVisit.associations.assignedUser,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },

      {
        association: SiteVisit.associations.createdBy,
        required: false,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },
    ],

    order: [
      [
        "scheduled_at",
        safeSortOrder,
      ],
      [
        "id",
        safeSortOrder,
      ],
    ],

    limit: Number(limit),
    offset: Number(offset),

    distinct: true,
  });
};


/*
|--------------------------------------------------------------------------
| Get Site Visits By Property
|--------------------------------------------------------------------------
*/

export const findSiteVisitsByProperty = async ({
  propertyId,
  companyId,
  page = 1,
  limit = 20,
  status,
  sortOrder = "DESC",
}) => {
  const offset =
    (Number(page) - 1) * Number(limit);

  const where = {
    property_id: propertyId,
  };

  if (status) {
    where.status = status;
  }

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await SiteVisit.findAndCountAll({
    where,

    include: [
      {
        association: SiteVisit.associations.lead,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "company_id",
          "customer_id",
          "assigned_to",
          "property_id",
          "lead_source_id",
          "status",
          "priority",
        ],

        include: [
          {
            association: Lead.associations.customer,
            required: false,

            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "phone",
            ],
          },
        ],
      },

      {
        association: SiteVisit.associations.property,
        required: true,

        where: {
          id: propertyId,
          company_id: companyId,
        },

        attributes: [
          "id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "address",
          "city",
          "state",
          "country",
          "status",
        ],
      },

      {
        association: SiteVisit.associations.assignedUser,
        required: true,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },

      {
        association: SiteVisit.associations.createdBy,
        required: false,

        where: {
          company_id: companyId,
        },

        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
        ],
      },
    ],

    order: [
      [
        "scheduled_at",
        safeSortOrder,
      ],
      [
        "id",
        safeSortOrder,
      ],
    ],

    limit: Number(limit),
    offset: Number(offset),

    distinct: true,
  });
};