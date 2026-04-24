/**
 * Error Handling Middleware
 */

import { HTTP_STATUS, ERROR_MESSAGES } from '../../src/constants/index.js';
import { logger } from './logger.js';

/**
 * Custom Error class for API errors
 */
export class APIError extends Error {
    constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || ERROR_MESSAGES.SERVER;
    let errors = err.errors || [];

    // Log error
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION;
        errors = Object.values(err.details || {}).map(detail => detail.message);
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Token expired';
    }

    // Don't leak error details in production
    const response = {
        error: {
            message,
            statusCode,
            ...(errors.length > 0 && { errors }),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    };

    res.status(statusCode).json(response);
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Not Found error
 */
export const notFound = (message = 'Resource not found') => {
    return new APIError(message, HTTP_STATUS.NOT_FOUND);
};

/**
 * 400 Bad Request error
 */
export const badRequest = (message = 'Bad request', errors = []) => {
    return new APIError(message, HTTP_STATUS.BAD_REQUEST, errors);
};

/**
 * 401 Unauthorized error
 */
export const unauthorized = (message = 'Unauthorized') => {
    return new APIError(message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * 403 Forbidden error
 */
export const forbidden = (message = 'Forbidden') => {
    return new APIError(message, HTTP_STATUS.FORBIDDEN);
};
