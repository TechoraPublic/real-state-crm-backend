import * as customerRepository from "./customer.repositeries.js";

import {Customer,Lead} from "../../databases/models.js";


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

/**
 * Convert value into a positive integer.
 */
const parsePositiveInteger = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${fieldName} must be a valid positive integer.`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};


/**
 * Validate company ID.
 */
const validateCompanyId = (companyId) => {
  return parsePositiveInteger(companyId, "Company ID");
};


/**
 * Normalize phone number.
 */
const normalizePhone = (phone) => {
  if (phone === null || phone === undefined) {
    return phone;
  }

  return String(phone).trim();
};


/**
 * Normalize email.
 */
const normalizeEmail = (email) => {
  if (email === null || email === undefined || email === "") {
    return null;
  }

  return String(email).trim().toLowerCase();
};


/**
 * Normalize string.
 */
const normalizeString = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  return String(value).trim();
};


/**
 * Throw not found error.
 */
const throwNotFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  throw error;
};


/**
 * Throw bad request error.
 */
const throwBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
};


/**
 * Throw conflict error.
 */
const throwConflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  throw error;
};


/*
|--------------------------------------------------------------------------
| CREATE CUSTOMER
|--------------------------------------------------------------------------
*/

export const createCustomer = async (
  data,
  companyId
) => {
  const validCompanyId = validateCompanyId(companyId);

  /*
  |--------------------------------------------------------------------------
  | Normalize input
  |--------------------------------------------------------------------------
  */

  const customerData = {
    ...data,

    company_id: validCompanyId,

    first_name: normalizeString(data.first_name),

    last_name: normalizeString(data.last_name),

    email: normalizeEmail(data.email),

    phone: normalizePhone(data.phone),

    alternate_phone: normalizePhone(data.alternate_phone),

    address: normalizeString(data.address),

    city: normalizeString(data.city),

    state: normalizeString(data.state),

    country:
      normalizeString(data.country) || "India",

    pincode: normalizeString(data.pincode),

    notes: normalizeString(data.notes),
  };


  /*
  |--------------------------------------------------------------------------
  | Check duplicate phone
  |--------------------------------------------------------------------------
  */

  const existingCustomer =
    await customerRepository.findCustomerByPhone(
      customerData.phone,
      validCompanyId
    );

  if (existingCustomer) {
    throwConflict(
      "A customer with this phone number already exists."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Protected fields
  |--------------------------------------------------------------------------
  */

  delete customerData.id;
  delete customerData.created_at;
  delete customerData.updated_at;


  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  return await customerRepository.createCustomer(
    customerData
  );
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER BY ID
|--------------------------------------------------------------------------
*/

export const getCustomerById = async (
  customerId,
  companyId
) => {
  const validCompanyId = validateCompanyId(companyId);

  const validCustomerId =
    parsePositiveInteger(
      customerId,
      "Customer ID"
    );

  const customer =
    await customerRepository.findCustomerById(
      validCustomerId,
      validCompanyId
    );

  if (!customer) {
    throwNotFound(
      "Customer not found."
    );
  }

  return customer;
};


/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMERS
|--------------------------------------------------------------------------
*/

export const getAllCustomers = async ({
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
  const validCompanyId =
    validateCompanyId(companyId);

  const validPage = Math.max(
    Number(page) || 1,
    1
  );

  const validLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );


  /*
  |--------------------------------------------------------------------------
  | Repository
  |--------------------------------------------------------------------------
  */

  const result =
    await customerRepository.findAllCustomers({
      companyId: validCompanyId,

      page: validPage,
      limit: validLimit,

      search:
        search !== undefined
          ? normalizeString(search)
          : undefined,

      status,

      city:
        city !== undefined
          ? normalizeString(city)
          : undefined,

      state:
        state !== undefined
          ? normalizeString(state)
          : undefined,

      sortBy,
      sortOrder,
    });


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const total = Number(result.count);

  const totalPages =
    Math.ceil(total / validLimit);

  return {
    customers: result.rows,

    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages,

      hasNextPage:
        validPage < totalPages,

      hasPreviousPage:
        validPage > 1,
    },
  };
};


/*
|--------------------------------------------------------------------------
| UPDATE CUSTOMER
|--------------------------------------------------------------------------
*/

export const updateCustomer = async (
  customerId,
  data,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validCustomerId =
    parsePositiveInteger(
      customerId,
      "Customer ID"
    );


  /*
  |--------------------------------------------------------------------------
  | Find customer
  |--------------------------------------------------------------------------
  */

  const existingCustomer =
    await customerRepository.findCustomerById(
      validCustomerId,
      validCompanyId
    );

  if (!existingCustomer) {
    throwNotFound(
      "Customer not found."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Prepare update data
  |--------------------------------------------------------------------------
  */

  const updateData = {
    ...data,
  };


  /*
  |--------------------------------------------------------------------------
  | Normalize fields
  |--------------------------------------------------------------------------
  */

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "first_name"
    )
  ) {
    updateData.first_name =
      normalizeString(updateData.first_name);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "last_name"
    )
  ) {
    updateData.last_name =
      normalizeString(updateData.last_name);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "email"
    )
  ) {
    updateData.email =
      normalizeEmail(updateData.email);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "phone"
    )
  ) {
    updateData.phone =
      normalizePhone(updateData.phone);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "alternate_phone"
    )
  ) {
    updateData.alternate_phone =
      normalizePhone(updateData.alternate_phone);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "address"
    )
  ) {
    updateData.address =
      normalizeString(updateData.address);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "city"
    )
  ) {
    updateData.city =
      normalizeString(updateData.city);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "state"
    )
  ) {
    updateData.state =
      normalizeString(updateData.state);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "country"
    )
  ) {
    updateData.country =
      normalizeString(updateData.country);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "pincode"
    )
  ) {
    updateData.pincode =
      normalizeString(updateData.pincode);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "notes"
    )
  ) {
    updateData.notes =
      normalizeString(updateData.notes);
  }


  /*
  |--------------------------------------------------------------------------
  | Check phone duplication
  |--------------------------------------------------------------------------
  */

  if (
    updateData.phone &&
    updateData.phone !== existingCustomer.phone
  ) {
    const duplicateCustomer =
      await customerRepository.findCustomerByPhone(
        updateData.phone,
        validCompanyId,
        validCustomerId
      );

    if (duplicateCustomer) {
      throwConflict(
        "A customer with this phone number already exists."
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Protected fields
  |--------------------------------------------------------------------------
  */

  delete updateData.id;
  delete updateData.company_id;
  delete updateData.status;
  delete updateData.created_at;
  delete updateData.updated_at;


  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  return await customerRepository.updateCustomer(
    validCustomerId,
    validCompanyId,
    updateData
  );
};


/*
|--------------------------------------------------------------------------
| CHANGE CUSTOMER STATUS
|--------------------------------------------------------------------------
*/

export const changeCustomerStatus = async (
  customerId,
  status,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validCustomerId =
    parsePositiveInteger(
      customerId,
      "Customer ID"
    );


  /*
  |--------------------------------------------------------------------------
  | Validate status
  |--------------------------------------------------------------------------
  */

  const allowedStatuses = [
    "active",
    "inactive",
  ];

  if (!allowedStatuses.includes(status)) {
    throwBadRequest(
      "Customer status must be either active or inactive."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Find customer
  |--------------------------------------------------------------------------
  */

  const customer =
    await customerRepository.findCustomerById(
      validCustomerId,
      validCompanyId
    );

  if (!customer) {
    throwNotFound(
      "Customer not found."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Already same status
  |--------------------------------------------------------------------------
  */

  if (customer.status === status) {
    return customer;
  }


  /*
  |--------------------------------------------------------------------------
  | Update status
  |--------------------------------------------------------------------------
  */

  return await customerRepository.updateCustomerStatus(
    validCustomerId,
    validCompanyId,
    status
  );
};


/*
|--------------------------------------------------------------------------
| DELETE CUSTOMER
|--------------------------------------------------------------------------
*/

export const deleteCustomer = async (
  customerId,
  companyId
) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validCustomerId =
    parsePositiveInteger(
      customerId,
      "Customer ID"
    );


  /*
  |--------------------------------------------------------------------------
  | Find customer
  |--------------------------------------------------------------------------
  */

  const customer =
    await customerRepository.findCustomerById(
      validCustomerId,
      validCompanyId
    );

  if (!customer) {
    throwNotFound(
      "Customer not found."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Check linked leads
  |--------------------------------------------------------------------------
  |
  | A customer may be linked with multiple leads.
  | We don't want deleting a customer to silently
  | destroy the sales history.
  |--------------------------------------------------------------------------
  */

  const linkedLeadCount =
    await Lead.count({
      where: {
        customer_id: validCustomerId,
        company_id: validCompanyId,
      },
    });

  if (linkedLeadCount > 0) {
    throwConflict(
      "Customer cannot be deleted because one or more leads are linked to this customer."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const deleted =
    await customerRepository.deleteCustomer(
      validCustomerId,
      validCompanyId
    );

  if (!deleted) {
    throwNotFound(
      "Customer not found."
    );
  }

  return true;
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMER LEADS
|--------------------------------------------------------------------------
*/

export const getCustomerLeads = async ({
  customerId,
  companyId,

  page = 1,
  limit = 20,

  status,
  priority,

  sortOrder = "DESC",
}) => {
  const validCompanyId =
    validateCompanyId(companyId);

  const validCustomerId =
    parsePositiveInteger(
      customerId,
      "Customer ID"
    );


  /*
  |--------------------------------------------------------------------------
  | Verify customer belongs to company
  |--------------------------------------------------------------------------
  */

  const customer =
    await customerRepository.findCustomerById(
      validCustomerId,
      validCompanyId
    );

  if (!customer) {
    throwNotFound(
      "Customer not found."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const validPage = Math.max(
    Number(page) || 1,
    1
  );

  const validLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );


  /*
  |--------------------------------------------------------------------------
  | Get leads
  |--------------------------------------------------------------------------
  */

  const result =
    await customerRepository.findCustomerLeads({
      customerId: validCustomerId,

      companyId: validCompanyId,

      page: validPage,
      limit: validLimit,

      status,
      priority,

      sortOrder,
    });


  /*
  |--------------------------------------------------------------------------
  | Pagination response
  |--------------------------------------------------------------------------
  */

  const total = Number(result.count);

  const totalPages =
    Math.ceil(total / validLimit);

  return {
    leads: result.rows,

    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      totalPages,

      hasNextPage:
        validPage < totalPages,

      hasPreviousPage:
        validPage > 1,
    },
  };
};