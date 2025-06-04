import { ValidationError } from "express-validator";

import { CustomError } from "./dataTypes";

export const validationMessage = (min: number, max: number) =>
  `Value should be between ${min} to ${max} chars`;

export const createError = (
  message: string,
  statusCode?: number,
  data?: ValidationError[]
): CustomError => {
  const error: CustomError = new Error(message);

  error.statusCode = statusCode;
  error.data = data;

  return error;
};

export const listHasItem = (list: any, itemId: string): boolean =>
  list.todoItems.some((item: any) => item._id?.toJSON() === itemId);
