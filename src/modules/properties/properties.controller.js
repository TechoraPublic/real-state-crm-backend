import * as propertyService from "./properties.service.js";

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY
|--------------------------------------------------------------------------
*/

export const createProperty = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const property = await propertyService.createProperty(
      req.body,
      companyId,
      userId
    );

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET PROPERTY BY ID
|--------------------------------------------------------------------------
*/

export const getPropertyById = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const params =
      req.validatedParams || req.params;

    const property =
      await propertyService.getPropertyById(
        params.id,
        companyId
      );

    return res.status(200).json({
      success: true,
      message: "Property fetched successfully.",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL PROPERTIES
|--------------------------------------------------------------------------
*/

export const getAllProperties = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const query =
      req.validatedQuery || req.query;

    const result =
      await propertyService.getAllProperties({
        companyId,

        page: query.page,

        limit: query.limit,

        search: query.search,

        propertyType:
          query.propertyType,

        listingType:
          query.listingType,

        status:
          query.status,

        city:
          query.city,

        state:
          query.state,

        minPrice:
          query.minPrice,

        maxPrice:
          query.maxPrice,

        minArea:
          query.minArea,

        maxArea:
          query.maxArea,

        sortBy:
          query.sortBy,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully.",
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PROPERTY
|--------------------------------------------------------------------------
*/

export const updateProperty = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const params =
      req.validatedParams || req.params;

    const property =
      await propertyService.updateProperty(
        params.id,
        req.body,
        companyId,
        userId
      );

    return res.status(200).json({
      success: true,
      message: "Property updated successfully.",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CHANGE PROPERTY STATUS
|--------------------------------------------------------------------------
*/

export const changePropertyStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const params =
      req.validatedParams || req.params;

    const status =
      req.body.status;

    const property =
      await propertyService.changePropertyStatus(
        params.id,
        status,
        companyId,
        userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Property status updated successfully.",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE PROPERTY
|--------------------------------------------------------------------------
*/

export const deleteProperty = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const params =
      req.validatedParams || req.params;

    await propertyService.deleteProperty(
      params.id,
      companyId
    );

    return res.status(200).json({
      success: true,
      message:
        "Property deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY TYPE
|--------------------------------------------------------------------------
*/

export const getPropertiesByType = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const query =
      req.validatedQuery || req.query;

    const result =
      await propertyService.getPropertiesByType({
        companyId,

        propertyType:
          query.propertyType,

        page:
          query.page,

        limit:
          query.limit,

        status:
          query.status,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Properties fetched successfully.",
      data: result.properties,
      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET PROPERTIES BY CITY
|--------------------------------------------------------------------------
*/

export const getPropertiesByCity = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const query =
      req.validatedQuery || req.query;

    const result =
      await propertyService.getPropertiesByCity({
        companyId,

        city:
          query.city,

        page:
          query.page,

        limit:
          query.limit,

        propertyType:
          query.propertyType,

        listingType:
          query.listingType,

        status:
          query.status,

        sortOrder:
          query.sortOrder,
      });

    return res.status(200).json({
      success: true,
      message:
        "Properties fetched successfully.",
      data: result.properties,
      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY STATUS
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByStatus = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const counts =
      await propertyService.getPropertyCountsByStatus(
        companyId
      );

    return res.status(200).json({
      success: true,
      message:
        "Property status counts fetched successfully.",
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY TYPE
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByType = async (
  req,
  res,
  next
) => {
  try {
    const companyId =
      req.user.companyId;

    const counts =
      await propertyService.getPropertyCountsByType(
        companyId
      );

    return res.status(200).json({
      success: true,
      message:
        "Property type counts fetched successfully.",
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| PROPERTY COUNTS BY LISTING TYPE
|--------------------------------------------------------------------------
*/

export const getPropertyCountsByListingType =
  async (req, res, next) => {
    try {
      const companyId =
        req.user.companyId;

      const counts =
        await propertyService.getPropertyCountsByListingType(
          companyId
        );

      return res.status(200).json({
        success: true,
        message:
          "Property listing type counts fetched successfully.",
        data: counts,
      });
    } catch (error) {
      next(error);
    }
  };