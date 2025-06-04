import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { createError } from "../utils/helpers";
import { handleAsyncError } from "./errorHandling";
import { CustomError } from "../utils/dataTypes";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const isAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw createError("Not authenticated.", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      const error: CustomError = createError("JWT secret not defined");

      return next(error);
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret) as TokenPayload;

    if (!decodedToken.userId) {
      throw createError("Invalid token payload.", 401);
    }

    req.userId = decodedToken.userId;

    next();
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};
