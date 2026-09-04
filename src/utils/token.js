import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = ({ userId, roleId }) => {
  return jwt.sign(
    {
      userId,
      roleId,
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn,
    }
  );
};