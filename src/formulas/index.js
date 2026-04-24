/**
 * Calculation Formulas
 * 
 * This module contains all calculation formulas used throughout the VE application.
 * Formulas are organized by category and include proper documentation for usage.
 */

/**
 * Financial Calculations
 */

/**
 * Calculate the total price including tax
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 */
export const calculatePriceWithTax = (basePrice, taxRate) => {
  if (basePrice < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be non-negative');
  }
  return basePrice * (1 + taxRate);
};

/**
 * Calculate the discounted price
 * @param {number} originalPrice - The original price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @returns {number} The price after discount
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid price or discount percentage');
  }
  return originalPrice * (1 - discountPercent / 100);
};

/**
 * Calculate the final price with discount and tax
 * @param {number} basePrice - The base price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @param {number} taxRate - The tax rate (e.g., 0.08 for 8%)
 * @returns {number} The final price after discount and tax
 */
export const calculateFinalPrice = (basePrice, discountPercent, taxRate) => {
  const discountedPrice = calculateDiscountedPrice(basePrice, discountPercent);
  return calculatePriceWithTax(discountedPrice, taxRate);
};

/**
 * Calculate tax amount
 * @param {number} price - The price to calculate tax on
 * @param {number} taxRate - The tax rate (e.g., 0.08 for 8%)
 * @returns {number} The tax amount
 */
export const calculateTaxAmount = (price, taxRate) => {
  if (price < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be non-negative');
  }
  return price * taxRate;
};

/**
 * Calculate discount amount
 * @param {number} originalPrice - The original price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @returns {number} The discount amount
 */
export const calculateDiscountAmount = (originalPrice, discountPercent) => {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid price or discount percentage');
  }
  return originalPrice * (discountPercent / 100);
};

/**
 * Calculate profit margin
 * @param {number} revenue - The revenue amount
 * @param {number} cost - The cost amount
 * @returns {number} The profit margin percentage
 */
export const calculateProfitMargin = (revenue, cost) => {
  if (revenue <= 0) {
    throw new Error('Revenue must be positive');
  }
  return ((revenue - cost) / revenue) * 100;
};

/**
 * Calculate markup percentage
 * @param {number} cost - The cost amount
 * @param {number} sellingPrice - The selling price
 * @returns {number} The markup percentage
 */
export const calculateMarkup = (cost, sellingPrice) => {
  if (cost <= 0) {
    throw new Error('Cost must be positive');
  }
  return ((sellingPrice - cost) / cost) * 100;
};

/**
 * Mathematical Calculations
 */

/**
 * Calculate percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} The percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) {
    return 0;
  }
  return (value / total) * 100;
};

/**
 * Calculate average
 * @param {number[]} values - Array of values
 * @returns {number} The average
 */
export const calculateAverage = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Values must be a non-empty array');
  }
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Calculate sum
 * @param {number[]} values - Array of values
 * @returns {number} The sum
 */
export const calculateSum = (values) => {
  if (!Array.isArray(values)) {
    throw new Error('Values must be an array');
  }
  return values.reduce((acc, val) => acc + val, 0);
};

/**
 * Calculate compound interest
 * @param {number} principal - The principal amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time in years
 * @param {number} frequency - Compounding frequency per year (default: 1)
 * @returns {number} The final amount with compound interest
 */
export const calculateCompoundInterest = (principal, rate, time, frequency = 1) => {
  if (principal < 0 || rate < 0 || time < 0 || frequency <= 0) {
    throw new Error('Invalid parameters for compound interest calculation');
  }
  return principal * Math.pow(1 + rate / frequency, frequency * time);
};

/**
 * Date and Time Calculations
 */

/**
 * Calculate days between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} The number of days between the dates
 */
export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate business days between two dates (excludes weekends)
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} The number of business days
 */
export const calculateBusinessDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Data Conversions
 */

/**
 * Convert bytes to human-readable format
 * @param {number} bytes - The number of bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} The formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Round to specified decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} The rounded value
 */
export const roundToDecimals = (value, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} The clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
