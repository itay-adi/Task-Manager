import mongoose, { Schema } from "mongoose";
import { TodoListDTO } from "./todoList.types";

const TodoListSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    totalItems: { type: Number, required: true },
    todoItems: {
      type: [{ type: Schema.Types.ObjectId, ref: "TodoItem" }],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TodoListDTO>("TodoList", TodoListSchema);
