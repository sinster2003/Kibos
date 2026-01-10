import { ErrorRequestHandler } from "express";
import CustomError from "../utils/customError.js";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if(error.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    if(error.name === "JsonWebTokenError") {
        return res.status(400).json({
            message: "Invalid access token"
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