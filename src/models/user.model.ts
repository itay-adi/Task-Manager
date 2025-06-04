import mongoose, { Schema } from "mongoose";
import { UserDTO } from "./user.types";

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    todoLists: {
      type: [{ type: Schema.Types.ObjectId, ref: "TodoList" }],
      default: [],
    },
    totalLists: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDTO>("User", UserSchema);
