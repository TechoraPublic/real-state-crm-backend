import userService from "./user.service.js";

class UserController {
  /**
   * CREATE USER
   * POST /api/users
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);

      return res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET ALL USERS
   * GET /api/users
   */
  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET USER BY ID
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.validatedParams || req.params;

      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "User fetched successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE USER
   * PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.validatedParams || req.params;

      const user = await userService.updateUser(
        id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE PASSWORD
   * PATCH /api/users/:id/password
   */
  async updatePassword(req, res, next) {
    try {
      const { id } = req.validatedParams || req.params;

      const {
        currentPassword,
        newPassword,
      } = req.body;

      await userService.updatePassword(
        id,
        currentPassword,
        newPassword
      );

      return res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CHANGE USER STATUS
   * PATCH /api/users/:id/status
   */
  async changeStatus(req, res, next) {
    try {
      const { id } = req.validatedParams || req.params;

      const { status } = req.body;

      const user = await userService.changeStatus(
        id,
        status
      );

      return res.status(200).json({
        success: true,
        message: "User status updated successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE USER
   * DELETE /api/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.validatedParams || req.params;

      await userService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();