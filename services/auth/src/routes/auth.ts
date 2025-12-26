import { Router } from "express";
import authControllers from "../controllers/auth.js";

const authRouter = Router();

const { registerUser, loginUser } = authControllers;

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;