import { Router } from "express";
import authControllers from "../controllers/auth.js";

const authRouter = Router();

const { registerUser, loginUser, refreshTokenController, logoutController } = authControllers;

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logoutController);

export default authRouter;