import { Router } from "express";
import userControllers from "../controllers/user.js";
import isJobSeekerMiddleware from "../middleware/isJobseekerMiddleware.js";

const profileRouter = Router();

const { getMyProfile, updateMyProfile, updateMyAvatar, updateMyResume } = userControllers;

profileRouter.get("/me", getMyProfile);
profileRouter.patch("/me", updateMyProfile);

profileRouter.post("/avatar", updateMyAvatar);
profileRouter.post("/resume", isJobSeekerMiddleware, updateMyResume); // only jobseekers can add resume

export default profileRouter;