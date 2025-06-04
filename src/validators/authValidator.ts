import { body } from "express-validator";

import User from "../models/user.model";
import { validationMessage } from "../utils/helpers";

const nameMinLength = 3;
const passwordMinLength = 5;
const maxLength = 20;

export const signUpValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });

      if (userDoc) {
        return Promise.reject("Email is already in use");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: passwordMinLength, max: maxLength })
    .withMessage(validationMessage(passwordMinLength, maxLength)),
  body("name")
    .trim()
    .isLength({ min: nameMinLength, max: maxLength })
    .withMessage(validationMessage(nameMinLength, maxLength)),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
]

