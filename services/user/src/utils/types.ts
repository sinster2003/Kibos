import { NextFunction, Request, Response } from "express";

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export {
    ControllerType
}