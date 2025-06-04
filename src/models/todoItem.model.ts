import mongoose, { Schema } from "mongoose";
import { TodoItemDTO } from "./todoItem.types";

const TodoItemSchema: Schema = new Schema(
  {
    listId: { type: Schema.Types.ObjectId, ref: "TodoList", required: true },
    caption: { type: String, required: true },
    isCompleted: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TodoItemDTO>("TodoItem", TodoItemSchema);
