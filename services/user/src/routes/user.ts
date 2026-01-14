import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import isRecruiterMiddleware from "../middleware/isRecruiterMiddleware.js";
import profileRouter from "./profile.js";
import skillsRouter from "./skills.js";
import isJobSeekerMiddleware from "../middleware/isJobSeekerMiddleware.js";
import userControllers from "../controllers/user.js";

const userRouter = Router();

const { getUserById } = userControllers;

userRouter.use("/profile/me", authMiddleware, profileRouter);

// jobseeker accessed routes
userRouter.use("/skills", authMiddleware, isJobSeekerMiddleware, skillsRouter);

// recruiter accessed routes
// current implementation user profiles can be viewed only by recruiters
userRouter.get("/users/:userId", authMiddleware, isRecruiterMiddleware, getUserById);

export default userRouter;