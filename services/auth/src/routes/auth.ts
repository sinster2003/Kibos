import { Router } from "express";
import authControllers from "../controllers/auth.js";

const authRouter = Router();

const { registerUser } = authControllers;

authRouter.post("/register", registerUser);

export default authRouter;