import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "../config/index.js";
import { JwtPayload } from "./types.js";
import CustomError from "./customError.js";
import { Request } from "express";

export const extractAccessToken = (req: Request) => {
    // the authorization header implementation is for non browser clients (future scoped)
    const authHeader = req.headers.authorization;
    if(authHeader?.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return req.cookies.access_token ?? null;
}

const verifyJwt = (accessToken: string) => {
    const jwtPayload = jwt.verify(
        accessToken,
        JWT_PUBLIC_KEY!,
        {
            algorithms: ["RS256"],
            issuer: "auth-service",
            audience: "internal-services",
        }
    ) as JwtPayload;

    if(!jwtPayload.sub || !jwtPayload.role) {
        throw new CustomError(401, "Invalid JWT payload");
    }

    return jwtPayload;
}

export default verifyJwt;