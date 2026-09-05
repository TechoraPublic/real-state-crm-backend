import { Op } from "sequelize";

import { Property } from "../../databases/models.js";

export const createProperty = async (data) => {
    return await Property.create(data);
};

export const findPropertyById = async (id, companyId) => {
    return await Property.findOne({
        where: {
            id,
            company_id: companyId,
        },
    });
};

export const findPropertyByCode = async (
    propertyCode,
    companyId,
    excludePropertyId = null
) => {
    const where = {
        property_code: propertyCode,
        company_id: companyId,
    };

    if (
        excludePropertyId !== null &&
        excludePropertyId !== undefined
    ) {
        where.id = {
            [Op.ne]: excludePropertyId,
        };
    }

    return await Property.findOne({
        where,
    });
};

export const findAllProperties = async ({
    companyId,
    page = 1,
    limit = 20,
    search,
    propertyType,
    listingType,
    status,
    city,
    state,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    sortBy = "created_at",
    sortOrder = "DESC",
}) => {
    const offset =
        (Number(page) - 1) * Number(limit);

    const where = {
        company_id: companyId,
    };

    if (search) {
        where[Op.or] = [
            {
                property_code: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                title: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                address: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                city: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                state: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    if (propertyType) {
        where.property_type = propertyType;
    }

    if (listingType) {
        where.listing_type = listingType;
    }

    if (status) {
        where.status = status;
    }

    if (city) {
        where.city = {
            [Op.like]: `%${city}%`,
        };
    }

    if (state) {
        where.state = {
            [Op.like]: `%${state}%`,
        };
    }

    /**
    
    * Price Range
      */
    if (
        minPrice !== undefined &&
        minPrice !== null
    ) {
        where.price = {
            ...(where.price || {}),
            [Op.gte]: minPrice,
        };
    }

    if (
        maxPrice !== undefined &&
        maxPrice !== null
    ) {
        where.price = {
            ...(where.price || {}),
            [Op.lte]: maxPrice,
        };
    }

    /**
    
    * Area Range
      */
    if (
        minArea !== undefined &&
        minArea !== null
    ) {
        where.area = {
            ...(where.area || {}),
            [Op.gte]: minArea,
        };
    }

    if (
        maxArea !== undefined &&
        maxArea !== null
    ) {
        where.area = {
            ...(where.area || {}),
            [Op.lte]: maxArea,
        };
    }

    /**
    
    * Allowed sorting fields
    *
    * Prevents arbitrary column names
    * from reaching Sequelize.
      */
    const allowedSortFields = [
        "id",
        "property_code",
        "title",
        "property_type",
        "listing_type",
        "price",
        "city",
        "state",
        "area",
        "status",
        "created_at",
        "updated_at",
    ];

    const safeSortBy =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "created_at";

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    return await Property.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [
            [safeSortBy, safeSortOrder],
            ["id", safeSortOrder],
        ],
    });
};

/**

* Update Property
* Company scoped
  */
export const updateProperty = async (
    id,
    companyId,
    data
) => {
    const [updatedRows] =
        await Property.update(data, {
            where: {
                id,
                company_id: companyId,
            },
        });

    if (!updatedRows) {
        return null;
    }

    return await Property.findOne({
        where: {
            id,
            company_id: companyId,
        },
    });
};

/**

* Update Property Status
  */
export const updatePropertyStatus = async (
    id,
    companyId,
    status,
    updatedBy = null
) => {
    const updateData = {
        status,
    };

    if (
        updatedBy !== null &&
        updatedBy !== undefined
    ) {
        updateData.updated_by = updatedBy;
    }

    const [updatedRows] =
        await Property.update(updateData, {
            where: {
                id,
                company_id: companyId,
            },
        });

    if (!updatedRows) {
        return null;
    }

    return await Property.findOne({
        where: {
            id,
            company_id: companyId,
        },
    });
};

/**

* Delete Property
  */
export const deleteProperty = async (
    id,
    companyId
) => {
    return await Property.destroy({
        where: {
            id,
            company_id: companyId,
        },
    });
};

/**

* Get Properties By Type
  */
export const findPropertiesByType = async ({
    companyId,
    propertyType,
    page = 1,
    limit = 20,
    status,
    sortOrder = "DESC",
}) => {
    const offset =
        (Number(page) - 1) * Number(limit);

    const where = {
        company_id: companyId,
        property_type: propertyType,
    };

    if (status) {
        where.status = status;
    }

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    return await Property.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [
            ["created_at", safeSortOrder],
            ["id", safeSortOrder],
        ],
    });
};

/**

* Get Properties By City
  */
export const findPropertiesByCity = async ({
    companyId,
    city,
    page = 1,
    limit = 20,
    propertyType,
    listingType,
    status,
    sortOrder = "DESC",
}) => {
    const offset =
        (Number(page) - 1) * Number(limit);

    const where = {
        company_id: companyId,
        city: {
            [Op.like]: `%${city}%`,
        },
    };

    if (propertyType) {
        where.property_type = propertyType;
    }

    if (listingType) {
        where.listing_type = listingType;
    }

    if (status) {
        where.status = status;
    }

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    return await Property.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [
            ["created_at", safeSortOrder],
            ["id", safeSortOrder],
        ],
    });
};

/**

* Count Properties By Status
  */
export const countPropertiesByStatus = async (
    companyId
) => {
    return await Property.findAll({
        attributes: [
            "status",
            [
                Property.sequelize.fn(
                    "COUNT",
                    Property.sequelize.col("id")
                ),
                "count",
            ],
        ],
        where: {
            company_id: companyId,
        },
        group: ["status"],
        raw: true,
    });
};

/**

* Count Properties By Type
  */
export const countPropertiesByType = async (
    companyId
) => {
    return await Property.findAll({
        attributes: [
            "property_type",
            [
                Property.sequelize.fn(
                    "COUNT",
                    Property.sequelize.col("id")
                ),
                "count",
            ],
        ],
        where: {
            company_id: companyId,
        },
        group: ["property_type"],
        raw: true,
    });
};

/**

* Count Properties By Listing Type
  */
export const countPropertiesByListingType = async (
    companyId
) => {
    return await Property.findAll({
        attributes: [
            "listing_type",
            [
                Property.sequelize.fn(
                    "COUNT",
                    Property.sequelize.col("id")
                ),
                "count",
            ],
        ],
        where: {
            company_id: companyId,
        },
        group: ["listing_type"],
        raw: true,
    });
};
