import express from "express";

import companyController from "./company.controller.js";

import {
  createCompanyValidation,
  updateCompanyValidation,
  companyIdValidation,
  getCompaniesValidation,
} from "../../validation/company.validation.js";

import {validate} from "../../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * -------------------------------------------------------
 * Company Routes
 * -------------------------------------------------------
 */

/**
 * Create Company
 * POST /api/companies
 */
router.post(
  "/create-company",
  validate(createCompanyValidation, "body"),
  companyController.createCompany
);

/**
 * Get All Companies
 * GET /api/companies
 *
 * Query:
 * ?page=1
 * ?limit=10
 * ?search=realty
 * ?status=active
 */
router.get(
  "/get-all-companies",
  validate(getCompaniesValidation, "query"),
  companyController.getCompanies
);

/**
 * Get Company By ID
 * GET /api/companies/:id
 */
router.get(
  "/get-company-by-id/:id",
  validate(companyIdValidation, "params"),
  companyController.getCompanyById
);

/**
 * Update Company
 * PUT /api/companies/:id
 */
router.put(
  "/update-company/:id",
  validate(companyIdValidation, "params"),
  validate(updateCompanyValidation, "body"),
  companyController.updateCompany
);

/**
 * Delete Company
 * DELETE /api/companies/:id
 */
router.delete(
  "/delete-company/:id",
  validate(companyIdValidation, "params"),
  companyController.deleteCompany
);

export default router;