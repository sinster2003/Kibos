import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "../config/index.js";
import { JwtPayload } from "./types.js";

const verifyJwt = (accessToken: string): JwtPayload => {
    return jwt.verify(
        accessToken,
        JWT_PUBLIC_KEY!,
        {
            algorithms: ["RS256"],
            issuer: "auth-service",
            audience: "internal-services",
        }
    ) as JwtPayload;
}

export default verifyJwt;