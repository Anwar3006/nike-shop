import { logger } from "../utils/logger.js";
import { NODE_ENV } from "../config/default.js";
import AppError from "./AppError.js";
//nssgc
export const NotFound = (req, _, next) => {
    const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(error);
};
export const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        stack: err.stack,
        error: err,
        message: err.message,
    });
};
export const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    logger.error("Error discovered: " + err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
};
//middleware
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else {
        sendErrorProd(err, res);
    }
};
export const catchAsync = (fn) => {
    return (req, res, next) => {
        try {
            fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
