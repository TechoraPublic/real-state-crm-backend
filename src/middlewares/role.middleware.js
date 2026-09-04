import Role from "../modules/roles/roles.model.js";

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // ---------------------------------------------
      // 1. Authentication check
      // ---------------------------------------------
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      // ---------------------------------------------
      // 2. Get role ID from JWT
      // ---------------------------------------------
      const { roleId } = req.user;

      if (!roleId) {
        return res.status(401).json({
          success: false,
          message: "User role not found.",
        });
      }

      // ---------------------------------------------
      // 3. Find role
      // ---------------------------------------------
      const role = await Role.findByPk(roleId);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: "Invalid user role.",
        });
      }

      // ---------------------------------------------
      // 4. Check role status
      // ---------------------------------------------
      if (role.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Your role is inactive.",
        });
      }

      // ---------------------------------------------
      // 5. Normalize role key
      // ---------------------------------------------
      const userRole = String(role.key)
        .trim()
        .toUpperCase();

      const normalizedAllowedRoles = allowedRoles.map((role) =>
        String(role)
          .trim()
          .toUpperCase()
      );

      // ---------------------------------------------
      // 6. Check permission
      // ---------------------------------------------
      if (!normalizedAllowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
      }

      // ---------------------------------------------
      // 7. Attach role information
      // ---------------------------------------------
      req.user.roleId = role.id;
      req.user.roleKey = role.key;
      req.user.roleName = role.name;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;