import { JWT_PRIVATE_KEY } from "../config/index.js"
import jwt from "jsonwebtoken";
import { JwtPayload } from "./types.js";

const generateJwt = (payload: JwtPayload) => {
    const token = jwt.sign(
        payload,
        JWT_PRIVATE_KEY!,
        {
            algorithm: "RS256",
            issuer: "auth-service",
            audience: "internal-services",
            expiresIn: "15m"
        }
    );

    return token;
}

export default generateJwt;