import {User,Role,RolePermission,Permission} from "../../databases/models.js"

class AuthRepository {
  /**
   * =========================================================
   * FIND USER BY EMAIL
   * =========================================================
   */
  async findUserByEmail(email) {
    return await User.findOne({
      where: {
        email,
      },

      include: [
        {
          model: Role,
          as: "role",

          include: [
            {
              model: RolePermission,
              as: "rolePermissions",

              include: [
                {
                  model: Permission,
                  as: "permission",

                  where: {
                    status: "active",
                  },

                  required: false,
                },
              ],

              required: false,
            },
          ],
        },
      ],
    });
  }

  /**
   * =========================================================
   * FIND USER BY ID
   * =========================================================
   */
  async findUserById(userId) {
    return await User.findOne({
      where: {
        id: userId,
      },

      include: [
        {
          model: Role,
          as: "role",

          include: [
            {
              model: RolePermission,
              as: "rolePermissions",

              include: [
                {
                  model: Permission,
                  as: "permission",

                  where: {
                    status: "active",
                  },

                  required: false,
                },
              ],

              required: false,
            },
          ],
        },
      ],
    });
  }

  /**
   * =========================================================
   * UPDATE LAST LOGIN
   * =========================================================
   */
  async updateLastLogin(userId) {
    return await User.update(
      {
        last_login_at: new Date(),
      },
      {
        where: {
          id: userId,
        },
      }
    );
  }
}

export default new AuthRepository();