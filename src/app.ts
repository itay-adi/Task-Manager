import bodyParser from "body-parser";
import express, { Express } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import todoItemsRoutes from "./routes/todoItems";
import todoListsRoutes from "./routes/todoLists";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandling";

dotenv.config();

const app: Express = express();
const server = createServer(app);

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/item", todoItemsRoutes);
app.use("/list", todoListsRoutes);
app.use(errorHandler);

async function connectDB(): Promise<void> {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } else {
      throw new Error("MONGODB_URI is not defined in the environment.");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

async function startServer() {
  try {
    const port = 8080;

    await connectDB();
    server.listen(port, () => console.log("Server is running on port " + port));
  } catch (err) {
    console.log(err);
  }
}

startServer();
