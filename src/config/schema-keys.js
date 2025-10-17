/**
 * Schema Keys - Stable key names for configuration and data
 * 
 * These keys act as the contract between the app and backend.
 * - Keys should remain stable across versions
 * - Never break existing keys without migration plan
 * - Values loaded from seed (dev) or API (prod) will match these keys
 * 
 * @module SchemaKeys
 */

/**
 * All available schema keys for data/config loading
 * @enum {string}
 */
export const SchemaKeys = Object.freeze({
    // Application Configuration
    APP_NAME: 'app.name',
    APP_VERSION: 'app.version',
    APP_ENVIRONMENT: 'app.environment',
    APP_PORT: 'app.port',
    APP_HOST: 'app.host',

    // Authentication & Security
    AUTH_JWT_SECRET: 'auth.jwtSecret',
    AUTH_JWT_EXPIRATION: 'auth.jwtExpiration',
    AUTH_SESSION_TIMEOUT: 'auth.sessionTimeout',
    AUTH_BCRYPT_ROUNDS: 'auth.bcryptRounds',

    // Database Configuration
    DB_HOST: 'database.host',
    DB_PORT: 'database.port',
    DB_NAME: 'database.name',
    DB_USER: 'database.user',
    DB_PASSWORD: 'database.password',
    DB_POOL_MIN: 'database.pool.min',
    DB_POOL_MAX: 'database.pool.max',

    // API Settings
    API_BASE_URL: 'api.baseUrl',
    API_TIMEOUT: 'api.timeout',
    API_RETRY_ATTEMPTS: 'api.retryAttempts',
    API_VERSION: 'api.version',

    // Business Data
    BUSINESS_TAX_RATE: 'business.taxRate',
    BUSINESS_CURRENCY: 'business.currency',
    BUSINESS_CURRENCY_SYMBOL: 'business.currencySymbol',
    BUSINESS_MIN_ORDER_VALUE: 'business.minOrderValue',
    BUSINESS_FREE_SHIPPING_THRESHOLD: 'business.freeShippingThreshold',

    // Products & Inventory
    PRODUCTS_LIST: 'products.list',
    PRODUCTS_CATEGORIES: 'products.categories',
    PRODUCTS_FEATURED: 'products.featured',

    // Users & Accounts
    USERS_LIST: 'users.list',
    USERS_ROLES: 'users.roles',

    // Orders
    ORDERS_LIST: 'orders.list',
    ORDERS_STATUSES: 'orders.statuses',

    // Cache Settings
    CACHE_ENABLED: 'cache.enabled',
    CACHE_TTL: 'cache.ttl',
    CACHE_REDIS_URL: 'cache.redisUrl',

    // Email Configuration
    EMAIL_SMTP_HOST: 'email.smtp.host',
    EMAIL_SMTP_PORT: 'email.smtp.port',
    EMAIL_FROM_ADDRESS: 'email.fromAddress',

    // Storage
    STORAGE_TYPE: 'storage.type',
    STORAGE_LOCAL_PATH: 'storage.localPath',
    STORAGE_S3_BUCKET: 'storage.s3.bucket',

    // Feature Flags
    FEATURE_REGISTRATION: 'features.enableRegistration',
    FEATURE_NOTIFICATIONS: 'features.enableNotifications',
    FEATURE_ANALYTICS: 'features.enableAnalytics',

    // Security
    SECURITY_CORS_ORIGINS: 'security.cors.origins',
    SECURITY_RATE_LIMIT_WINDOW: 'security.rateLimit.windowMs',
    SECURITY_RATE_LIMIT_MAX: 'security.rateLimit.max',

    // Third-Party Services
    STRIPE_PUBLIC_KEY: 'thirdParty.stripe.publicKey',
    STRIPE_SECRET_KEY: 'thirdParty.stripe.secretKey',
    TWILIO_ACCOUNT_SID: 'thirdParty.twilio.accountSid',
    GOOGLE_ANALYTICS_ID: 'thirdParty.googleAnalytics.trackingId',
});

/**
 * Get all schema keys as an array
 * @returns {string[]} Array of all schema key values
 */
export function getAllSchemaKeys() {
    return Object.values(SchemaKeys);
}

/**
 * Validate if a key exists in the schema
 * @param {string} key - The key to validate
 * @returns {boolean} True if key exists
 */
export function isValidSchemaKey(key) {
    return getAllSchemaKeys().includes(key);
}

/**
 * Get keys by prefix (e.g., 'app', 'auth', 'database')
 * @param {string} prefix - The prefix to filter by
 * @returns {string[]} Array of matching keys
 */
export function getKeysByPrefix(prefix) {
    const searchPrefix = prefix.toLowerCase() + '.';
    return getAllSchemaKeys().filter(key => key.startsWith(searchPrefix));
}

export default SchemaKeys;
