import { NextFunction, Request, Response } from "express";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "../db/schema.js";

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

type User = InferSelectModel<typeof users>;

type NewUser = InferInsertModel<typeof users>;

export {
    ControllerType,
    User,
    NewUser
}