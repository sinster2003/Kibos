import { Router } from "express";
import userControllers from "../controllers/user.js";
import upload from "../middleware/upload.js";
import isJobSeekerMiddleware from "../middleware/isJobSeekerMiddleware.js";

const profileRouter = Router();

const { getMyProfile, updateMyProfile, updateMyAvatar, updateMyResume } = userControllers;

const avatarMulterMiddleware = upload(["image/png", "image/jpeg"]);
const resumeMulterMiddleware = upload(["application/pdf"]);

profileRouter.get("/me", getMyProfile);
profileRouter.patch("/me", updateMyProfile);

profileRouter.post("/avatar", avatarMulterMiddleware.single("avatar"), updateMyAvatar);
profileRouter.post("/resume", isJobSeekerMiddleware, resumeMulterMiddleware.single("resume"), updateMyResume); // only jobseekers can add resume

export default profileRouter;