import { Router } from "express";

import userController from "./user.controller.js";

import {
  createUserSchema,
  updateUserSchema,
  updatePasswordSchema,
  changeStatusSchema,
  userIdParamSchema,
} from "./user.validation.js";

import { validate } from "../../middlewares/validation.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
|
| All user management routes require authentication.
|
| SUPER_ADMIN:
| - Full user management
|
| ADMIN:
| - User management
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
| POST /api/users
|--------------------------------------------------------------------------
*/

router.post(
  "/create-user",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(createUserSchema),
  userController.createUser
);


/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
| GET /api/users
|--------------------------------------------------------------------------
*/

router.get(
  "/get-all-users",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  userController.getUsers
);


/*
|--------------------------------------------------------------------------
| GET USER BY ID
|--------------------------------------------------------------------------
| GET /api/users/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/get-user-by-id/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(userIdParamSchema, "params"),
  userController.getUserById
);


/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
| PUT /api/users/:id
|--------------------------------------------------------------------------
*/

router.put(
  "/update-user/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser
);


/*
|--------------------------------------------------------------------------
| UPDATE USER PASSWORD
|--------------------------------------------------------------------------
| PATCH /api/users/:id/password
|--------------------------------------------------------------------------
*/

router.patch(
  "/update-password/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(userIdParamSchema, "params"),
  validate(updatePasswordSchema),
  userController.updatePassword
);


/*
|--------------------------------------------------------------------------
| CHANGE USER STATUS
|--------------------------------------------------------------------------
| PATCH /api/users/:id/status
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-status/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(userIdParamSchema, "params"),
  validate(changeStatusSchema),
  userController.changeStatus
);


/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
| DELETE /api/users/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/delete-user/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  validate(userIdParamSchema, "params"),
  userController.deleteUser
);

export default router;