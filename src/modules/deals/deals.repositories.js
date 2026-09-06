import { Op } from "sequelize";

import {
  Deal,
  Lead,
  Customer,
  Property,
  User,
} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| Find Deal By ID
|--------------------------------------------------------------------------
*/

export const findDealById = async (
  dealId,
  companyId
) => {
  return await Deal.findOne({
    where: {
      id: dealId,
      company_id: companyId,
    },

    include: [
      {
        association: Deal.associations.lead,
        required: true,

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
        association: Deal.associations.customer,
        required: false,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "phone",
          "alternate_phone",
          "city",
          "state",
          "country",
          "pincode",
          "status",
        ],
      },

      {
        association: Deal.associations.property,
        required: true,

        attributes: [
          "id",
          "company_id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "address",
          "city",
          "state",
          "country",
          "pincode",
          "status",
        ],
      },

      {
        association: Deal.associations.assignedUser,
        required: true,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "status",
        ],
      },

      {
        association: Deal.associations.createdBy,
        required: false,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
        ],
      },

      {
        association: Deal.associations.updatedBy,
        required: false,

        attributes: [
          "id",
          "company_id",
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
| Create Deal
|--------------------------------------------------------------------------
*/

export const createDeal = async (data) => {
  return await Deal.create(data);
};


/*
|--------------------------------------------------------------------------
| Find All Deals
|--------------------------------------------------------------------------
*/

export const findAllDeals = async ({
  companyId,
  page = 1,
  limit = 20,
  search,
  leadId,
  customerId,
  propertyId,
  assignedTo,
  stage,
  status,
  fromDate,
  toDate,
  minValue,
  maxValue,
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const offset =
    (Number(page) - 1) * Number(limit);

  const where = {
    company_id: companyId,
  };

  /*
  |--------------------------------------------------------------------------
  | Direct Filters
  |--------------------------------------------------------------------------
  */

  if (leadId) {
    where.lead_id = leadId;
  }

  if (customerId) {
    where.customer_id = customerId;
  }

  if (propertyId) {
    where.property_id = propertyId;
  }

  if (assignedTo) {
    where.assigned_to = assignedTo;
  }

  if (stage) {
    where.stage = stage;
  }

  if (status) {
    where.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Deal Value Filter
  |--------------------------------------------------------------------------
  */

  if (
    minValue !== undefined &&
    minValue !== null &&
    maxValue !== undefined &&
    maxValue !== null
  ) {
    where.deal_value = {
      [Op.between]: [
        minValue,
        maxValue,
      ],
    };
  } else if (
    minValue !== undefined &&
    minValue !== null
  ) {
    where.deal_value = {
      [Op.gte]: minValue,
    };
  } else if (
    maxValue !== undefined &&
    maxValue !== null
  ) {
    where.deal_value = {
      [Op.lte]: maxValue,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Expected Close Date Filter
  |--------------------------------------------------------------------------
  */

  if (fromDate && toDate) {
    where.expected_close_date = {
      [Op.between]: [
        fromDate,
        toDate,
      ],
    };
  } else if (fromDate) {
    where.expected_close_date = {
      [Op.gte]: fromDate,
    };
  } else if (toDate) {
    where.expected_close_date = {
      [Op.lte]: toDate,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const include = [
    {
      association: Deal.associations.lead,
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
      association: Deal.associations.customer,
      required: false,

      where: search
        ? {
            [Op.or]: [
              {
                first_name: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                last_name: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                phone: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                email: {
                  [Op.like]: `%${search}%`,
                },
              },
            ],
          }
        : undefined,

      attributes: [
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
        "phone",
      ],
    },

    {
      association: Deal.associations.property,
      required: true,

      where: search
        ? {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                property_code: {
                  [Op.like]: `%${search}%`,
                },
              },
              {
                city: {
                  [Op.like]: `%${search}%`,
                },
              },
            ],
          }
        : undefined,

      attributes: [
        "id",
        "company_id",
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
      association: Deal.associations.assignedUser,
      required: true,

      where: {
        company_id: companyId,
      },

      attributes: [
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
        "status",
      ],
    },

    {
      association: Deal.associations.createdBy,
      required: false,

      attributes: [
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
      ],
    },

    {
      association: Deal.associations.updatedBy,
      required: false,

      attributes: [
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
      ],
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Safe Sorting
  |--------------------------------------------------------------------------
  */

  const allowedSortFields = [
    "created_at",
    "updated_at",
    "deal_value",
    "expected_close_date",
    "closed_at",
    "stage",
    "status",
  ];

  const safeSortBy = allowedSortFields.includes(
    sortBy
  )
    ? sortBy
    : "created_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  /*
  |--------------------------------------------------------------------------
  | Query
  |--------------------------------------------------------------------------
  */

  return await Deal.findAndCountAll({
    where,

    include,

    order: [
      [
        safeSortBy,
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
| Update Deal
|--------------------------------------------------------------------------
*/

export const updateDeal = async (
  dealId,
  companyId,
  data
) => {
  const deal = await Deal.findOne({
    where: {
      id: dealId,
      company_id: companyId,
    },
  });

  if (!deal) {
    return null;
  }

  await deal.update(data);

  return await findDealById(
    dealId,
    companyId
  );
};


/*
|--------------------------------------------------------------------------
| Update Deal Stage
|--------------------------------------------------------------------------
*/

export const updateDealStage = async (
  dealId,
  companyId,
  stage,
  updatedBy
) => {
  const deal = await Deal.findOne({
    where: {
      id: dealId,
      company_id: companyId,
    },
  });

  if (!deal) {
    return null;
  }

  await deal.update({
    stage,
    updated_by: updatedBy,
  });

  return await findDealById(
    dealId,
    companyId
  );
};


/*
|--------------------------------------------------------------------------
| Update Deal Status
|--------------------------------------------------------------------------
*/

export const updateDealStatus = async (
  dealId,
  companyId,
  status,
  updatedBy,
  closedAt = undefined,
  lostReason = undefined
) => {
  const deal = await Deal.findOne({
    where: {
      id: dealId,
      company_id: companyId,
    },
  });

  if (!deal) {
    return null;
  }

  const updateData = {
    status,
    updated_by: updatedBy,
  };

  if (closedAt !== undefined) {
    updateData.closed_at = closedAt;
  }

  if (lostReason !== undefined) {
    updateData.lost_reason = lostReason;
  }

  await deal.update(updateData);

  return await findDealById(
    dealId,
    companyId
  );
};


/*
|--------------------------------------------------------------------------
| Delete Deal
|--------------------------------------------------------------------------
*/

export const deleteDeal = async (
  dealId,
  companyId
) => {
  const deal = await Deal.findOne({
    where: {
      id: dealId,
      company_id: companyId,
    },
  });

  if (!deal) {
    return false;
  }

  await deal.destroy();

  return true;
};


/*
|--------------------------------------------------------------------------
| Find Deals By Lead
|--------------------------------------------------------------------------
*/

export const findDealsByLead = async ({
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

  return await Deal.findAndCountAll({
    where: {
      lead_id: leadId,
      company_id: companyId,
    },

    include: [
      {
        association: Deal.associations.lead,
        required: true,

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
        association: Deal.associations.customer,
        required: false,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "phone",
        ],
      },

      {
        association: Deal.associations.property,
        required: true,

        attributes: [
          "id",
          "company_id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "city",
          "state",
          "status",
        ],
      },

      {
        association: Deal.associations.assignedUser,
        required: true,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "status",
        ],
      },
    ],

    order: [
      [
        "created_at",
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
| Find Deals By Customer
|--------------------------------------------------------------------------
*/

export const findDealsByCustomer = async ({
  customerId,
  companyId,
  page = 1,
  limit = 20,
  status,
  sortOrder = "DESC",
}) => {
  const offset =
    (Number(page) - 1) * Number(limit);

  const where = {
    customer_id: customerId,
    company_id: companyId,
  };

  if (status) {
    where.status = status;
  }

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  return await Deal.findAndCountAll({
    where,

    include: [
      {
        association: Deal.associations.lead,
        required: true,

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
      },

      {
        association: Deal.associations.customer,
        required: true,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "phone",
        ],
      },

      {
        association: Deal.associations.property,
        required: true,

        attributes: [
          "id",
          "company_id",
          "property_code",
          "title",
          "property_type",
          "listing_type",
          "price",
          "city",
          "state",
          "status",
        ],
      },

      {
        association: Deal.associations.assignedUser,
        required: true,

        attributes: [
          "id",
          "company_id",
          "first_name",
          "last_name",
          "email",
          "status",
        ],
      },
    ],

    order: [
      [
        "created_at",
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