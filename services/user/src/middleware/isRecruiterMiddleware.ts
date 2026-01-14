import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";

const isRecruiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user;

    if(!currentUser || !currentUser.userId || !currentUser.role) {
        throw new CustomError(401, "Authentication required. Please log in.");
    }

    if(currentUser.role !== "recruiter") {
        throw new CustomError(403, "Forbidden: recruiter access only.");
    }

    next();
}

export default catchAsync(isRecruiterMiddleware);