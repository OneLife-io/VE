/**
 * VE - Main Entry Point
 * 
 * This module provides a single entry point to access all application resources
 * including constants, formulas, and configuration.
 */

// Export all constants
export * from './constants/index.js';

// Export all formulas
export * from './formulas/index.js';

// Export configuration
export { default as config } from './config/index.js';
export { isProduction, isDevelopment, isTest, getApiUrl } from './config/index.js';

/**
 * Module Information
 */
export const VE_VERSION = '1.0.0';
export const VE_NAME = 'VE Resources';

/**
 * Quick access to commonly used modules
 */
import * as constants from './constants/index.js';
import * as formulas from './formulas/index.js';
import config from './config/index.js';

export const VE = {
  constants,
  formulas,
  config,
  version: VE_VERSION,
  name: VE_NAME,
};

export default VE;
