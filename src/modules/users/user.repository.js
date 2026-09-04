import {User,Role,Company} from "../../databases/models.js";

class UserRepository {
  /**
   * Create a new user
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    return await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email", "phone", "status"],
          required: false,
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "key", "status"],
        },
      ],
    });
  }

  /**
   * Find user by ID including password
   *
   * Useful for authentication / password operations.
   */
  async findByIdWithPassword(id) {
    return await User.findByPk(id, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email", "phone", "status"],
          required: false,
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "key", "status"],
        },
      ],
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email", "phone", "status"],
          required: false,
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "key", "status"],
        },
      ],
    });
  }

  /**
   * Find user by email including password
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "email", "phone", "status"],
          required: false,
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "key", "status"],
        },
      ],
    });
  }

  /**
   * Get all users
   */
  async findAll(options = {}) {
    return await User.findAll({
      attributes: {
        exclude: ["password"],
      },

      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "key", "status"],
        },
      ],

      ...options,
    });
  }

  /**
   * Update user
   */
  async update(id, userData) {
    const [updatedRows] = await User.update(userData, {
      where: {
        id,
      },
      returning: false,
    });

    return updatedRows > 0;
  }

  /**
   * Delete user
   */
  async delete(id) {
    return await User.destroy({
      where: {
        id,
      },
    });
  }

  /**
   * Check whether user exists
   */
  async exists(id) {
    const user = await User.findByPk(id, {
      attributes: ["id"],
    });

    return !!user;
  }

  /**
   * Check whether email already exists
   */
  async emailExists(email, excludeUserId = null) {
    const where = {
      email,
    };

    if (excludeUserId) {
      where.id = {
        [User.sequelize.Sequelize.Op.ne]: excludeUserId,
      };
    }

    const user = await User.findOne({
      where,
      attributes: ["id"],
    });

    return !!user;
  }
}

export default new UserRepository();