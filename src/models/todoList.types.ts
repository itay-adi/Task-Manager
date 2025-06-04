import { Document, Types } from "mongoose";

export interface TodoListDTO extends Document {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  todoItems: Types.Array<Types.ObjectId>;
  totalItems: number;
  user: Types.ObjectId;
}
