import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import siteVisitValidation from "./siteVisit.validation.js";

import {
  createSiteVisit,
  getAllSiteVisits,
  getSiteVisitById,
  updateSiteVisit,
  changeSiteVisitStatus,
  deleteSiteVisit,
  getSiteVisitsByLead,
  getSiteVisitsByProperty,
} from "./siteVisit.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Allowed Roles
|--------------------------------------------------------------------------
*/

const SITE_VISIT_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
];

/*
|--------------------------------------------------------------------------
| CREATE SITE VISIT
|--------------------------------------------------------------------------
| POST /api/v1/site-visits
|--------------------------------------------------------------------------
*/

router.post(
  "/create-site-visit",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.createSiteVisit.body,
    "body"
  ),
  createSiteVisit
);

/*
|--------------------------------------------------------------------------
| GET ALL SITE VISITS
|--------------------------------------------------------------------------
| GET /api/v1/site-visits
|--------------------------------------------------------------------------
*/

router.get(
  "/get-all-site-visits",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.getAllSiteVisits.query,
    "query"
  ),
  getAllSiteVisits
);

/*
|--------------------------------------------------------------------------
| GET SITE VISIT BY LEAD
|--------------------------------------------------------------------------
| IMPORTANT:
| This route must come BEFORE /:id
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/lead/:leadId
|--------------------------------------------------------------------------
*/

router.get(
  "/site-visits-by-leads/lead/:leadId",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.getSiteVisitsByLead.params,
    "params"
  ),
  validate(
    siteVisitValidation.getSiteVisitsByLead.query,
    "query"
  ),
  getSiteVisitsByLead
);

/*
|--------------------------------------------------------------------------
| GET SITE VISIT BY PROPERTY
|--------------------------------------------------------------------------
| IMPORTANT:
| This route must come BEFORE /:id
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/property/:propertyId
|--------------------------------------------------------------------------
*/

router.get(
  "/site-visits-by-properties/property/:propertyId",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.getSiteVisitsByProperty.params,
    "params"
  ),
  validate(
    siteVisitValidation.getSiteVisitsByProperty.query,
    "query"
  ),
  getSiteVisitsByProperty
);

/*
|--------------------------------------------------------------------------
| GET SITE VISIT BY ID
|--------------------------------------------------------------------------
| GET /api/v1/site-visits/site-visits-by-id/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/site-visits-by-id/:id",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.getSiteVisitById.params,
    "params"
  ),
  getSiteVisitById
);

/*
|--------------------------------------------------------------------------
| UPDATE SITE VISIT
|--------------------------------------------------------------------------
| PUT /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

router.put(
  "/update-site-visit/:id",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.updateSiteVisit.params,
    "params"
  ),
  validate(
    siteVisitValidation.updateSiteVisit.body,
    "body"
  ),
  updateSiteVisit
);

/*
|--------------------------------------------------------------------------
| CHANGE SITE VISIT STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/site-visits/:id/status
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-site-visit-status/:id",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.changeSiteVisitStatus.params,
    "params"
  ),
  validate(
    siteVisitValidation.changeSiteVisitStatus.body,
    "body"
  ),
  changeSiteVisitStatus
);

/*
|--------------------------------------------------------------------------
| DELETE SITE VISIT
|--------------------------------------------------------------------------
| DELETE /api/v1/site-visits/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-site-visit/:id",
  authMiddleware,
  roleMiddleware(...SITE_VISIT_ROLES),
  validate(
    siteVisitValidation.deleteSiteVisit.params,
    "params"
  ),
  deleteSiteVisit
);

export default router;