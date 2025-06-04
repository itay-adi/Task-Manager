import { Router } from "express";

import {
  getTodoListById,
  createNewList,
  deleteList,
  editList,
} from "../controllers/lists";
import {
  paramIdValidator,
  listBodyValidationArr,
} from "../validators/listValidators";
import { handleValidationErrors } from "../middlewares/validation";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

const validateListBody = [...listBodyValidationArr, handleValidationErrors];
const validateParamId = [...paramIdValidator, handleValidationErrors];

router.route("/").post(isAuth, validateListBody, createNewList);

router
  .route("/:id")
  .get(isAuth, validateParamId, getTodoListById)
  .put(isAuth, validateParamId, editList)
  .delete(isAuth, validateParamId, deleteList);

export default router;
