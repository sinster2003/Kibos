import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if(error.name === "CastError") {
        return res.status(400).json({ message: "Malformed Id" });
    }

    res.status(500).json({
        message: "Something went wrong"
    });
}

export default errorHandler;