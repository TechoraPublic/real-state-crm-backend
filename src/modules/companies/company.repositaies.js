import Company from "./company.model.js";
import { Op } from "sequelize";

class CompanyRepository {
  /**
   * Create a new company
   */
  async create(data) {
    return await Company.create(data);
  }

  /**
   * Find company by ID
   */
  async findById(id) {
    return await Company.findByPk(id);
  }

  /**
   * Find company by email
   */
  async findByEmail(email) {
    return await Company.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Find company by name
   */
  async findByName(name) {
    return await Company.findOne({
      where: {
        name,
      },
    });
  }

  /**
   * Get all companies
   */
  async findAll({
    page = 1,
    limit = 10,
    search = "",
    status,
  } = {}) {
    const offset = (page - 1) * limit;

    const where = {};

    // Search by company name, email or phone
    if (search) {
      where[Op.or] = [
        {
          name: {
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
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    return await Company.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Update company
   */
  async update(id, data) {
    const [updatedRows] = await Company.update(data, {
      where: {
        id,
      },
    });

    if (!updatedRows) {
      return null;
    }

    return await this.findById(id);
  }

  /**
   * Delete company
   */
  async delete(id) {
    return await Company.destroy({
      where: {
        id,
      },
    });
  }

  /**
   * Check whether company exists
   */
  async exists(id) {
    const company = await Company.findByPk(id, {
      attributes: ["id"],
    });

    return !!company;
  }
}

export default new CompanyRepository();