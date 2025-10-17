# VE Resources

This directory contains the highest-level resources for the VE application, including constants, calculation formulas, and configuration settings.

## Structure

```
src/
├── constants/     # Application-wide constants
├── formulas/      # Calculation formulas and utilities
└── config/        # Application configuration
```

## Usage

### Constants

Import constants from the constants module:

```javascript
import { 
  APP_NAME, 
  HTTP_STATUS, 
  VALIDATION, 
  USER_ROLES 
} from './constants';

// Use HTTP status codes
if (response.status === HTTP_STATUS.OK) {
  console.log('Success!');
}

// Use validation rules
if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
  console.error('Password too short');
}

// Check user roles
if (user.role === USER_ROLES.ADMIN) {
  // Admin-specific logic
}
```

### Formulas

Import and use calculation formulas:

```javascript
import {
  calculatePriceWithTax,
  calculateDiscountedPrice,
  calculateFinalPrice,
  calculateAverage,
  formatBytes
} from './formulas';

// Calculate price with tax
const totalPrice = calculatePriceWithTax(100, 0.08); // $108.00

// Calculate discounted price
const salePrice = calculateDiscountedPrice(100, 20); // $80.00

// Calculate final price with discount and tax
const finalPrice = calculateFinalPrice(100, 20, 0.08); // $86.40

// Calculate average
const avg = calculateAverage([10, 20, 30, 40]); // 25

// Format file sizes
const size = formatBytes(1536); // "1.5 KB"
```

### Configuration

Import and use application configuration:

```javascript
import config, { 
  isProduction, 
  isDevelopment, 
  getApiUrl 
} from './config';

// Access configuration values
console.log(config.app.name); // "VE"
console.log(config.app.port); // 3000

// Check environment
if (isProduction()) {
  // Production-specific logic
}

// Get API URL
const endpoint = getApiUrl('users'); // "/api/v1/users"

// Access feature flags
if (config.features.enableNotifications) {
  // Enable notifications
}
```

## Environment Variables

Configuration can be customized using environment variables. Create a `.env` file in the project root:

```env
# Application
APP_NAME=VE
APP_VERSION=1.0.0
NODE_ENV=development
PORT=3000
HOST=localhost
BASE_URL=http://localhost:3000

# API
API_BASE_URL=/api
API_VERSION=v1
API_TIMEOUT=30000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ve_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
REFRESH_TOKEN_EXPIRATION=7d
BCRYPT_ROUNDS=10

# Cache
CACHE_ENABLED=true
CACHE_HOST=localhost
CACHE_PORT=6379
CACHE_TTL=3600

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@ve.com

# Storage
STORAGE_PROVIDER=local
STORAGE_LOCAL_PATH=./uploads
STORAGE_MAX_FILE_SIZE=10485760

# Security
CORS_ENABLED=true
CORS_ORIGIN=*
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Business
BUSINESS_CURRENCY=USD
BUSINESS_TAX_RATE=0.08
BUSINESS_TIMEZONE=UTC

# Feature Flags
FEATURE_ENABLE_REGISTRATION=true
FEATURE_ENABLE_SOCIAL_LOGIN=false
FEATURE_ENABLE_NOTIFICATIONS=true
FEATURE_ENABLE_ANALYTICS=false
FEATURE_MAINTENANCE_MODE=false
```

## Categories

### Constants

- **Application Information**: `APP_NAME`, `APP_VERSION`, `COMPANY_NAME`
- **HTTP Status Codes**: `HTTP_STATUS` object with common status codes
- **API Configuration**: Timeout, retry settings
- **Validation Rules**: Password, username, email, phone validations
- **Date Formats**: Display, API, timestamp formats
- **Pagination**: Default, min, max page sizes
- **File Upload**: Size limits, allowed types
- **Cache**: TTL configurations
- **User Roles**: Admin, manager, user, guest
- **Business**: Currency, tax rate, discount limits
- **UI**: Toast duration, debounce/throttle delays
- **Error/Success Messages**: Standard messages
- **Storage Keys**: Local storage keys
- **Defaults**: Language, theme, timezone

### Formulas

#### Financial Calculations
- `calculatePriceWithTax(basePrice, taxRate)`
- `calculateDiscountedPrice(originalPrice, discountPercent)`
- `calculateFinalPrice(basePrice, discountPercent, taxRate)`
- `calculateTaxAmount(price, taxRate)`
- `calculateDiscountAmount(originalPrice, discountPercent)`
- `calculateProfitMargin(revenue, cost)`
- `calculateMarkup(cost, sellingPrice)`

#### Mathematical Calculations
- `calculatePercentage(value, total)`
- `calculateAverage(values)`
- `calculateSum(values)`
- `calculateCompoundInterest(principal, rate, time, frequency)`

#### Date and Time Calculations
- `calculateDaysBetween(startDate, endDate)`
- `calculateBusinessDays(startDate, endDate)`

#### Data Conversions
- `formatBytes(bytes, decimals)`
- `roundToDecimals(value, decimals)`
- `clamp(value, min, max)`

### Configuration

- **Application Settings**: Name, version, environment, port
- **API Configuration**: Base URL, version, timeout
- **Database**: Connection settings
- **Authentication**: JWT, session settings
- **Cache**: Redis configuration
- **Email**: SMTP settings
- **Storage**: File storage configuration
- **Logging**: Level, format, destination
- **Security**: CORS, rate limiting, helmet
- **Business Settings**: Currency, tax rate, timezone
- **Feature Flags**: Enable/disable features
- **Third-party Integrations**: Google Analytics, Stripe, Twilio

## Best Practices

1. **Constants**: Use constants instead of magic numbers or strings throughout your code
2. **Formulas**: Always validate inputs and handle edge cases
3. **Configuration**: Use environment variables for sensitive data
4. **Organization**: Keep related constants and formulas grouped together
5. **Documentation**: Document all constants and formulas with clear descriptions
6. **Testing**: Write tests for all calculation formulas
7. **Immutability**: Treat constants as immutable values

## Contributing

When adding new resources:

1. Place constants in the appropriate category in `src/constants/index.js`
2. Add calculation formulas with proper validation in `src/formulas/index.js`
3. Add configuration options in `src/config/index.js`
4. Document usage in this README
5. Write tests for any new formulas
6. Use descriptive names and add JSDoc comments

## License

MIT License - See LICENSE file for details
