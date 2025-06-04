import { Document, Types } from "mongoose";
import { TodoListDTO } from "./todoList.types";

export interface TodoItemDTO extends Document {
  _id: string;
  listId: Types.ObjectId;
  caption: string;
  isCompleted: boolean;
}

export interface PopulatedTodoItemDTO extends Omit<TodoItemDTO, "listId"> {
  listId: Pick<TodoListDTO, "_id" | "user">;
}