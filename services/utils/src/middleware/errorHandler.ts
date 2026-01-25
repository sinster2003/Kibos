import { ErrorRequestHandler } from "express";
import CustomError from "../lib/customError.js";
import { MulterError } from "multer";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {    
    if(error instanceof MulterError) {
        return res.status(400).json({
            message: error.message
        });
    }

    if(error instanceof CustomError) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    return res.status(500).json({
        message: "Internal server error"
    });
}

export default errorHandler;