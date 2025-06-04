import { ValidationError } from "express-validator";
import { Request } from "express";

export type CustomError = Error & {
  statusCode?: number;
  data?: ValidationError[];
};

// export interface AuthenticatedRequest extends Request {
//   userId?: string;
// }