import { Router } from "express";
import userControllers from "../controllers/user.js";

const profileRouter = Router();

const { getMyProfile, updateMyProfile } = userControllers;

profileRouter.get("/", getMyProfile);
profileRouter.patch("/", updateMyProfile);

export default profileRouter;