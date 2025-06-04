import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validator";

import { CustomError } from "../utils/dataTypes";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(error);

  const statusCode: number = error.statusCode || 500;
  const data: ValidationError[] | undefined = error.data;

  res
    .status(statusCode)
    .json({ message: `${error.name}: ${error.message}`, data: data });
};

export const handleAsyncError = (err: any, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  next(err);
};
