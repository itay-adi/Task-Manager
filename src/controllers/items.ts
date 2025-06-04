import { Request, Response, NextFunction } from "express";

import TodoItem from "../models/todoItem.model";
import TodoList from "../models/todoList.model";
import { createError, listHasItem } from "../utils/helpers";
import { CustomError } from "../utils/dataTypes";
import { handleAsyncError } from "../middlewares/errorHandling";
import { PopulatedTodoItemDTO } from "../models/todoItem.types";

interface PathParams {
  id: string;
}

export const getTodoItemById = async (
  req: Request<PathParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todoItem = await TodoItem.findById(req.params.id).populate("listId", "_id user") as unknown as PopulatedTodoItemDTO;

    if (!todoItem) {
      const error = createError("Item wasn't found.", 404);

      return next(error);
    }

    if (todoItem.listId.user.toString() !== req.userId) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    res.status(200).json({ message: "todoItem fetched.", todoItem });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

interface CreateItemBody {
  listId: string;
  caption: string;
}

export const addTodoItem = async (
  req: Request<{}, {}, CreateItemBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listId: string = req.body.listId;
    const list = await TodoList.findById(listId);

    if (!list) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== list.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    const todoItem = new TodoItem({
      listId: list._id,
      caption: req.body.caption,
      isCompleted: false,
    });

    list.todoItems.push(todoItem);
    list.totalItems++

    const [result] = await Promise.all([todoItem.save(), list.save()]);

    res.status(201).json({
      message: "Item created successfully!",
      todoItem: result,
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

interface DeleteItemBody {
  listId: string;
}

export const deleteTodoItem = async (
  req: Request<PathParams, {}, DeleteItemBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await TodoList.findById(req.body.listId);

    if (!list) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== list.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    const itemId: string = req.params.id;
    const itemInList: boolean = listHasItem(list, itemId);

    if (!itemInList) {
      const error: CustomError = createError(
        "List doesnt hold this item.",
        404
      );

      return next(error);
    }

    list.todoItems.pull(itemId);
    list.totalItems--
    await Promise.all([TodoItem.findByIdAndDelete(itemId), list.save()]);

    res.status(200).json({
      message: "Item deleted!",
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};

interface EditItemBody {
  listId: string;
  isCompleted?: boolean;
  caption?: string;
}

export const editTodoItem = async (
  req: Request<PathParams, {}, EditItemBody, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await TodoList.findById(req.body.listId);

    if (!list) {
      const error: CustomError = createError("List was not found.", 404);

      return next(error);
    }

    if (req.userId !== list.user._id.toString()) {
      const error: CustomError = createError("Unauthorized", 401);

      return next(error);
    }

    const itemId: string = req.params.id;
    const itemInList: boolean = listHasItem(list, itemId);

    if (!itemInList) {
      const error: CustomError = createError(
        "List doesnt hold this item.",
        404
      );

      return next(error);
    }

    const todoItem = await TodoItem.findById(itemId);

    if (!todoItem) {
      const error: CustomError = createError("Item was not found.", 404);

      return next(error);
    }

    todoItem.caption = req.body.caption ?? todoItem.caption;
    todoItem.isCompleted = req.body.isCompleted ?? todoItem.isCompleted;

    const result = await todoItem.save();

    res.status(200).json({
      message: "Todo Item updated!",
      item: result,
    });
  } catch (err: any) {
    handleAsyncError(err, next);
  }
};
