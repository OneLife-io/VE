/**
 * VE Resources Usage Examples
 * 
 * This file demonstrates how to use the constants, formulas, and configuration
 * from the VE resources library.
 */

// Import individual resources
import { 
  APP_NAME, 
  HTTP_STATUS, 
  USER_ROLES,
  VALIDATION,
  BUSINESS
} from './src/constants/index.js';

import {
  calculatePriceWithTax,
  calculateDiscountedPrice,
  calculateFinalPrice,
  calculateAverage,
  formatBytes,
  calculateDaysBetween
} from './src/formulas/index.js';

import config, { isProduction, isDevelopment, getApiUrl } from './src/config/index.js';

// Or import everything through the main entry point
import VE from './src/index.js';

console.log('=== VE Resources Examples ===\n');

// Example 1: Using Constants
console.log('Example 1: Using Constants');
console.log(`Application Name: ${APP_NAME}`);
console.log(`HTTP OK Status: ${HTTP_STATUS.OK}`);
console.log(`Admin Role: ${USER_ROLES.ADMIN}`);
console.log(`Min Password Length: ${VALIDATION.MIN_PASSWORD_LENGTH}`);
console.log(`Currency: ${BUSINESS.CURRENCY} (${BUSINESS.CURRENCY_SYMBOL})`);
console.log(`Tax Rate: ${BUSINESS.TAX_RATE * 100}%\n`);

// Example 2: Using Formulas - Financial Calculations
console.log('Example 2: Financial Calculations');
const basePrice = 100;
const discountPercent = 20;
const taxRate = BUSINESS.TAX_RATE;

console.log(`Base Price: ${BUSINESS.CURRENCY_SYMBOL}${basePrice}`);
console.log(`Discount: ${discountPercent}%`);
console.log(`Tax Rate: ${taxRate * 100}%`);

const priceWithTax = calculatePriceWithTax(basePrice, taxRate);
console.log(`Price with Tax: ${BUSINESS.CURRENCY_SYMBOL}${priceWithTax.toFixed(2)}`);

const discountedPrice = calculateDiscountedPrice(basePrice, discountPercent);
console.log(`Discounted Price: ${BUSINESS.CURRENCY_SYMBOL}${discountedPrice.toFixed(2)}`);

const finalPrice = calculateFinalPrice(basePrice, discountPercent, taxRate);
console.log(`Final Price (with discount and tax): ${BUSINESS.CURRENCY_SYMBOL}${finalPrice.toFixed(2)}\n`);

// Example 3: Using Formulas - Mathematical Calculations
console.log('Example 3: Mathematical Calculations');
const numbers = [10, 20, 30, 40, 50];
const average = calculateAverage(numbers);
console.log(`Numbers: [${numbers.join(', ')}]`);
console.log(`Average: ${average}\n`);

// Example 4: Using Formulas - Data Conversions
console.log('Example 4: Data Conversions');
const bytes = 1536000;
const formatted = formatBytes(bytes);
console.log(`Bytes: ${bytes}`);
console.log(`Formatted: ${formatted}\n`);

// Example 5: Using Formulas - Date Calculations
console.log('Example 5: Date Calculations');
const startDate = new Date('2025-01-01');
const endDate = new Date('2025-01-15');
const days = calculateDaysBetween(startDate, endDate);
console.log(`Start Date: ${startDate.toDateString()}`);
console.log(`End Date: ${endDate.toDateString()}`);
console.log(`Days Between: ${days} days\n`);

// Example 6: Using Configuration
console.log('Example 6: Configuration');
console.log(`App Name: ${config.app.name}`);
console.log(`App Version: ${config.app.version}`);
console.log(`Environment: ${config.app.environment}`);
console.log(`Port: ${config.app.port}`);
console.log(`Is Production: ${isProduction()}`);
console.log(`Is Development: ${isDevelopment()}`);
console.log(`API URL: ${getApiUrl('users')}\n`);

// Example 7: Using Feature Flags
console.log('Example 7: Feature Flags');
console.log(`Registration Enabled: ${config.features.enableRegistration}`);
console.log(`Social Login Enabled: ${config.features.enableSocialLogin}`);
console.log(`Notifications Enabled: ${config.features.enableNotifications}`);
console.log(`Maintenance Mode: ${config.features.maintenanceMode}\n`);

// Example 8: Using VE Object (All Resources Together)
console.log('Example 8: Using VE Object');
console.log(`VE Name: ${VE.name}`);
console.log(`VE Version: ${VE.version}`);
console.log(`Access Constants: ${VE.constants.APP_NAME}`);
console.log(`Access Formulas: ${VE.formulas.calculatePriceWithTax(50, 0.1)}`);
console.log(`Access Config: ${VE.config.app.name}\n`);

// Example 9: Real-world Use Case - E-commerce Cart
console.log('Example 9: Real-world Use Case - Shopping Cart');

const cartItems = [
  { name: 'Product A', price: 29.99, quantity: 2 },
  { name: 'Product B', price: 49.99, quantity: 1 },
  { name: 'Product C', price: 19.99, quantity: 3 },
];

// Calculate subtotal
const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log(`Subtotal: ${BUSINESS.CURRENCY_SYMBOL}${subtotal.toFixed(2)}`);

// Apply discount
const couponDiscount = 15; // 15% off
const discountAmount = (subtotal * couponDiscount) / 100;
const afterDiscount = subtotal - discountAmount;
console.log(`Discount (${couponDiscount}%): -${BUSINESS.CURRENCY_SYMBOL}${discountAmount.toFixed(2)}`);
console.log(`After Discount: ${BUSINESS.CURRENCY_SYMBOL}${afterDiscount.toFixed(2)}`);

// Calculate tax
const tax = afterDiscount * BUSINESS.TAX_RATE;
console.log(`Tax (${BUSINESS.TAX_RATE * 100}%): ${BUSINESS.CURRENCY_SYMBOL}${tax.toFixed(2)}`);

// Calculate total
const total = afterDiscount + tax;
console.log(`Total: ${BUSINESS.CURRENCY_SYMBOL}${total.toFixed(2)}\n`);

console.log('=== End of Examples ===');
