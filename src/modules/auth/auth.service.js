import bcrypt from "bcryptjs";
import authRepository from "./auth.repository.js";
import { generateToken } from "../../utils/token.js";

class AuthService {
  /**
   * LOGIN USER
   */
  async login({ email, password }) {
    // 1. Find user with role + permissions
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // 2. Check user status
    if (user.status !== "active") {
      throw new Error("Your account is inactive. Please contact administrator.");
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 4. Update last login
    await authRepository.updateLastLogin(user.id);

    // 5. Generate JWT
    // JWT contains ONLY userId and roleId
    const token = generateToken({
      userId: user.id,
      roleId: user.role_id,
    });

    // 6. Extract permissions
    const permissions =
      user.role?.rolePermissions
        ?.filter((rolePermission) => rolePermission.permission)
        ?.map((rolePermission) => ({
          id: rolePermission.permission.id,
          name: rolePermission.permission.name,
          key: rolePermission.permission.key,
          module: rolePermission.permission.module,
          action: rolePermission.permission.action,
        })) || [];

    // 7. Return safe user object
    return {
      token,

      user: {
        id: user.id,
        company_id: user.company_id,
        role_id: user.role_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        last_login_at: user.last_login_at,
      },

      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            key: user.role.key,
          }
        : null,

      permissions,
    };
  }

  /**
   * GET CURRENT USER
   */
  async getMe(userId) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.status !== "active") {
      throw new Error("Your account is inactive.");
    }

    const permissions =
      user.role?.rolePermissions
        ?.filter((rolePermission) => rolePermission.permission)
        ?.map((rolePermission) => ({
          id: rolePermission.permission.id,
          name: rolePermission.permission.name,
          key: rolePermission.permission.key,
          module: rolePermission.permission.module,
          action: rolePermission.permission.action,
        })) || [];

    return {
      user: {
        id: user.id,
        company_id: user.company_id,
        role_id: user.role_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        last_login_at: user.last_login_at,
      },

      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            key: user.role.key,
          }
        : null,

      permissions,
    };
  }
}

export default new AuthService();