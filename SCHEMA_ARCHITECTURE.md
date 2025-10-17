# Schema-First Architecture Guide

## 📋 Overview

VE uses a **schema-first architecture** that separates framework code (key names and loaders) from actual data values. This approach ensures:

- **Clean separation**: Framework on `main`, data on `backend/data-values`
- **Environment flexibility**: Seed data in dev, remote API in production
- **Type safety**: Machine-readable schema defines all config keys
- **No secrets in main**: Real credentials live elsewhere

## 🌿 Branch Strategy

### Three Branches

1. **`main`** (protected)
   - Contains framework only: key names + loaders
   - No real data, secrets, or production values
   - Requires PRs for all changes
   - Schema keys are the public API contract

2. **`chore/setup-schema`** (working branch)
   - For schema changes and improvements
   - PRs merge into `main` after review

3. **`backend/data-values`** (data branch)
   - Real production data and values
   - Never merged into `main`
   - Backend services pull from here

### Protection Rules

```bash
# Protect main branch (GitHub settings)
- Require pull requests before merging
- Require status checks to pass
- No direct pushes allowed
```

## 🗝️ Schema Keys

### What Are Schema Keys?

Schema keys are **stable identifiers** for all configuration and data in the system. They act as the contract between your app and backend.

**Example:**

```javascript
import { SchemaKeys } from './src/config/schema-keys.js';

// Keys are stable - never change without migration
SchemaKeys.APP_NAME           // "app.name"
SchemaKeys.BUSINESS_TAX_RATE  // "business.taxRate"
SchemaKeys.PRODUCTS_LIST      // "products.list"
```

### Key Principles

1. **Never break keys** - treat them like a public API
2. **Add new keys** via PR to `main`
3. **Deprecate old keys** with migration path
4. **Use dot notation** for nested structure

## 📦 Configuration Provider

### Usage

```javascript
import { ConfigProvider, SchemaKeys } from './src/config/config-provider.js';

// Get a single value
const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);

// Get with default
const timeout = await ConfigProvider.get(SchemaKeys.API_TIMEOUT, { 
  default: 30000 
});

// Get multiple values
const config = await ConfigProvider.getMany([
  SchemaKeys.APP_NAME,
  SchemaKeys.APP_VERSION,
  SchemaKeys.APP_ENVIRONMENT,
]);

// Get entire section
const businessConfig = await ConfigProvider.getByPrefix('business');
```

### How It Works

#### Development Mode

```
ConfigProvider → config/seed.local.json → Returns dummy data
```

- Loads from `config/seed.local.json`
- No network calls
- Fast and offline-friendly
- Safe dummy data (no real credentials)

#### Production Mode

```
ConfigProvider → Remote API → Returns real data
```

- Fetches from `CONFIG_API_URL` environment variable
- Authenticated with `CONFIG_API_TOKEN`
- Falls back to defaults if unavailable
- Caches results for performance

## 🌱 Seed Data

### Development Seed

`config/seed.local.json` contains **dummy data** for local development:

```json
{
  "app": {
    "name": "VE Platform (Dev)",
    "environment": "development"
  },
  "business": {
    "taxRate": 0.08
  },
  "products": {
    "list": [/* sample products */]
  },
  "auth": {
    "jwtSecret": "dev-secret-change-in-production"
  }
}
```

**Important:**

- ✅ Committed to `main` branch
- ✅ Safe dummy values only
- ✅ No real credentials
- ✅ Good for onboarding new developers

### Production Data

Production values come from:

- Environment variables
- Remote configuration API
- Secure vault (e.g., AWS Secrets Manager)

**Never commit to `main`:**

- Real API keys
- Production credentials
- Actual customer data
- PII or sensitive information

## 🧹 Duplicate File Cleaner

### Purpose

Safely removes duplicate files from the repository:

- **Identical duplicates**: Same content → delete extras
- **Conflicting duplicates**: Same name, different content → archive for review

### Usage

```bash
# Preview changes (safe)
make dedupe-dry
# or
node scripts/dedupe-files.js --dry-run

# Execute changes (caution!)
make dedupe-apply
# or
node scripts/dedupe-files.js --apply
```

### How It Works

1. **Scan**: Finds all files (ignoring node_modules, .git, etc.)
2. **Hash**: Computes MD5 hash of each file
3. **Identical duplicates**:
   - Same hash → keeps one (based on path priority)
   - Deletes others
4. **Conflicting duplicates**:
   - Same name, different hash
   - Archives conflicts to `.archive/duplicates/conflict/`
   - Keeps one (based on path priority)

### Path Priority

By default, keeps files from:

1. `src/` (highest priority)
2. `lib/`
3. `app/`
4. `server/`
5. `client/`

Customize with `--prefer`:

```bash
node scripts/dedupe-files.js --prefer "src,app,lib" --apply
```

### Archive Structure

```
.archive/
└── duplicates/
    ├── conflict/          # Same name, different content
    │   ├── client/js/utils.js
    │   └── server/lib/utils.js
    └── [future categories]
```

## 🛠️ Makefile Targets

Quick commands for common tasks:

```bash
# Schema validation
make schema        # Validate keys.schema.json and seed.local.json

# Configuration check
make check         # Verify ConfigProvider loads correctly

# File management
make dedupe-dry    # Preview duplicate file removal
make dedupe-apply  # Remove duplicates (with confirmation)

# Development
make install       # Install all dependencies
make dev           # Start backend + frontend servers
make test          # Run tests (when available)

# Cleanup
make clean         # Remove build artifacts
make clean-deps    # Remove node_modules
make reset         # Full clean + clean-deps
```

## 🔄 Operating Rhythm

### Daily Workflow

1. **Pull latest** from `main`
2. **Run deduper** if files are messy

   ```bash
   make dedupe-dry
   ```

3. **Check schema** if config changed

   ```bash
   make schema
   make check
   ```

4. **Develop** using ConfigProvider

   ```javascript
   const products = await ConfigProvider.get(SchemaKeys.PRODUCTS_LIST);
   ```

### Adding New Configuration

1. **Add key** to `src/config/schema-keys.js`

   ```javascript
   export const SchemaKeys = Object.freeze({
     // ... existing keys
     MY_NEW_KEY: 'section.myNewKey',
   });
   ```

2. **Update schema** in `config/keys.schema.json`

   ```json
   {
     "key": "section.myNewKey",
     "type": "string",
     "description": "My new configuration",
     "required": false,
     "default": "default-value"
   }
   ```

3. **Add to seed** in `config/seed.local.json`

   ```json
   {
     "section": {
       "myNewKey": "dev-value"
     }
   }
   ```

4. **Validate**

   ```bash
   make schema
   make check
   ```

5. **Use in code**

   ```javascript
   const value = await ConfigProvider.get(SchemaKeys.MY_NEW_KEY);
   ```

6. **Commit to chore branch**

   ```bash
   git add src/config/schema-keys.js config/
   git commit -m "feat: add MY_NEW_KEY configuration"
   ```

7. **Open PR** to `main`

### Resolving Archived Conflicts

After running `make dedupe-apply`:

1. **Review** `.archive/duplicates/conflict/`
2. **Compare** conflicting files
3. **Decide** which version is correct
4. **Restore** if needed:

   ```bash
   cp .archive/duplicates/conflict/path/file.js src/correct/location/file.js
   ```

5. **Delete** archive when resolved:

   ```bash
   rm -rf .archive/duplicates/
   ```

## 🚀 Migration from Old Config

If migrating from the existing `src/config/index.js`:

### Before (Old)

```javascript
import config from './src/config/index.js';
const taxRate = config.business.taxRate;
```

### After (Schema-First)

```javascript
import { ConfigProvider, SchemaKeys } from './src/config/config-provider.js';
const taxRate = await ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);
```

### Compatibility Layer

Keep both during transition:

```javascript
// src/config/index.js (updated)
import { ConfigProvider, SchemaKeys } from './config-provider.js';

// Old API (deprecated but working)
export default {
  business: {
    get taxRate() {
      return ConfigProvider.get(SchemaKeys.BUSINESS_TAX_RATE);
    }
  }
};
```

## 🔒 Security Best Practices

### ✅ DO

- ✅ Commit `seed.local.json` with dummy data
- ✅ Use environment variables in production
- ✅ Keep real secrets in vault/secrets manager
- ✅ Validate schema with `make schema`
- ✅ Review PRs for new keys
- ✅ Document all schema changes

### ❌ DON'T

- ❌ Commit real API keys to `main`
- ❌ Put production data in seed files
- ❌ Break existing keys without migration
- ❌ Skip schema validation
- ❌ Push secrets to any branch
- ❌ Bypass branch protection

## 📚 File Reference

```
VE/
├── src/
│   └── config/
│       ├── schema-keys.js           # Schema key definitions
│       ├── config-provider.js       # Configuration loader
│       └── index.js                 # (old config, for compatibility)
├── config/
│   ├── keys.schema.json            # Machine-readable schema
│   └── seed.local.json             # Development seed data
├── scripts/
│   └── dedupe-files.js             # Duplicate file cleaner
├── .archive/                        # Archived conflicts (gitignored)
├── Makefile                         # Development commands
└── .gitignore                       # Ignore production seeds
```

## 🎯 Key Takeaways

1. **Schema keys = public API** - never break them
2. **main = framework only** - no real data
3. **Seed data = safe dummy values** - for development
4. **Production = remote API** - or environment variables
5. **Deduper = keep codebase clean** - run regularly
6. **PRs required** - protect `main` branch

---

**Questions?** Check `examples/config-provider-usage.js` for working examples.

**Need help?** Run `make help` for available commands.
