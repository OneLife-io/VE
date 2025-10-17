/**
 * Order Routes
 */

import express from 'express';
import { HTTP_STATUS, SUCCESS_MESSAGES, BUSINESS, CRITERIA } from '../../src/constants/index.js';
import { calculateFinalPrice } from '../../src/formulas/index.js';
import { authenticate, isAdminOrManager } from '../middleware/auth.js';
import { asyncHandler, notFound, badRequest } from '../middleware/errorHandler.js';

const router = express.Router();

// Mock database
const orders = [];
const carts = {}; // Reference to cart data

/**
 * GET /api/v1/orders
 * Get user's orders or all orders (admin)
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';

    let userOrders = isAdmin ? orders : orders.filter(o => o.userId === userId);

    res.json({
        orders: userOrders,
        count: userOrders.length
    });
}));

/**
 * GET /api/v1/orders/:id
 * Get order by ID
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
    const order = orders.find(o => o.id === Number(req.params.id));

    if (!order) {
        throw notFound('Order not found');
    }

    // Check authorization
    if (order.userId !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
        throw badRequest('Unauthorized to view this order');
    }

    res.json({ order });
}));

/**
 * POST /api/v1/orders
 * Create new order from cart
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, discountCode = '' } = req.body;

    // Validation
    if (!shippingAddress || !paymentMethod) {
        throw badRequest('Missing shipping address or payment method');
    }

    // Get cart
    const cart = carts[userId];
    if (!cart || cart.items.length === 0) {
        throw badRequest('Cart is empty');
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    // Apply discount (simple example)
    if (discountCode === 'SAVE10') {
        discount = subtotal * 0.1; // 10% off
    }

    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * BUSINESS.TAX_RATE;
    const total = afterDiscount + tax;

    // Create order
    const order = {
        id: orders.length + 1,
        userId,
        items: [...cart.items],
        shippingAddress,
        paymentMethod,
        discountCode,
        status: CRITERIA.FILTER.STATUS.PENDING,
        pricing: {
            subtotal: subtotal.toFixed(2),
            discount: discount.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    orders.push(order);

    // Clear cart
    carts[userId] = { items: [] };

    res.status(HTTP_STATUS.CREATED).json({
        message: 'Order placed successfully',
        order
    });
}));

/**
 * PUT /api/v1/orders/:id/status
 * Update order status (admin/manager only)
 */
router.put('/:id/status', authenticate, isAdminOrManager, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === Number(req.params.id));

    if (orderIndex === -1) {
        throw notFound('Order not found');
    }

    if (!status) {
        throw badRequest('Status is required');
    }

    // Update status
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    res.json({
        message: SUCCESS_MESSAGES.UPDATED,
        order: orders[orderIndex]
    });
}));

/**
 * DELETE /api/v1/orders/:id
 * Cancel order
 */
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === Number(req.params.id));

    if (orderIndex === -1) {
        throw notFound('Order not found');
    }

    const order = orders[orderIndex];

    // Check authorization
    if (order.userId !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
        throw badRequest('Unauthorized to cancel this order');
    }

    // Can only cancel pending orders
    if (order.status !== CRITERIA.FILTER.STATUS.PENDING) {
        throw badRequest('Can only cancel pending orders');
    }

    orders[orderIndex].status = CRITERIA.FILTER.STATUS.CANCELLED;
    orders[orderIndex].updatedAt = new Date();

    res.json({
        message: 'Order cancelled successfully',
        order: orders[orderIndex]
    });
}));

export default router;
