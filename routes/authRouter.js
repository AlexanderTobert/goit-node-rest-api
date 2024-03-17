import express from "express";

import authController from "../controllers/authController.js"
import validateBody from "../helpers/validateBody.js";

import { userSignupSchema, userSigninSchema} from "../schemas/usersSchemas.js"

import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSignupSchema), authController.signup);

authRouter.post("/login", validateBody(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout)

export default authRouter;