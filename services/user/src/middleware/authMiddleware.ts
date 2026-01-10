import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import verifyJwt from "../utils/verifyJwt.js";

declare global {
    namespace Express {
        interface Request {
            user: string;
            role: string;
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.cookies;

    if (!access_token) {
        throw new CustomError(401, "User unauthenticated. Please login.");
    }

    const jwtPayload = verifyJwt(access_token);

    if (!jwtPayload) {
        throw new CustomError(400, "Access token invalid. Please login.");
    }

    req.user = jwtPayload.sub;
    req.role = jwtPayload.role;

    next();
}

export default catchAsync(authMiddleware);