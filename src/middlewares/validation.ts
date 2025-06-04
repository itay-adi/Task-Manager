import { RequestHandler } from "express";
import { validationResult } from "express-validator/lib/validation-result";
import { createError } from "../utils/helpers";

export const handleValidationErrors: RequestHandler<any> = (
  req,
  _res,
  next
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      createError(
        "Validation failed. Entered data is incorrect",
        422,
        errors.array()
      )
    );
  }

  next();
};
