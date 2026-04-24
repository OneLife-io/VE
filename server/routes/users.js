/**
 * User Routes
 */

import express from 'express';
import { HTTP_STATUS } from '../../src/constants/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { asyncHandler, notFound } from '../middleware/errorHandler.js';

const router = express.Router();

// Mock database
const users = [];

/**
 * GET /api/v1/users
 * Get all users (admin only)
 */
router.get('/', authenticate, isAdmin, asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedUsers = users.slice(startIndex, endIndex).map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        createdAt: u.createdAt
    }));

    res.json({
        users: paginatedUsers,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: users.length,
            pages: Math.ceil(users.length / limit)
        }
    });
}));

/**
 * GET /api/v1/users/me
 * Get current user profile
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        throw notFound('User not found');
    }

    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt
        }
    });
}));

/**
 * GET /api/v1/users/:id
 * Get user by ID
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));

    if (!user) {
        throw notFound('User not found');
    }

    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt
        }
    });
}));

/**
 * PUT /api/v1/users/me
 * Update current user profile
 */
router.put('/me', authenticate, asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body;

    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        throw notFound('User not found');
    }

    if (firstName) users[userIndex].firstName = firstName;
    if (lastName) users[userIndex].lastName = lastName;

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: users[userIndex].id,
            email: users[userIndex].email,
            firstName: users[userIndex].firstName,
            lastName: users[userIndex].lastName,
            role: users[userIndex].role
        }
    });
}));

export default router;
