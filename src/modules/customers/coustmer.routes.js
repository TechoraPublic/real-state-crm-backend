import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import customerValidation from "./customer.validation.js";

import {
createCustomer,
getAllCustomers,
getCustomerById,
updateCustomer,
changeCustomerStatus,
deleteCustomer,
getCustomerLeads,
} from "./customer.controller.js";

const router = express.Router();

/**

* Create Customer
* POST /api/v1/customers
  */
  router.post(
  "/create-customer",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.createCustomer.body, "body"),
  createCustomer
  );

/**

* Get All Customers
* GET /api/v1/customers
  */
  router.get(
  "/get-all-customers",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.getAllCustomers.query, "query"),
  getAllCustomers
  );

/**

* Get Customer Leads
* GET /api/v1/customers/:id/leads
*
* IMPORTANT:
* This route must come before /:id
  */
  router.get(
  "/get-customer-leads/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.getCustomerLeads.params, "params"),
  validate(customerValidation.getCustomerLeads.query, "query"),
  getCustomerLeads
  );

/**

* Get Customer By ID
* GET /api/v1/customers/:id
  */
  router.get(
  "/get-customer-by-id/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.getCustomerById.params, "params"),
  getCustomerById
  );

/**

* Update Customer
* PUT /api/v1/customers/:id
  */
  router.put(
  "/update-customer/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.updateCustomer.params, "params"),
  validate(customerValidation.updateCustomer.body, "body"),
  updateCustomer
  );

/**

* Change Customer Status
* PATCH /api/v1/customers/:id/status
  */
  router.patch(
  "/change-customer-status/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  validate(customerValidation.changeCustomerStatus.params, "params"),
  validate(customerValidation.changeCustomerStatus.body, "body"),
  changeCustomerStatus
  );

/**

* Delete Customer
* DELETE /api/v1/customers/:id
*
* Only SUPER_ADMIN and ADMIN can delete customers.
  */
  router.delete(
  "/delete-customer/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(customerValidation.deleteCustomer.params, "params"),
  deleteCustomer
  );

export default router;
