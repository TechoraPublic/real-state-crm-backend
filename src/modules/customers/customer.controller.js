import * as customerService from "./customer.service.js";

/**

* Create Customer
* POST /api/v1/customers
  */
  export const createCustomer = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;

  const customer = await customerService.createCustomer(
  req.body,
  companyId
  );

  return res.status(201).json({
  success: true,
  message: "Customer created successfully.",
  data: customer,
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Get All Customers
* GET /api/v1/customers
  */
  export const getAllCustomers = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;
  const query = req.validatedQuery || req.query;

  const result = await customerService.getAllCustomers({
  companyId,
  page: query.page,
  limit: query.limit,
  search: query.search,
  status: query.status,
  city: query.city,
  state: query.state,
  sortBy: query.sortBy,
  sortOrder: query.sortOrder,
  });

  return res.status(200).json({
  success: true,
  message: "Customers fetched successfully.",
  data: result.customers,
  pagination: result.pagination,
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Get Customer By ID
* GET /api/v1/customers/:id
  */
  export const getCustomerById = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;
  const params = req.validatedParams || req.params;

  const customer = await customerService.getCustomerById(
  params.id,
  companyId
  );

  return res.status(200).json({
  success: true,
  message: "Customer fetched successfully.",
  data: customer,
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Update Customer
* PUT /api/v1/customers/:id
  */
  export const updateCustomer = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;
  const params = req.validatedParams || req.params;

  const customer = await customerService.updateCustomer(
  params.id,
  req.body,
  companyId
  );

  return res.status(200).json({
  success: true,
  message: "Customer updated successfully.",
  data: customer,
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Change Customer Status
* PATCH /api/v1/customers/:id/status
  */
  export const changeCustomerStatus = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;
  const params = req.validatedParams || req.params;

  const customer = await customerService.changeCustomerStatus(
  params.id,
  req.body.status,
  companyId
  );

  return res.status(200).json({
  success: true,
  message: "Customer status updated successfully.",
  data: customer,
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Delete Customer
* DELETE /api/v1/customers/:id
  */
  export const deleteCustomer = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;
  const params = req.validatedParams || req.params;

  await customerService.deleteCustomer(
  params.id,
  companyId
  );

  return res.status(200).json({
  success: true,
  message: "Customer deleted successfully.",
  });
  } catch (error) {
  next(error);
  }
  };

/**

* Get Customer Leads
* GET /api/v1/customers/:id/leads
  */
  export const getCustomerLeads = async (req, res, next) => {
  try {
  const companyId = req.user.companyId;

  const params = req.validatedParams || req.params;
  const query = req.validatedQuery || req.query;

  const result = await customerService.getCustomerLeads({
  customerId: params.id,
  companyId,
  page: query.page,
  limit: query.limit,
  status: query.status,
  priority: query.priority,
  sortOrder: query.sortOrder,
  });

  return res.status(200).json({
  success: true,
  message: "Customer leads fetched successfully.",
  data: result.leads,
  pagination: result.pagination,
  });
  } catch (error) {
  next(error);
  }
  };
