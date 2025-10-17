# VE

Business Application and Website

## Overview

This repository contains the highest-level resources for the VE application, including:

- **Constants**: Application-wide constants for consistent values across the codebase
- **Formulas**: Calculation formulas and utility functions for business logic
- **Configuration**: Centralized application configuration with environment variable support
- **Schema-First Architecture**: Type-safe configuration with environment-based loading

## 🏗️ Architecture

VE uses a **schema-first architecture** that separates framework code from data values:

- **Framework** (on `main`): Key names, loaders, and structure
- **Data** (separate): Real values loaded from environment or API
- **Development**: Loads from `config/seed.local.json` (safe dummy data)
- **Production**: Fetches from remote API or environment variables

📚 **Read the full architecture guide**: [SCHEMA_ARCHITECTURE.md](SCHEMA_ARCHITECTURE.md)

## Project Structure

```text
VE/
├── src/
│   ├── constants/      # Application constants
│   │   └── index.js    # Constants module
│   ├── formulas/       # Calculation formulas
│   │   └── index.js    # Formulas module
│   ├── config/         # Configuration settings
│   │   ├── index.js            # Legacy config module
│   │   ├── schema-keys.js      # Schema key definitions ⭐ NEW
│   │   └── config-provider.js  # Environment-based config loader ⭐ NEW
│   ├── index.js        # Main entry point
│   └── README.md       # Detailed resources documentation
├── config/             # Schema and seed data ⭐ NEW
│   ├── keys.schema.json    # Machine-readable schema
│   └── seed.local.json     # Development seed data
├── scripts/            # Development tools ⭐ NEW
│   └── dedupe-files.js     # Duplicate file cleaner
├── examples/           # Usage examples ⭐ NEW
│   └── config-provider-usage.js
├── server/             # Backend API server
├── client/             # Frontend application
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── Makefile            # Development commands ⭐ NEW
├── SCHEMA_ARCHITECTURE.md  # Architecture guide ⭐ NEW
├── package.json        # Project metadata
├── LICENSE             # MIT License
└── README.md           # This file
```text

⭐ = New schema-first architecture files

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/VETechnologiesCo/VE.git
cd VE

# Install dependencies (if any)
npm install
```text

### Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```text

2. Update the `.env` file with your configuration values

### Usage

#### Option 1: Schema-First ConfigProvider (Recommended)

```javascript
import { ConfigProvider, SchemaKeys } from './src/config/config-provider.js';

// Get configuration values
const appName = await ConfigProvider.get(SchemaKeys.APP_NAME);
const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);
const products = await ConfigProvider.get(SchemaKeys.PRODUCTS_LIST);

// Get multiple values
const config = await ConfigProvider.getMany([
  SchemaKeys.APP_NAME,
  SchemaKeys.APP_VERSION,
]);

// Get entire section
const businessConfig = await ConfigProvider.getByPrefix('business');
```text

#### Option 2: Direct Import (Legacy)

```javascript
// Import specific resources
import { APP_NAME, HTTP_STATUS, USER_ROLES } from './src/constants/index.js';
import { calculatePriceWithTax, calculateAverage } from './src/formulas/index.js';
import config from './src/config/index.js';

// Or import everything through the main entry point
import VE from './src/index.js';

console.log(VE.constants.APP_NAME);
console.log(VE.formulas.calculatePriceWithTax(100, 0.08));
console.log(VE.config.app.port);
```text

### Quick Commands

```bash
# Validate schema files
make schema

# Check configuration
make check

# Preview duplicate file removal
make dedupe-dry

# Start development servers
make dev

# Run examples
node examples/config-provider-usage.js
```text

## Features

### Constants Module

- Application information (name, version, company)
- HTTP status codes
- API configuration values
- Validation rules (password, email, phone)
- Date and time formats
- Pagination defaults
- File upload limits
- Cache TTL values
- User roles
- Business constants (currency, tax rates)
- UI settings (toast duration, debounce delays)
- Error and success messages
- Storage keys
- Default values

### Formulas Module

#### Financial Calculations:

- Price with tax calculation
- Discount calculation
- Final price with discount and tax
- Tax amount calculation
- Profit margin calculation
- Markup calculation

#### Mathematical Calculations:

- Percentage calculation
- Average calculation
- Sum calculation
- Compound interest calculation

#### Date and Time Calculations:

- Days between dates
- Business days calculation

#### Data Conversions:

- Bytes formatting
- Decimal rounding
- Value clamping

### Configuration Module

- Application settings
- API configuration
- Database connection
- Authentication settings
- Cache configuration
- Email settings
- Storage configuration
- Logging settings
- Security settings
- Business settings
- Feature flags
- Third-party integrations

## Documentation

- **Schema Architecture Guide**: [SCHEMA_ARCHITECTURE.md](SCHEMA_ARCHITECTURE.md) - Complete guide to schema-first architecture
- **Resources API**: [src/README.md](src/README.md) - Detailed constants, formulas, and config documentation
- **Full-Stack App Guide**: [FULLSTACK_README.md](FULLSTACK_README.md) - Backend and frontend documentation
- **Development Roadmap**: [ROADMAP.md](ROADMAP.md) - 13-sprint development plan
- **Implementation Summary**: [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Complete project history

## Contributing

Contributions are welcome! When adding new resources:

1. Place constants in `src/constants/index.js`
2. Add formulas in `src/formulas/index.js`
3. Add configuration in `src/config/index.js`
4. Update documentation
5. Follow existing code style
6. Add JSDoc comments

## License

MIT License - See [LICENSE](LICENSE) file for details

## Author

VETCO - VE Technologies Co.
