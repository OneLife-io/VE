# VE Makefile - Quality of Life Commands
# ======================================

.PHONY: help dedupe-dry dedupe-apply schema check install dev test clean

# Default target - show help
help:
	@echo "VE Development Commands"
	@echo "======================="
	@echo ""
	@echo "Schema & Config:"
	@echo "  make schema        - Validate schema files"
	@echo "  make check         - Check config integrity"
	@echo ""
	@echo "File Management:"
	@echo "  make dedupe-dry    - Preview duplicate file removal"
	@echo "  make dedupe-apply  - Remove duplicate files (CAUTION)"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Start development servers"
	@echo "  make test          - Run tests (when available)"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make clean-deps    - Remove node_modules"

# Deduplication targets
dedupe-dry:
	@echo "🔍 Running duplicate file scan (dry-run)..."
	@node scripts/dedupe-files.js --dry-run

dedupe-apply:
	@echo "⚠️  WARNING: This will delete/archive duplicate files!"
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ] || exit 1
	@node scripts/dedupe-files.js --apply

# Schema validation
schema:
	@echo "📋 Validating schema files..."
	@node --input-type=module -e "import schema from './config/keys.schema.json' with { type: 'json' }; console.log('✅ keys.schema.json is valid');"
	@node --input-type=module -e "import seed from './config/seed.local.json' with { type: 'json' }; console.log('✅ seed.local.json is valid');"
	@echo "✅ All schema files are valid JSON"

# Configuration check
check:
	@echo "🔍 Checking configuration integrity..."
	@node -e "import('./src/config/config-provider.js').then(m => { const p = m.ConfigProvider; p.reload(); console.log('✅ ConfigProvider loaded successfully'); console.log('Environment:', p.isProduction() ? 'production' : 'development'); }).catch(e => { console.error('❌ Config check failed:', e.message); process.exit(1); })"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@npm install
	@cd server && npm install
	@echo "✅ All dependencies installed"

# Development servers
dev:
	@echo "🚀 Starting development servers..."
	@echo "Backend: http://localhost:3000"
	@echo "Frontend: http://localhost:8080"
	@echo ""
	@echo "Press Ctrl+C to stop all servers"
	@trap 'kill 0' EXIT; \
		(cd server && npm run dev) & \
		(cd client && npx serve . --listen 8080)

# Run tests (placeholder)
test:
	@echo "🧪 Running tests..."
	@npm test

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist build .cache
	@find . -name "*.log" -type f -delete
	@echo "✅ Cleaned build artifacts"

# Clean dependencies
clean-deps:
	@echo "🧹 Removing node_modules..."
	@rm -rf node_modules server/node_modules client/node_modules
	@echo "✅ Cleaned dependencies"

# Full reset
reset: clean clean-deps
	@echo "🔄 Full reset complete. Run 'make install' to reinstall."

# Git branch setup (for initial setup)
setup-branches:
	@echo "🌿 Setting up git branches..."
	@git checkout -b main 2>/dev/null || git checkout main
	@git checkout -b chore/setup-schema 2>/dev/null || echo "Branch chore/setup-schema already exists"
	@git checkout -b backend/data-values 2>/dev/null || echo "Branch backend/data-values already exists"
	@git checkout chore/setup-schema
	@echo "✅ Branches ready. Currently on chore/setup-schema"
