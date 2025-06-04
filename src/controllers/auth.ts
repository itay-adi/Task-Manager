import { Request, NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { createError } from "../utils/helpers";
import { CustomError } from "../utils/dataTypes";
import { handleAsyncError } from "../middlewares/errorHandling";

const SALT = 12;

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export const signUp = async (
  req: Request<{}, {}, SignUpBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hashedPW: string = await bcrypt.hash(req.body.password, SALT);
    const user = new User({
      name: req.body.name,
      password: hashedPW,
      email: req.body.email,
      totalLists: 0,
    });

    const result = await user.save();

    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    handleAsyncError(err, next);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const login = async (
  req: Request<{}, {}, LoginBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loadedUser = await User.findOne({ email: req.body.email });

    if (
      !loadedUser ||
      !(await bcrypt.compare(req.body.password, loadedUser.password))
    ) {
      const error: CustomError = createError("Wrong email or password", 401);

      return next(error);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      const error: CustomError = createError("JWT secret not defined");

      return next(error);
    }

    const token: string = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: loadedUser._id,
        name: loadedUser.name,
        email: loadedUser.email,
      },
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};
