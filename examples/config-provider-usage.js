/**
 * ConfigProvider Usage Examples
 * 
 * Demonstrates how to use the schema-first configuration system
 */

import { ConfigProvider, SchemaKeys } from '../src/config/config-provider.js';

console.log('🔧 VE ConfigProvider Examples\n');

// Example 1: Get single configuration value
async function example1() {
    console.log('Example 1: Get single value');
    console.log('==============================');

    const appName = await ConfigProvider.get(SchemaKeys.APP_NAME);
    const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);

    console.log(`App Name: ${appName}`);
    console.log(`Tax Rate: ${(taxRate * 100).toFixed(2)}%`);
    console.log('');
}

// Example 2: Get with default value
async function example2() {
    console.log('Example 2: Get with default');
    console.log('============================');

    const timeout = await ConfigProvider.get(SchemaKeys.API_TIMEOUT, {
        default: 30000
    });

    const customKey = await ConfigProvider.get('custom.missing.key', {
        default: 'fallback-value'
    }).catch(() => 'error-fallback');

    console.log(`API Timeout: ${timeout}ms`);
    console.log(`Custom Key: ${customKey}`);
    console.log('');
}

// Example 3: Get multiple values
async function example3() {
    console.log('Example 3: Get multiple values');
    console.log('===============================');

    const config = await ConfigProvider.getMany([
        SchemaKeys.APP_NAME,
        SchemaKeys.APP_VERSION,
        SchemaKeys.APP_ENVIRONMENT,
    ]);

    console.log('Application Config:');
    console.log(JSON.stringify(config, null, 2));
    console.log('');
}

// Example 4: Get entire section
async function example4() {
    console.log('Example 4: Get section by prefix');
    console.log('=================================');

    const businessConfig = await ConfigProvider.getByPrefix('business');

    console.log('Business Configuration:');
    console.log(JSON.stringify(businessConfig, null, 2));
    console.log('');
}

// Example 5: Get array data (products)
async function example5() {
    console.log('Example 5: Get array data');
    console.log('=========================');

    const products = await ConfigProvider.get(SchemaKeys.PRODUCTS_LIST);
    const categories = await ConfigProvider.get(SchemaKeys.PRODUCTS_CATEGORIES);

    console.log(`Total Products: ${products?.length || 0}`);
    console.log(`Categories: ${categories?.join(', ')}`);

    if (products && products.length > 0) {
        console.log('\nFirst Product:');
        console.log(`  - ${products[0].name}: $${products[0].price}`);
    }
    console.log('');
}

// Example 6: Environment detection
async function example6() {
    console.log('Example 6: Environment detection');
    console.log('================================');

    const isProduction = ConfigProvider.isProduction();
    const isDevelopment = ConfigProvider.isDevelopment();
    const environment = await ConfigProvider.get(SchemaKeys.APP_ENVIRONMENT);

    console.log(`Environment: ${environment}`);
    console.log(`Is Production: ${isProduction}`);
    console.log(`Is Development: ${isDevelopment}`);
    console.log('');
}

// Example 7: E-commerce calculations
async function example7() {
    console.log('Example 7: E-commerce calculations');
    console.log('===================================');

    const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);
    const currency = await ConfigProvider.get(SchemaKeys.BUSINESS_CURRENCY);
    const symbol = await ConfigProvider.get(SchemaKeys.BUSINESS_CURRENCY_SYMBOL);

    // Sample cart
    const cartSubtotal = 299.99;
    const tax = cartSubtotal * taxRate;
    const total = cartSubtotal + tax;

    console.log(`Subtotal: ${symbol}${cartSubtotal.toFixed(2)}`);
    console.log(`Tax (${(taxRate * 100).toFixed(2)}%): ${symbol}${tax.toFixed(2)}`);
    console.log(`Total: ${symbol}${total.toFixed(2)} ${currency}`);
    console.log('');
}

// Example 8: Feature flags
async function example8() {
    console.log('Example 8: Feature flags');
    console.log('========================');

    const features = await ConfigProvider.getByPrefix('features');

    console.log('Feature Flags:');
    Object.entries(features).forEach(([key, enabled]) => {
        console.log(`  ${key}: ${enabled ? '✅ Enabled' : '❌ Disabled'}`);
    });
    console.log('');
}

// Run all examples
async function runAllExamples() {
    try {
        await example1();
        await example2();
        await example3();
        await example4();
        await example5();
        await example6();
        await example7();
        await example8();

        console.log('✅ All examples completed successfully!');
    } catch (error) {
        console.error('❌ Error running examples:', error.message);
        process.exit(1);
    }
}

runAllExamples();
