/**
 * VE E-Commerce Platform - Backend Server
 * Main entry point for the Express.js API server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import VE resources
import config from '../src/config/index.js';
import { HTTP_STATUS } from '../src/constants/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { logger, requestLogger } from './middleware/logger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: config.security.corsOrigin,
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.security.rateLimitWindowMs,
    max: config.security.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

if (config.security.rateLimitEnabled) {
    app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.app.environment,
        version: config.app.version
    });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'VE E-Commerce API',
        version: config.app.version,
        documentation: '/api/docs',
        health: '/health'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Not Found',
        message: 'The requested resource does not exist',
        path: req.path
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.app.port;
const HOST = config.app.host;

app.listen(PORT, HOST, () => {
    logger.info(`🚀 VE Server running on http://${HOST}:${PORT}`);
    logger.info(`📝 Environment: ${config.app.environment}`);
    logger.info(`🔒 CORS enabled for: ${config.security.corsOrigin}`);
    logger.info(`⚡ Rate limiting: ${config.security.rateLimitEnabled ? 'enabled' : 'disabled'}`);
});

export default app;
