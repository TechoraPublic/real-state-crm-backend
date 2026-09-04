import bcrypt from "bcryptjs";

import userRepository from "./user.repository.js";
import {Company,Role} from "../../databases/models.js";

class UserService {
  /**
   * CREATE USER
   */
  async createUser(userData) {
    const {
      company_id,
      role_id,
      first_name,
      last_name,
      email,
      phone,
      password,
      status,
    } = userData;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const emailExists = await userRepository.emailExists(normalizedEmail);

    if (emailExists) {
      throw new Error("A user with this email already exists.");
    }

    // Check company if provided
    if (company_id) {
      const company = await Company.findByPk(company_id);

      if (!company) {
        throw new Error("Company not found.");
      }

      if (company.status !== "active") {
        throw new Error("Cannot create user for an inactive company.");
      }
    }

    // Check role
    const role = await Role.findByPk(role_id);

    if (!role) {
      throw new Error("Role not found.");
    }

    if (role.status !== "active") {
      throw new Error("Selected role is inactive.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userRepository.create({
      company_id: company_id || null,
      role_id,
      first_name: first_name.trim(),
      last_name: last_name?.trim() || null,
      email: normalizedEmail,
      phone: phone?.trim() || null,
      password: hashedPassword,
      status: status || "active",
    });

    // Return user without password
    return await userRepository.findById(user.id);
  }

  /**
   * GET USER BY ID
   */
  async getUserById(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  /**
   * GET ALL USERS
   */
  async getUsers(options = {}) {
    return await userRepository.findAll(options);
  }

  /**
   * UPDATE USER
   */
  async updateUser(userId, userData) {
    // Check user
    const existingUser = await userRepository.findByIdWithPassword(userId);

    if (!existingUser) {
      throw new Error("User not found.");
    }

    const updateData = {};

    /*
    |--------------------------------------------------------------------------
    | BASIC INFORMATION
    |--------------------------------------------------------------------------
    */

    if (userData.first_name !== undefined) {
      updateData.first_name = userData.first_name.trim();
    }

    if (userData.last_name !== undefined) {
      updateData.last_name =
        userData.last_name?.trim() || null;
    }

    if (userData.phone !== undefined) {
      updateData.phone =
        userData.phone?.trim() || null;
    }

    /*
    |--------------------------------------------------------------------------
    | EMAIL
    |--------------------------------------------------------------------------
    */

    if (userData.email !== undefined) {
      const normalizedEmail = userData.email
        .trim()
        .toLowerCase();

      // Check only if email changed
      if (normalizedEmail !== existingUser.email) {
        const emailExists = await userRepository.emailExists(
          normalizedEmail,
          userId
        );

        if (emailExists) {
          throw new Error(
            "A user with this email already exists."
          );
        }
      }

      updateData.email = normalizedEmail;
    }

    /*
    |--------------------------------------------------------------------------
    | COMPANY
    |--------------------------------------------------------------------------
    */

    if (userData.company_id !== undefined) {
      if (userData.company_id === null) {
        updateData.company_id = null;
      } else {
        const company = await Company.findByPk(
          userData.company_id
        );

        if (!company) {
          throw new Error("Company not found.");
        }

        if (company.status !== "active") {
          throw new Error(
            "Cannot assign user to an inactive company."
          );
        }

        updateData.company_id = userData.company_id;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE
    |--------------------------------------------------------------------------
    */

    if (userData.role_id !== undefined) {
      const role = await Role.findByPk(userData.role_id);

      if (!role) {
        throw new Error("Role not found.");
      }

      if (role.status !== "active") {
        throw new Error("Selected role is inactive.");
      }

      updateData.role_id = userData.role_id;
    }

    /*
    |--------------------------------------------------------------------------
    | STATUS
    |--------------------------------------------------------------------------
    */

    if (userData.status !== undefined) {
      updateData.status = userData.status;
    }

    /*
    |--------------------------------------------------------------------------
    | PASSWORD
    |--------------------------------------------------------------------------
    */

    if (userData.password !== undefined) {
      updateData.password = await bcrypt.hash(
        userData.password,
        12
      );
    }

    // Update user
    await userRepository.update(
      userId,
      updateData
    );

    // Return updated user without password
    return await userRepository.findById(userId);
  }

  /**
   * UPDATE USER PASSWORD
   */
  async updatePassword(
    userId,
    currentPassword,
    newPassword
  ) {
    const user =
      await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Verify current password
    const isPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    // Prevent same password
    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      throw new Error(
        "New password must be different from the current password."
      );
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 12);

    await userRepository.update(userId, {
      password: hashedPassword,
    });

    return true;
  }

  /**
   * CHANGE USER STATUS
   */
  async changeStatus(userId, status) {
    const user =
      await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    await userRepository.update(userId, {
      status,
    });

    return await userRepository.findById(userId);
  }

  /**
   * DELETE USER
   */
  async deleteUser(userId) {
    const user =
      await userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    await userRepository.delete(userId);

    return true;
  }
}

export default new UserService();