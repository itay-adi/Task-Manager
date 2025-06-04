import { Request, Response, NextFunction } from "express";

import TodoList from "../models/todoList.model";
import User from "../models/user.model";
import { createError } from "../utils/helpers";
import { CustomError } from "../utils/dataTypes";
import { handleAsyncError } from "../middlewares/errorHandling";

interface PathParams {
  id?: string;
}

interface CreateListBody {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface QueryParams {
  asc?: string;
  page?: string;
  itemsPerPage?: string;
}

export const getTodoListById = async (
  req: Request<PathParams, {}, {}, QueryParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentPage: number = parseInt(req.query.page ?? "1");
  const itemsPerPage: number = parseInt(req.query.itemsPerPage ?? "5");

  try {
    const todoListId: string = req.params.id ?? "";
    const todoList = await TodoList.findById(todoListId).populate({
      path: "todoItems",
      options: {
        sort: { createdAt: req.query.asc === "true" ? 1 : -1 },
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      },
    });

    if (!todoList) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== todoList.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    res.status(200).json({ message: "todoList fetched.", todoList });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

export const createNewList = async (
  req: Request<{}, {}, CreateListBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const todoList = new TodoList({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
    color: req.body.color,
    todoItems: [],
    totalItems: 0,
    user: req.userId,
  });

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error: CustomError = createError("Error fetching the user.", 500);

      return next(error);
    }

    user.todoLists.push(todoList);
    user.totalLists++;

    const [result] = await Promise.all([todoList.save(), user.save()]);

    res.status(201).json({
      message: "List created successfully!",
      list: result,
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

export const deleteList = async (
  req: Request<PathParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todoList = await TodoList.findById(req.params.id);

    if (!todoList) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== todoList.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error: CustomError = createError("User was not found.", 404);

      return next(error);
    }

    user.totalLists--;
    user.todoLists.pull(req.params.id);

    await Promise.all([user.save(), TodoList.findByIdAndDelete(req.params.id)]);

    res.status(200).json({
      message: `The list '${todoList.title}' deleted!`,
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

export const editList = async (
  req: Request<PathParams, {}, CreateListBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await TodoList.findById(req.params.id);

    if (!list) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== list.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    list.title = req.body.title ?? list.title;
    list.description = req.body.description ?? list.description;
    list.icon = req.body.icon ?? list.icon;
    list.color = req.body.color ?? list.color;

    const result = await list.save();

    res.status(200).json({
      message: "List updated!",
      list: result,
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};
