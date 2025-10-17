/**
 * Shopping Cart Routes
 */

import express from 'express';
import { HTTP_STATUS, SUCCESS_MESSAGES, BUSINESS } from '../../src/constants/index.js';
import { calculatePriceWithTax } from '../../src/formulas/index.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler, notFound, badRequest } from '../middleware/errorHandler.js';

const router = express.Router();

// Mock database
const carts = {}; // { userId: { items: [] } }
const products = [
    { id: 1, name: 'Laptop Pro 15', price: 1299.99, stock: 50 },
    { id: 2, name: 'Wireless Mouse', price: 29.99, stock: 200 }
];

/**
 * GET /api/v1/cart
 * Get current user's cart
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cart = carts[userId] || { items: [] };

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * BUSINESS.TAX_RATE;
    const total = subtotal + tax;

    res.json({
        cart: {
            items: cart.items,
            summary: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
            }
        }
    });
}));

/**
 * POST /api/v1/cart/items
 * Add item to cart
 */
router.post('/items', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
        throw badRequest('Invalid product ID or quantity');
    }

    // Find product
    const product = products.find(p => p.id === Number(productId));
    if (!product) {
        throw notFound('Product not found');
    }

    // Check stock
    if (product.stock < quantity) {
        throw badRequest('Insufficient stock');
    }

    // Initialize cart if needed
    if (!carts[userId]) {
        carts[userId] = { items: [] };
    }

    // Check if item already in cart
    const existingItemIndex = carts[userId].items.findIndex(item => item.productId === Number(productId));

    if (existingItemIndex >= 0) {
        // Update quantity
        carts[userId].items[existingItemIndex].quantity += Number(quantity);
    } else {
        // Add new item
        carts[userId].items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Number(quantity)
        });
    }

    res.status(HTTP_STATUS.CREATED).json({
        message: 'Item added to cart',
        cart: carts[userId]
    });
}));

/**
 * PUT /api/v1/cart/items/:productId
 * Update item quantity in cart
 */
router.put('/items/:productId', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!carts[userId]) {
        throw notFound('Cart is empty');
    }

    const itemIndex = carts[userId].items.findIndex(item => item.productId === Number(productId));

    if (itemIndex === -1) {
        throw notFound('Item not in cart');
    }

    if (quantity < 1) {
        throw badRequest('Quantity must be at least 1');
    }

    // Update quantity
    carts[userId].items[itemIndex].quantity = Number(quantity);

    res.json({
        message: SUCCESS_MESSAGES.UPDATED,
        cart: carts[userId]
    });
}));

/**
 * DELETE /api/v1/cart/items/:productId
 * Remove item from cart
 */
router.delete('/items/:productId', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!carts[userId]) {
        throw notFound('Cart is empty');
    }

    const itemIndex = carts[userId].items.findIndex(item => item.productId === Number(productId));

    if (itemIndex === -1) {
        throw notFound('Item not in cart');
    }

    // Remove item
    carts[userId].items.splice(itemIndex, 1);

    res.json({
        message: 'Item removed from cart',
        cart: carts[userId]
    });
}));

/**
 * DELETE /api/v1/cart
 * Clear cart
 */
router.delete('/', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;

    carts[userId] = { items: [] };

    res.json({
        message: 'Cart cleared',
        cart: carts[userId]
    });
}));

export default router;
