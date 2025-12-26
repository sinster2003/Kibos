import { NextFunction, Request, Response } from "express";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { refreshTokens, authUsers as users } from "../db/schema.js";

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

type User = InferSelectModel<typeof users>;

type NewUser = InferInsertModel<typeof users>;

type RefreshToken = InferInsertModel<typeof refreshTokens>;

interface JwtPayload {
    sub: string;
    role: string;
}

interface ExistingUser extends Omit<User, "userId" | "createdAt" | "password"> {
    user_id: string;
    created_at: Date;
}

export {
    ControllerType,
    NewUser,
    JwtPayload,
    RefreshToken,
    ExistingUser
}