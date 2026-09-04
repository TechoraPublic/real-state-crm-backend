import { Op } from "sequelize";
import { LeadSource } from "../../databases/models.js";

class LeadSourceRepository {
  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------
  async create(data) {
    return await LeadSource.create(data);
  }

  // --------------------------------------------------
  // FIND BY ID
  // --------------------------------------------------
  async findById(id, companyId) {
    return await LeadSource.findOne({
      where: {
        id,
        company_id: companyId,
      },
    });
  }

  // --------------------------------------------------
  // FIND BY NAME
  // --------------------------------------------------
  async findByName(name, companyId, excludeId = null) {
    const where = {
      company_id: companyId,
      name,
    };

    if (excludeId) {
      where.id = {
        [Op.ne]: excludeId,
      };
    }

    return await LeadSource.findOne({
      where,
    });
  }

  // --------------------------------------------------
  // FIND BY CODE
  // --------------------------------------------------
  async findByCode(code, companyId, excludeId = null) {
    const where = {
      company_id: companyId,
      code,
    };

    if (excludeId) {
      where.id = {
        [Op.ne]: excludeId,
      };
    }

    return await LeadSource.findOne({
      where,
    });
  }

  // --------------------------------------------------
  // FIND ALL
  // --------------------------------------------------
  async findAll(companyId, options = {}) {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      order = "created_at",
      direction = "DESC",
    } = options;

    const where = {
      company_id: companyId,
    };

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search by name or code
    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          code: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await LeadSource.findAndCountAll({
      where,

      order: [[order, direction]],

      limit: Number(limit),
      offset: Number(offset),
    });

    return {
      rows,
      count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    };
  }

  // --------------------------------------------------
  // FIND ALL ACTIVE
  // --------------------------------------------------
  async findActive(companyId) {
    return await LeadSource.findAll({
      where: {
        company_id: companyId,
        status: "active",
      },

      order: [["name", "ASC"]],
    });
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------
  async update(id, companyId, data) {
    const [updatedRows] = await LeadSource.update(data, {
      where: {
        id,
        company_id: companyId,
      },
    });

    return updatedRows > 0;
  }

  // --------------------------------------------------
  // CHANGE STATUS
  // --------------------------------------------------
  async changeStatus(id, companyId, status) {
    const [updatedRows] = await LeadSource.update(
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

    return updatedRows > 0;
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------
  async delete(id, companyId) {
    return await LeadSource.destroy({
      where: {
        id,
        company_id: companyId,
      },
    });
  }

  // --------------------------------------------------
  // EXISTS
  // --------------------------------------------------
  async exists(id, companyId) {
    const source = await LeadSource.findOne({
      where: {
        id,
        company_id: companyId,
      },
      attributes: ["id"],
    });

    return !!source;
  }
}

export default new LeadSourceRepository();