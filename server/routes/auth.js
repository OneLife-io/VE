/**
 * Authentication Routes
 */

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../src/config/index.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, VALIDATION } from '../../src/constants/index.js';
import { asyncHandler, badRequest, unauthorized } from '../middleware/errorHandler.js';

const router = express.Router();

// Mock database (replace with actual database)
const users = [];

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
        throw badRequest('All fields are required', ['email', 'password', 'firstName', 'lastName']);
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
        throw badRequest('Invalid email format');
    }

    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        throw badRequest(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`);
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
        throw badRequest('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.auth.bcryptRounds);

    // Create user
    const user = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date()
    };

    users.push(user);

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiration }
    );

    res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.CREATED,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token
    });
}));

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        throw badRequest('Email and password are required');
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        throw unauthorized('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw unauthorized('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiration }
    );

    res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token
    });
}));

/**
 * POST /api/v1/auth/logout
 * Logout user (client should remove token)
 */
router.post('/logout', (req, res) => {
    res.json({
        message: 'Logout successful'
    });
});

export default router;
