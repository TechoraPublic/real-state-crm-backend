import jwt from "jsonwebtoken";
import env from "../config/env.js";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    // 2. Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    // 4. Verify JWT
    const decoded = jwt.verify(token, env.jwt.secret);

    // 5. Validate JWT payload
    if (!decoded.userId || !decoded.roleId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // 6. Attach authenticated user information
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };

    // 7. Continue request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authMiddleware;