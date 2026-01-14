import { Router } from "express";
import userControllers from "../controllers/user.js";

const skillsRouter = Router();

const { addSkill, deleteSkill } = userControllers;

skillsRouter.post("/", addSkill);
skillsRouter.delete("/:skillId", deleteSkill);

export default skillsRouter;