import {
  body,
  param,
} from "express-validator/lib/middlewares/validation-chain-builders";
import mongoose from "mongoose";

import { validationMessage } from "../utils/helpers";

const minLength = 3;
const maxLength = 30;
const fields = ["title", "description", "icon", "color"];

export const paramIdValidator = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID format.");
    }

    return true;
  }),
];

export const listBodyValidationArr = fields.map((field: string) =>
  body(field)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(validationMessage(minLength, maxLength))
);
