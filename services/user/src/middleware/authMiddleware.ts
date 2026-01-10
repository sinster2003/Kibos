import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import verifyJwt, { extractAccessToken } from "../utils/verifyJwt.js";
import { AuthenticatedUser } from "../utils/types.js";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = extractAccessToken(req);

    if (!accessToken) {
        throw new CustomError(401, "User unauthenticated. Please login.");
    }

    const jwtPayload = verifyJwt(accessToken);

    req.user = {
        userId: jwtPayload.sub,
        role: jwtPayload.role
    }

    next();
}

export default catchAsync(authMiddleware);