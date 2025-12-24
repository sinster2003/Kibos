import { NextFunction, Request, RequestHandler, Response } from "express";
import { ControllerType } from "../types.js";

const catchAsync = (controller: ControllerType): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        }
        catch(error) {
            console.log(error);
            next(error);
        }
    }

export default catchAsync;