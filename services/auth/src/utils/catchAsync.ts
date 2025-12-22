import { NextFunction, Request, RequestHandler, Response } from "express";
import { ControllerType } from "./types.js";

const catchAsync = (controller: ControllerType): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        }
        catch(error) {
            console.log(error);
            next(error); // the control reaches the error handling middleware
        }
    }
}

export default catchAsync;