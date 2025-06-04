import { Router } from "express";

import {
  getTodoItemById,
  addTodoItem,
  deleteTodoItem,
  editTodoItem,
} from "../controllers/items";
import {
  itemBodyValidationArr,
  listIdBodyValidatior,
} from "../validators/itemValidators";
import { paramIdValidator } from "../validators/listValidators";
import { handleValidationErrors } from "../middlewares/validation";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

const validateCreate = [
  ...itemBodyValidationArr,
  ...listIdBodyValidatior,
  handleValidationErrors,
];

const validateWithId = [...paramIdValidator, handleValidationErrors];
const validateWithIdAndBody = [
  ...paramIdValidator,
  ...listIdBodyValidatior,
  handleValidationErrors,
];

router.route("/").post(isAuth, validateCreate, addTodoItem);

router
  .route("/:id")
  .get(isAuth, validateWithId, getTodoItemById)
  .delete(isAuth, validateWithIdAndBody, deleteTodoItem)
  .put(isAuth, validateWithIdAndBody, editTodoItem);

export default router;
