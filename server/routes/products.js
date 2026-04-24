/**
 * Product Routes
 */

import express from 'express';
import { HTTP_STATUS, CRITERIA, SUCCESS_MESSAGES } from '../../src/constants/index.js';
import { authenticate, isAdminOrManager, optionalAuth } from '../middleware/auth.js';
import { asyncHandler, notFound, badRequest } from '../middleware/errorHandler.js';

const router = express.Router();

// Mock database
const products = [
    {
        id: 1,
        name: 'Laptop Pro 15',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        category: 'electronics',
        status: 'active',
        stock: 50,
        imageUrl: '/images/laptop.jpg',
        createdAt: new Date()
    },
    {
        id: 2,
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        category: 'electronics',
        status: 'active',
        stock: 200,
        imageUrl: '/images/mouse.jpg',
        createdAt: new Date()
    }
];

/**
 * GET /api/v1/products
 * Get all products with search, filter, and sort
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = CRITERIA.SEARCH.DEFAULT_LIMIT,
        search = '',
        category = '',
        status = CRITERIA.FILTER.STATUS.ACTIVE,
        sortBy = CRITERIA.SORT.NAME_ASC,
        minPrice = 0,
        maxPrice = Number.MAX_VALUE
    } = req.query;

    let filteredProducts = [...products];

    // Search filter
    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }

    // Category filter
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Status filter
    if (status) {
        filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    // Price range filter
    filteredProducts = filteredProducts.filter(p =>
        p.price >= Number(minPrice) && p.price <= Number(maxPrice)
    );

    // Sorting
    switch (sortBy) {
        case CRITERIA.SORT.NAME_ASC:
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case CRITERIA.SORT.NAME_DESC:
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case CRITERIA.SORT.PRICE_ASC:
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case CRITERIA.SORT.PRICE_DESC:
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case CRITERIA.SORT.DATE_DESC:
            filteredProducts.sort((a, b) => b.createdAt - a.createdAt);
            break;
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
        products: paginatedProducts,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: filteredProducts.length,
            pages: Math.ceil(filteredProducts.length / limit)
        },
        filters: {
            search,
            category,
            status,
            sortBy,
            priceRange: { min: minPrice, max: maxPrice }
        }
    });
}));

/**
 * GET /api/v1/products/:id
 * Get product by ID
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        throw notFound('Product not found');
    }

    res.json({ product });
}));

/**
 * POST /api/v1/products
 * Create new product (admin/manager only)
 */
router.post('/', authenticate, isAdminOrManager, asyncHandler(async (req, res) => {
    const { name, description, price, category, stock = 0 } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
        throw badRequest('Missing required fields');
    }

    if (price < 0) {
        throw badRequest('Price must be non-negative');
    }

    const product = {
        id: products.length + 1,
        name,
        description,
        price: Number(price),
        category,
        status: CRITERIA.FILTER.STATUS.ACTIVE,
        stock: Number(stock),
        imageUrl: '',
        createdAt: new Date()
    };

    products.push(product);

    res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_MESSAGES.CREATED,
        product
    });
}));

/**
 * PUT /api/v1/products/:id
 * Update product (admin/manager only)
 */
router.put('/:id', authenticate, isAdminOrManager, asyncHandler(async (req, res) => {
    const productIndex = products.findIndex(p => p.id === Number(req.params.id));

    if (productIndex === -1) {
        throw notFound('Product not found');
    }

    const { name, description, price, category, stock, status } = req.body;

    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (price !== undefined) products[productIndex].price = Number(price);
    if (category) products[productIndex].category = category;

    // Validate stock
    if (stock !== undefined) {
        const stockValue = Number(stock);
        if (!Number.isInteger(stockValue) || stockValue < 0) {
            return res.status(400).json({ error: 'Stock must be a non-negative integer.' });
        }
        products[productIndex].stock = stockValue;
    }

    // Validate status
    const allowedStatuses = ['active', 'inactive', 'archived'];
    if (status) {
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${allowedStatuses.join(', ')}` });
        }
        products[productIndex].status = status;
    }

    res.json({
        message: SUCCESS_MESSAGES.UPDATED,
        product: products[productIndex]
    });
}));

/**
 * DELETE /api/v1/products/:id
 * Delete product (admin only)
 */
router.delete('/:id', authenticate, isAdminOrManager, asyncHandler(async (req, res) => {
    const productIndex = products.findIndex(p => p.id === Number(req.params.id));

    if (productIndex === -1) {
        throw notFound('Product not found');
    }

    products.splice(productIndex, 1);

    res.json({
        message: SUCCESS_MESSAGES.DELETED
    });
}));

export default router;
