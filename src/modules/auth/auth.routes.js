import { Router } from "express";

import authController from "./auth.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { loginSchema } from "./auth.validation.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * POST /api/auth/login
 *
 * Login user
 */
router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

/**
 * GET /api/auth/me
 *
 * Get currently authenticated user
 */
router.get(
  "/me",
  authMiddleware,
  authController.getMe
);

export default router;