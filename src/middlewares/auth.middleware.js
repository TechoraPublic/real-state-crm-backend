import jwt from "jsonwebtoken";
import env from "../config/env.js";

const authMiddleware = (req, res, next) => {
  try {
    // --------------------------------------------------
    // 1. Get Authorization Header
    // --------------------------------------------------
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    // --------------------------------------------------
    // 2. Validate Bearer Format
    // --------------------------------------------------
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use Bearer token.",
      });
    }

    // --------------------------------------------------
    // 3. Extract Token
    // --------------------------------------------------
    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    // --------------------------------------------------
    // 4. Verify JWT
    // --------------------------------------------------
    const decoded = jwt.verify(
      token,
      env.jwt.secret
    );

    // --------------------------------------------------
    // 5. Validate JWT Payload
    //
    // JWT must contain:
    // userId
    // roleId
    // companyId
    // --------------------------------------------------

    if (
      decoded.userId === undefined ||
      decoded.userId === null
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. User ID is missing.",
      });
    }

    if (
      decoded.roleId === undefined ||
      decoded.roleId === null
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Role ID is missing.",
      });
    }

    if (
      decoded.companyId === undefined ||
      decoded.companyId === null
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Company ID is missing.",
      });
    }

    // --------------------------------------------------
    // 6. Attach Authenticated User
    // --------------------------------------------------
    req.user = {
      userId: Number(decoded.userId),
      roleId: Number(decoded.roleId),
      companyId: Number(decoded.companyId),
    };

    // --------------------------------------------------
    // 7. Continue Request
    // --------------------------------------------------
    next();

  } catch (error) {

    // --------------------------------------------------
    // Token Expired
    // --------------------------------------------------
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired. Please login again.",
      });
    }

    // --------------------------------------------------
    // Invalid JWT
    // --------------------------------------------------
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // --------------------------------------------------
    // JWT Not Active Yet
    // --------------------------------------------------
    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token is not active yet.",
      });
    }

    // --------------------------------------------------
    // Other Errors
    // --------------------------------------------------
    next(error);
  }
};

export default authMiddleware;