import { Op } from "sequelize";

import {Customer,Lead} from "../../databases/models.js";

/*
|--------------------------------------------------------------------------
| CREATE CUSTOMER
|--------------------------------------------------------------------------
*/

export const createCustomer = async (data) => {
  return await Customer.create(data);
};


/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY ID
|--------------------------------------------------------------------------
| Used by:
| GET    /customers/:id
| PUT    /customers/:id
| PATCH  /customers/:id/status
| DELETE /customers/:id
|--------------------------------------------------------------------------
*/

export const findCustomerById = async (id, companyId) => {
  return await Customer.findOne({
    where: {
      id,
      company_id: companyId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY PHONE
|--------------------------------------------------------------------------
| Used to prevent duplicate customers inside the same company.
|--------------------------------------------------------------------------
*/

export const findCustomerByPhone = async (
  phone,
  companyId,
  excludeCustomerId = null
) => {
  const where = {
    phone,
    company_id: companyId,
  };

  if (excludeCustomerId !== null && excludeCustomerId !== undefined) {
    where.id = {
      [Op.ne]: excludeCustomerId,
    };
  }

  return await Customer.findOne({
    where,
  });
};


/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMERS
|--------------------------------------------------------------------------
| Supports:
| - Pagination
| - Search
| - Status
| - City
| - State
| - Sorting
|--------------------------------------------------------------------------
*/

export const findAllCustomers = async ({
  companyId,

  page = 1,
  limit = 20,

  search,
  status,
  city,
  state,

  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  const offset = (Number(page) - 1) * Number(limit);

  const where = {
    company_id: companyId,
  };


  /*
  |--------------------------------------------------------------------------
  | STATUS FILTER
  |--------------------------------------------------------------------------
  */

  if (status) {
    where.status = status;
  }


  /*
  |--------------------------------------------------------------------------
  | CITY FILTER
  |--------------------------------------------------------------------------
  */

  if (city) {
    where.city = {
      [Op.like]: `%${city}%`,
    };
  }


  /*
  |--------------------------------------------------------------------------
  | STATE FILTER
  |--------------------------------------------------------------------------
  */

  if (state) {
    where.state = {
      [Op.like]: `%${state}%`,
    };
  }


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  | Search across:
  | - first name
  | - last name
  | - email
  | - phone
  | - alternate phone
  |--------------------------------------------------------------------------
  */

  if (search) {
    where[Op.or] = [
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
        email: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        phone: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        alternate_phone: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }


  /*
  |--------------------------------------------------------------------------
  | SORTING
  |--------------------------------------------------------------------------
  */

  const allowedSortFields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "city",
    "state",
    "status",
    "created_at",
    "updated_at",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";


  /*
  |--------------------------------------------------------------------------
  | QUERY
  |--------------------------------------------------------------------------
  */

  return await Customer.findAndCountAll({
    where,

    limit: Number(limit),
    offset: Number(offset),

    order: [
      [safeSortBy, safeSortOrder],
      ["id", safeSortOrder],
    ],
  });
};


/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER
|--------------------------------------------------------------------------
*/

export const updateCustomer = async (
  id,
  companyId,
  data
) => {
  const [updatedRows] = await Customer.update(
    data,
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await Customer.findOne({
    where: {
      id,
      company_id: companyId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| CHANGE CUSTOMER STATUS
|--------------------------------------------------------------------------
*/

export const updateCustomerStatus = async (
  id,
  companyId,
  status
) => {
  const [updatedRows] = await Customer.update(
    {
      status,
    },
    {
      where: {
        id,
        company_id: companyId,
      },
    }
  );

  if (!updatedRows) {
    return null;
  }

  return await Customer.findOne({
    where: {
      id,
      company_id: companyId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| DELETE CUSTOMER
|--------------------------------------------------------------------------
*/

export const deleteCustomer = async (
  id,
  companyId
) => {
  return await Customer.destroy({
    where: {
      id,
      company_id: companyId,
    },
  });
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER LEADS
|--------------------------------------------------------------------------
| GET /api/v1/customers/:id/leads
|--------------------------------------------------------------------------
|
| Tenant isolation is enforced through:
|
| Customer.company_id
|        ↓
| Customer ID
|        ↓
| Lead.customer_id
|        ↓
| Lead.company_id
|--------------------------------------------------------------------------
*/

export const findCustomerLeads = async ({
  customerId,
  companyId,

  page = 1,
  limit = 20,

  status,
  priority,

  sortOrder = "DESC",
}) => {
  const offset = (Number(page) - 1) * Number(limit);

  const where = {
    customer_id: customerId,
    company_id: companyId,
  };


  /*
  |--------------------------------------------------------------------------
  | OPTIONAL FILTERS
  |--------------------------------------------------------------------------
  */

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }


  /*
  |--------------------------------------------------------------------------
  | QUERY
  |--------------------------------------------------------------------------
  */

  return await Lead.findAndCountAll({
    where,

    limit: Number(limit),
    offset: Number(offset),

    order: [
      [
        "created_at",
        String(sortOrder).toUpperCase() === "ASC"
          ? "ASC"
          : "DESC",
      ],
      [
        "id",
        String(sortOrder).toUpperCase() === "ASC"
          ? "ASC"
          : "DESC",
      ],
    ],
  });
};