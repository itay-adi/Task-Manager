import { body } from "express-validator/lib/middlewares/validation-chain-builders";
import mongoose from "mongoose";

import { validationMessage } from "../utils/helpers";

const minLength = 3;
const maxLength = 20;

export const itemBodyValidationArr = [
  body("caption")
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(validationMessage(minLength, maxLength)),
];

export const listIdBodyValidatior = [
  body("listId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid list ID format.");
    }

    return true;
  }),
];
