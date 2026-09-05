import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import propertyValidation from "./properties.validation.js";

import {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    changePropertyStatus,
    deleteProperty,
    getPropertiesByType,
    getPropertiesByCity,
    getPropertyCountsByStatus,
    getPropertyCountsByType,
    getPropertyCountsByListingType,
} from "./properties.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
| POST /api/v1/properties
|--------------------------------------------------------------------------
*/

router.post(
    "/create-property",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    validate(
        propertyValidation.createProperty.body,
        "body"
    ),
    createProperty
);

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
| GET /api/v1/properties
|--------------------------------------------------------------------------
*/

router.get(
    "/get-all-properties",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    validate(
        propertyValidation.getAllProperties.query,
        "query"
    ),
    getAllProperties
);

/*
|--------------------------------------------------------------------------
| GET PROPERTY COUNTS BY STATUS
|--------------------------------------------------------------------------
| GET /api/v1/properties/counts/status
|--------------------------------------------------------------------------
*/

router.get(
    "/get-properties-counts/status",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    getPropertyCountsByStatus
);

/*
|--------------------------------------------------------------------------
| GET PROPERTY COUNTS BY TYPE
|--------------------------------------------------------------------------
| GET /api/v1/properties/counts/type
|--------------------------------------------------------------------------
*/

router.get(
    "/get-properties-counts/type",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    getPropertyCountsByType
);

/*
|--------------------------------------------------------------------------
| GET PROPERTY COUNTS BY LISTING TYPE
|--------------------------------------------------------------------------
| GET /api/v1/properties/counts/listing-type
|--------------------------------------------------------------------------
*/

router.get(
    "/get-properties-counts/listing-type",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    getPropertyCountsByListingType
);

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY TYPE
|--------------------------------------------------------------------------
| GET /api/v1/properties/type/:propertyType
|--------------------------------------------------------------------------
*/

router.get(
    "/get-properties/type",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    validate(
        propertyValidation.getPropertiesByType.query,
        "query"
    ),
    getPropertiesByType
);

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY CITY
|--------------------------------------------------------------------------
| GET /api/v1/properties/city
|
| Example:
| /api/v1/properties/city?city=Delhi
|--------------------------------------------------------------------------
*/

router.get(
  "/get-properties/city",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "ADMIN",
    "SALES_MANAGER"
  ),
  validate(
    propertyValidation.getPropertiesByCity.query,
    "query"
  ),
  getPropertiesByCity
);

/*
|--------------------------------------------------------------------------
| GET PROPERTY BY ID
|--------------------------------------------------------------------------
| GET /api/v1/properties/:id
|--------------------------------------------------------------------------
*/

router.get(
    "/get-property/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    validate(
        propertyValidation.getPropertyById.params,
        "params"
    ),
    getPropertyById
);

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
| PUT /api/v1/properties/:id
|--------------------------------------------------------------------------
*/

router.put(
    "/update-property/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "SALES_MANAGER"
    ),
    validate(
        propertyValidation.updateProperty.params,
        "params"
    ),
    validate(
        propertyValidation.updateProperty.body,
        "body"
    ),
    updateProperty
);

/*
|--------------------------------------------------------------------------
| CHANGE PROPERTY STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/properties/:id/status
|--------------------------------------------------------------------------
*/

router.patch(
    "/get-property-status/:id/status",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN"
    ),
    validate(
        propertyValidation.changePropertyStatus.params,
        "params"
    ),
    validate(
        propertyValidation.changePropertyStatus.body,
        "body"
    ),
    changePropertyStatus
);

/*
|--------------------------------------------------------------------------
| DELETE PROPERTY
|--------------------------------------------------------------------------
| DELETE /api/v1/properties/:id
|--------------------------------------------------------------------------
*/

router.delete(
    "/delete-property/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN"
    ),
    validate(
        propertyValidation.deleteProperty.params,
        "params"
    ),
    deleteProperty
);

export default router;