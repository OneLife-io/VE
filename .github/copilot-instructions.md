<!-- Copilot / AI agent instructions for the VE repository -->
# VE — Copilot instructions

Purpose: give an AI coding agent the minimal, concrete knowledge to be productive in this repository.

Key facts
- Node.js ESM project: `package.json` has "type": "module" and requires Node >= 14. Use `import`/`export` and include `.js` extensions when editing examples.
- Single-purpose resources library: the repo exposes three main modules under `src/`: `constants`, `formulas`, and `config`. The top-level `src/index.js` exports a VE object that aggregates those resources.
- No test runner is configured. The `scripts` section contains only a placeholder `test` script.

Quick run & dev checks
- Install deps (if any): `npm install`.
- Run the usage examples to validate behavior: `node examples.js` (Node will load ESM modules because `type: "module"`).
- There is an `.env.example` (referenced in READMEs). Use it to create a `.env` file for config-driven values.

Files to read first
- `README.md` — high-level overview and quick start.
- `IMPLEMENTATION_SUMMARY.md` — author-provided design notes and verification results.
- `examples.js` — canonical usage examples showing how constants, formulas, and config are consumed. Good for writing integration-style changes.
- `src/constants/index.js`, `src/formulas/index.js`, `src/config/index.js` — implement the core APIs. Look at exported symbol names (e.g., `APP_NAME`, `HTTP_STATUS`, `BUSINESS`, `calculatePriceWithTax`, `getApiUrl`) for naming patterns.

Architecture & conventions (what you'll see and should follow)
- Constants are grouped and often exported as top-level named constants/objects (UPPER_SNAKE style like `APP_NAME`, `HTTP_STATUS`, `BUSINESS`). Prefer adding related values to `src/constants/index.js` rather than scattering magic values.
- Formulas are pure-ish utility functions that validate inputs and throw descriptive errors. Keep functions small, deterministic, and export them from `src/formulas/index.js`.
- Config is centralized in `src/config/index.js` and reads from environment variables. Use that module for runtime feature flags, host/port, and third‑party credentials (do not hardcode secrets).
- The project expects synchronous, small, testable functions; side‑effects (IO, network) belong outside formulas/constants and should be routed through config/consumer code.

Editing guidance for AI agents
- Use ESM imports/exports and preserve `.js` extensions in import paths (examples use `import ... from './src/.../index.js'`).
- When adding constants, follow existing grouping and naming conventions; update `examples.js` and `src/README.md` only if you add new public APIs.
- When adding formulas, include input validation consistent with existing functions and prefer throwing Error with clear messages (see `IMPLEMENTATION_SUMMARY.md` which emphasizes validation).
- For config changes, prefer reading values from `process.env` and expose small helpers like `isProduction()` / `getApiUrl()` as present today.

Run / test notes for maintainers
- There is no test harness; create a minimal `npm test` script if you add tests (recommended tools: jest or ava). Keep tests small and fast.
- Linting/formatting not configured in the repo. Respect the existing code style (concise, well-documented JS with JSDoc-style comments in modules).

Integration & external dependencies
- The repo documents common third-party integrations in README and config (Stripe, Twilio, SMTP). These are placeholders and gated by environment variables in `src/config/index.js`.
- Secrets must come from environment variables — never commit them. `.env.example` is the template.

Common patterns & examples (search/replace anchors)
- Example constant usage: `VALIDATION.MIN_PASSWORD_LENGTH` (see `examples.js`).
- Example formula usage: `calculateFinalPrice(basePrice, discountPercent, taxRate)` (see `examples.js`).
- Example config usage: `import config, { getApiUrl, isProduction } from './src/config/index.js'`.

Quick PR checklist for AI changes
1. Update or add entries in `src/*` (constants/formulas/config) only — keep the single-responsibility split.
2. Update `examples.js` with a short usage snippet exercising the new behavior.
3. Add or update documentation in `src/README.md` if you expose new public symbols.
4. Do not commit `.env` files or secrets; update `.env.example` if new env vars are required.

If something is ambiguous
- Read `examples.js` and `src/README.md` first; they are the canonical consumer examples. If behavior still isn't clear, ask for a small runnable example from a maintainer.

Contact / context
- Author/owner metadata is in `package.json` (`VETCO`). Use `IMPLEMENTATION_SUMMARY.md` for rationale when deciding where new constants or formulas should live.

End of file — ask maintainer for clarification if you need naming or public API decisions.
