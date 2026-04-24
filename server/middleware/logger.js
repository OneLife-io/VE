/**
 * Logging Middleware
 */

import winston from 'winston';
import config from '../../src/config/index.js';

// Create Winston logger
export const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        config.logging.format === 'json'
            ? winston.format.json()
            : winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                        }`;
                })
            )
        })
    ]
});

// Add file transport in production
if (config.logging.destination === 'file' && config.logging.filePath) {
    logger.add(
        new winston.transports.File({
            filename: config.logging.filePath,
            format: winston.format.json()
        })
    );
}

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};
