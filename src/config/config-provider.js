/**
 * Configuration Provider - Schema-driven config loader
 * 
 * Loads configuration from:
 * - Development: seed.local.json (no real data)
 * - Production: Remote API or environment variables
 * 
 * Usage:
 *   import { ConfigProvider } from './config-provider.js';
 *   const products = await ConfigProvider.get(SchemaKeys.PRODUCTS_LIST);
 *   const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);
 * 
 * @module ConfigProvider
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import SchemaKeys, { isValidSchemaKey } from './schema-keys.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuration provider singleton
 */
class ConfigProviderClass {
    constructor() {
        this._cache = new Map();
        this._seedData = null;
        this._isProduction = process.env.NODE_ENV === 'production';
        this._apiBaseUrl = process.env.CONFIG_API_URL || null;
    }

    /**
     * Initialize the provider (load seed data in dev)
     * @private
     */
    _initialize() {
        if (this._seedData) return;

        if (!this._isProduction) {
            // Development: load from seed.local.json
            try {
                const seedPath = join(__dirname, '../../config/seed.local.json');
                const seedContent = readFileSync(seedPath, 'utf-8');
                this._seedData = JSON.parse(seedContent);
                console.log('[ConfigProvider] Loaded seed data from seed.local.json');
            } catch (error) {
                console.warn('[ConfigProvider] Could not load seed.local.json:', error.message);
                this._seedData = {};
            }
        } else {
            // Production: will fetch from API
            this._seedData = null;
        }
    }

    /**
     * Get value from nested object using dot notation
     * @private
     * @param {Object} obj - Object to search
     * @param {string} path - Dot-notation path (e.g., 'app.name')
     * @returns {*} Value at path or undefined
     */
    _getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Get configuration value by schema key
     * @param {string} key - Schema key (from SchemaKeys)
     * @param {Object} options - Options
     * @param {boolean} options.cache - Use cache (default: true)
     * @param {*} options.default - Default value if not found
     * @returns {Promise<*>} Configuration value
     * @throws {Error} If key is invalid
     */
    async get(key, options = {}) {
        const { cache = true, default: defaultValue } = options;

        // Validate key
        if (!isValidSchemaKey(key)) {
            throw new Error(`Invalid schema key: ${key}`);
        }

        // Check cache
        if (cache && this._cache.has(key)) {
            return this._cache.get(key);
        }

        this._initialize();

        let value;

        if (this._isProduction && this._apiBaseUrl) {
            // Production: fetch from API
            value = await this._fetchFromAPI(key);
        } else {
            // Development: get from seed data
            value = this._getNestedValue(this._seedData, key);
        }

        // Use default if value is undefined
        if (value === undefined && defaultValue !== undefined) {
            value = defaultValue;
        }

        // Cache the result
        if (cache && value !== undefined) {
            this._cache.set(key, value);
        }

        return value;
    }

    /**
     * Get multiple configuration values at once
     * @param {string[]} keys - Array of schema keys
     * @returns {Promise<Object>} Object with key-value pairs
     */
    async getMany(keys) {
        const results = {};
        await Promise.all(
            keys.map(async (key) => {
                results[key] = await this.get(key);
            })
        );
        return results;
    }

    /**
     * Get all configuration for a prefix (e.g., 'app', 'auth')
     * @param {string} prefix - Prefix to match (e.g., 'app')
     * @returns {Promise<Object>} All matching configuration
     */
    async getByPrefix(prefix) {
        this._initialize();
        const section = this._getNestedValue(this._seedData, prefix);
        return section || {};
    }

    /**
     * Fetch configuration from remote API (production)
     * @private
     * @param {string} key - Schema key
     * @returns {Promise<*>} Configuration value
     */
    async _fetchFromAPI(key) {
        try {
            const response = await fetch(`${this._apiBaseUrl}/config/${key}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.CONFIG_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error(`[ConfigProvider] Failed to fetch ${key} from API:`, error.message);
            return undefined;
        }
    }

    /**
     * Clear the cache
     * @param {string} [key] - Specific key to clear, or all if omitted
     */
    clearCache(key) {
        if (key) {
            this._cache.delete(key);
        } else {
            this._cache.clear();
        }
    }

    /**
     * Check if running in production
     * @returns {boolean} True if production
     */
    isProduction() {
        return this._isProduction;
    }

    /**
     * Check if running in development
     * @returns {boolean} True if development
     */
    isDevelopment() {
        return !this._isProduction;
    }

    /**
     * Get the raw seed data (development only)
     * @returns {Object|null} Seed data or null
     */
    getSeedData() {
        this._initialize();
        return this._seedData;
    }

    /**
     * Reload seed data (useful for testing)
     */
    reload() {
        this._cache.clear();
        this._seedData = null;
        this._initialize();
    }
}

// Export singleton instance
export const ConfigProvider = new ConfigProviderClass();

// Export class for testing
export { ConfigProviderClass };

// Export for convenience
export { SchemaKeys };

export default ConfigProvider;
