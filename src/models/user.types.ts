import { Document, Types } from "mongoose";

export interface UserDTO extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  todoLists: Types.Array<Types.ObjectId>;
  totalLists: number;
}
