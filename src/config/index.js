/**
 * Application Configuration
 * 
 * This module contains configuration settings for the VE application.
 * Configuration values can be overridden by environment variables.
 */

/**
 * Get environment variable or return default value
 * @param {string} key - The environment variable key
 * @param {*} defaultValue - The default value if not found
 * @returns {*} The configuration value
 */
const getEnvVar = (key, defaultValue) => {
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return defaultValue;
};

/**
 * Convert string to boolean
 * @param {string} value - The string value
 * @param {boolean} defaultValue - Default value if conversion fails
 * @returns {boolean} The boolean value
 */
const toBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return defaultValue;
};

/**
 * Application Configuration Object
 */
export const config = {
  // Application Settings
  app: {
    name: getEnvVar('APP_NAME', 'VE'),
    version: getEnvVar('APP_VERSION', '1.0.0'),
    environment: getEnvVar('NODE_ENV', 'development'),
    port: parseInt(getEnvVar('PORT', '3000'), 10),
    host: getEnvVar('HOST', 'localhost'),
    baseUrl: getEnvVar('BASE_URL', 'http://localhost:3000'),
  },

  // API Configuration
  api: {
    baseUrl: getEnvVar('API_BASE_URL', '/api'),
    version: getEnvVar('API_VERSION', 'v1'),
    timeout: parseInt(getEnvVar('API_TIMEOUT', '30000'), 10),
    retryAttempts: parseInt(getEnvVar('API_RETRY_ATTEMPTS', '3'), 10),
    retryDelay: parseInt(getEnvVar('API_RETRY_DELAY', '1000'), 10),
  },

  // Database Configuration
  database: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: parseInt(getEnvVar('DB_PORT', '5432'), 10),
    name: getEnvVar('DB_NAME', 've_db'),
    user: getEnvVar('DB_USER', 'postgres'),
    password: getEnvVar('DB_PASSWORD', ''),
    ssl: toBoolean(getEnvVar('DB_SSL', 'false')),
    poolMin: parseInt(getEnvVar('DB_POOL_MIN', '2'), 10),
    poolMax: parseInt(getEnvVar('DB_POOL_MAX', '10'), 10),
  },

  // Authentication Configuration
  auth: {
    jwtSecret: getEnvVar('JWT_SECRET', 'your-secret-key-change-in-production'),
    jwtExpiration: getEnvVar('JWT_EXPIRATION', '24h'),
    refreshTokenExpiration: getEnvVar('REFRESH_TOKEN_EXPIRATION', '7d'),
    bcryptRounds: parseInt(getEnvVar('BCRYPT_ROUNDS', '10'), 10),
    sessionSecret: getEnvVar('SESSION_SECRET', 'your-session-secret'),
    sessionMaxAge: parseInt(getEnvVar('SESSION_MAX_AGE', '86400000'), 10), // 24 hours
  },

  // Cache Configuration
  cache: {
    enabled: toBoolean(getEnvVar('CACHE_ENABLED', 'true')),
    host: getEnvVar('CACHE_HOST', 'localhost'),
    port: parseInt(getEnvVar('CACHE_PORT', '6379'), 10),
    password: getEnvVar('CACHE_PASSWORD', ''),
    ttl: parseInt(getEnvVar('CACHE_TTL', '3600'), 10),
  },

  // Email Configuration
  email: {
    host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
    port: parseInt(getEnvVar('EMAIL_PORT', '587'), 10),
    secure: toBoolean(getEnvVar('EMAIL_SECURE', 'false')),
    user: getEnvVar('EMAIL_USER', ''),
    password: getEnvVar('EMAIL_PASSWORD', ''),
    from: getEnvVar('EMAIL_FROM', 'noreply@ve.com'),
  },

  // Storage Configuration
  storage: {
    provider: getEnvVar('STORAGE_PROVIDER', 'local'), // local, s3, etc.
    localPath: getEnvVar('STORAGE_LOCAL_PATH', './uploads'),
    s3Bucket: getEnvVar('STORAGE_S3_BUCKET', ''),
    s3Region: getEnvVar('STORAGE_S3_REGION', 'us-east-1'),
    s3AccessKey: getEnvVar('STORAGE_S3_ACCESS_KEY', ''),
    s3SecretKey: getEnvVar('STORAGE_S3_SECRET_KEY', ''),
    maxFileSize: parseInt(getEnvVar('STORAGE_MAX_FILE_SIZE', '10485760'), 10), // 10MB
  },

  // Logging Configuration
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'), // error, warn, info, debug
    format: getEnvVar('LOG_FORMAT', 'json'), // json, text
    destination: getEnvVar('LOG_DESTINATION', 'console'), // console, file
    filePath: getEnvVar('LOG_FILE_PATH', './logs/app.log'),
  },

  // Security Configuration
  security: {
    corsEnabled: toBoolean(getEnvVar('CORS_ENABLED', 'true')),
    corsOrigin: getEnvVar('CORS_ORIGIN', '*'),
    rateLimitEnabled: toBoolean(getEnvVar('RATE_LIMIT_ENABLED', 'true')),
    rateLimitWindowMs: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10), // 15 min
    rateLimitMaxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
    helmetEnabled: toBoolean(getEnvVar('HELMET_ENABLED', 'true')),
  },

  // Business Settings
  business: {
    currency: getEnvVar('BUSINESS_CURRENCY', 'USD'),
    taxRate: parseFloat(getEnvVar('BUSINESS_TAX_RATE', '0.08')),
    timezone: getEnvVar('BUSINESS_TIMEZONE', 'UTC'),
    defaultLanguage: getEnvVar('BUSINESS_DEFAULT_LANGUAGE', 'en'),
  },

  // Feature Flags
  features: {
    enableRegistration: toBoolean(getEnvVar('FEATURE_ENABLE_REGISTRATION', 'true')),
    enableSocialLogin: toBoolean(getEnvVar('FEATURE_ENABLE_SOCIAL_LOGIN', 'false')),
    enableNotifications: toBoolean(getEnvVar('FEATURE_ENABLE_NOTIFICATIONS', 'true')),
    enableAnalytics: toBoolean(getEnvVar('FEATURE_ENABLE_ANALYTICS', 'false')),
    maintenanceMode: toBoolean(getEnvVar('FEATURE_MAINTENANCE_MODE', 'false')),
  },

  // Third-party Integrations
  integrations: {
    googleAnalyticsId: getEnvVar('GOOGLE_ANALYTICS_ID', ''),
    stripePublicKey: getEnvVar('STRIPE_PUBLIC_KEY', ''),
    stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
    twilioAccountSid: getEnvVar('TWILIO_ACCOUNT_SID', ''),
    twilioAuthToken: getEnvVar('TWILIO_AUTH_TOKEN', ''),
    twilioPhoneNumber: getEnvVar('TWILIO_PHONE_NUMBER', ''),
  },
};

/**
 * Check if running in production environment
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  return config.app.environment === 'production';
};

/**
 * Check if running in development environment
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
  return config.app.environment === 'development';
};

/**
 * Check if running in test environment
 * @returns {boolean} True if in test
 */
export const isTest = () => {
  return config.app.environment === 'test';
};

/**
 * Get full API URL
 * @param {string} endpoint - The API endpoint
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint = '') => {
  const base = `${config.api.baseUrl}/${config.api.version}`;
  return endpoint ? `${base}/${endpoint}` : base;
};

export default config;
