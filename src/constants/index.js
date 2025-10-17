/**
 * Application Constants
 * 
 * This module contains all application-wide constants used throughout the VE application.
 * Constants are organized by category for easy maintenance and discoverability.
 */

// Application Information
export const APP_NAME = 'VE';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'VETCO';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
};

// Date and Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  API: 'YYYY-MM-DD',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Cache Configuration
export const CACHE = {
  DEFAULT_TTL: 3600, // 1 hour in seconds
  SHORT_TTL: 300, // 5 minutes
  LONG_TTL: 86400, // 24 hours
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
};

// Business Constants
export const BUSINESS = {
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
  TAX_RATE: 0.08, // 8% default tax rate
  DISCOUNT_MIN: 0,
  DISCOUNT_MAX: 100,
};

// UI Constants
export const UI = {
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  THROTTLE_DELAY: 1000, // 1 second
  ANIMATION_DURATION: 200, // 200ms
};

// Environment
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'en',
  THEME: 'light',
  TIMEZONE: 'UTC',
  COUNTRY: 'US',
};

// Search and Filter Criteria
export const CRITERIA = {
  // Sort Options
  SORT: {
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    DATE_ASC: 'date_asc',
    DATE_DESC: 'date_desc',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    POPULARITY: 'popularity',
    RATING: 'rating',
  },

  // Filter Categories
  FILTER: {
    STATUS: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      PENDING: 'pending',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    },
    PRIORITY: {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      URGENT: 'urgent',
    },
    CATEGORY: {
      PRODUCT: 'product',
      SERVICE: 'service',
      SUBSCRIPTION: 'subscription',
      DIGITAL: 'digital',
    },
  },

  // Search Parameters
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEBOUNCE_DELAY: 300, // ms
  },

  // Date Range Criteria
  DATE_RANGE: {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_WEEK: 'last_week',
    LAST_MONTH: 'last_month',
    LAST_QUARTER: 'last_quarter',
    LAST_YEAR: 'last_year',
    CUSTOM: 'custom',
  },

  // Price Range Criteria
  PRICE_RANGE: {
    UNDER_10: 'under_10',
    BETWEEN_10_50: '10_to_50',
    BETWEEN_50_100: '50_to_100',
    BETWEEN_100_500: '100_to_500',
    OVER_500: 'over_500',
    CUSTOM: 'custom',
  },
};

// Matching and Comparison Criteria
export const MATCH_CRITERIA = {
  // Text Matching
  TEXT_MATCH: {
    EXACT: 'exact',
    CONTAINS: 'contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with',
    REGEX: 'regex',
    FUZZY: 'fuzzy',
  },

  // Numeric Comparison
  NUMERIC_COMPARISON: {
    EQUAL: 'equal',
    NOT_EQUAL: 'not_equal',
    GREATER_THAN: 'greater_than',
    GREATER_THAN_OR_EQUAL: 'greater_than_or_equal',
    LESS_THAN: 'less_than',
    LESS_THAN_OR_EQUAL: 'less_than_or_equal',
    BETWEEN: 'between',
    IN_RANGE: 'in_range',
  },

  // Date Comparison
  DATE_COMPARISON: {
    BEFORE: 'before',
    AFTER: 'after',
    ON: 'on',
    BETWEEN: 'between',
    RELATIVE: 'relative',
  },
};

// Validation Criteria
export const VALIDATION_CRITERIA = {
  // Required Field Validation
  REQUIRED_FIELDS: {
    USER_REGISTRATION: ['email', 'password', 'firstName', 'lastName'],
    PRODUCT_CREATION: ['name', 'price', 'category', 'description'],
    ORDER_PLACEMENT: ['items', 'shippingAddress', 'paymentMethod'],
  },

  // Content Quality Criteria
  QUALITY: {
    MIN_DESCRIPTION_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_TITLE_LENGTH: 5,
    MAX_TITLE_LENGTH: 100,
    REQUIRED_IMAGE_COUNT: 1,
    MAX_IMAGE_COUNT: 10,
  },

  // Business Rules Criteria
  BUSINESS_RULES: {
    MIN_ORDER_VALUE: 10.00,
    FREE_SHIPPING_THRESHOLD: 50.00,
    MAX_DISCOUNT_PERCENT: 90,
    MIN_PRODUCT_RATING: 1,
    MAX_PRODUCT_RATING: 5,
  },
};
