import authService from "./auth.service.js";

class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const result = await authService.getMe(userId);

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();