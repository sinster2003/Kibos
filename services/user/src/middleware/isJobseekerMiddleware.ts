import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError.js";
import catchAsync from "../utils/catchAsync.js";

const isJobseekerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;

    if(!currentUser || !currentUser.userId || !currentUser.role) {
        throw new CustomError(401, "Authentication required. Please log in.");
    }

    if(currentUser.role !== "jobseeker") {
        throw new CustomError(403, "Forbidden: jobseeker access only.");
    }

    next();
}

export default catchAsync(isJobseekerMiddleware);