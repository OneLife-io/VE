/**
 * Authentication Middleware
 */

import jwt from 'jsonwebtoken';
import config from '../../src/config/index.js';
import { USER_ROLES } from '../../src/constants/index.js';
import { unauthorized, forbidden } from './errorHandler.js';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw unauthorized('No token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, config.auth.jwtSecret);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(unauthorized('Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(unauthorized('Token expired'));
        } else {
            next(error);
        }
    }
};

/**
 * Check if user has required role
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(unauthorized('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(forbidden('Insufficient permissions'));
        }

        next();
    };
};

/**
 * Check if user is admin
 */
export const isAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Check if user is admin or manager
 */
export const isAdminOrManager = authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER);

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, config.auth.jwtSecret);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Continue without user info
        next();
    }
};
