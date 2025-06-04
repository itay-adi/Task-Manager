import { Router } from "express";
import { login, signUp } from "../controllers/auth";

import { handleValidationErrors } from "../middlewares/validation";
import { signUpValidator, loginValidator } from "../validators/authValidator";

const router = Router();

router.post("/signup", signUpValidator, handleValidationErrors, signUp);

router.post("/login", loginValidator, handleValidationErrors, login);

export default router;
