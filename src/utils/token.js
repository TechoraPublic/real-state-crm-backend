import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = ({ userId, roleId, companyId }) => {
  return jwt.sign(
    {
      userId,
      roleId,
      companyId,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
    }
  );
};