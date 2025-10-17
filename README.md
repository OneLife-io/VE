# VE
Business Application and Website

## Overview

This repository contains the highest-level resources for the VE application, including:

- **Constants**: Application-wide constants for consistent values across the codebase
- **Formulas**: Calculation formulas and utility functions for business logic
- **Configuration**: Centralized application configuration with environment variable support

## Project Structure

```
VE/
├── src/
│   ├── constants/      # Application constants
│   │   └── index.js    # Constants module
│   ├── formulas/       # Calculation formulas
│   │   └── index.js    # Formulas module
│   ├── config/         # Configuration settings
│   │   └── index.js    # Config module
│   ├── index.js        # Main entry point
│   └── README.md       # Detailed resources documentation
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project metadata
├── LICENSE             # MIT License
└── README.md           # This file
```

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/VETechnologiesCo/VE.git
cd VE

# Install dependencies (if any)
npm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration values

### Usage

Import resources in your application:

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
```

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

**Financial Calculations:**
- Price with tax calculation
- Discount calculation
- Final price with discount and tax
- Tax amount calculation
- Profit margin calculation
- Markup calculation

**Mathematical Calculations:**
- Percentage calculation
- Average calculation
- Sum calculation
- Compound interest calculation

**Date and Time Calculations:**
- Days between dates
- Business days calculation

**Data Conversions:**
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

For detailed documentation on using the resources, see [src/README.md](src/README.md).

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
