# Monitoring, Health Checks, Feature Flags, and Rollback Playbook

This playbook describes how to make production changes safe, observable, and reversible for the VE platform.

## Goals

- Fast detection of issues (observability)
- Minimize blast radius (safety)
- Swift rollback and recovery (reversibility)

---

## 1) Health Checks

### 1.1 Liveness and Readiness

Implement two lightweight endpoints in the backend server:

- Liveness: `/healthz` – process is up
- Readiness: `/readyz` – dependencies OK (config, key services)

Behavior:

- `GET /healthz` → 200 OK if event loop alive (no dependency checks)
- `GET /readyz` → 200 OK only if critical dependencies are reachable
  - ConfigProvider loads (seed/remote)
  - Environment variables required in prod exist
  - Optional: DB reachable (Phase 3)

Recommended response shape:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "version": "1.0.0",
  "checks": {
    "seedLoaded": true,
    "configApiReachable": false,
    "dbReachable": false
  }
}
```

### 1.2 Synthetic Checks

- External ping (e.g., GitHub Actions cron, UptimeRobot) to `GET /readyz`
- Latency budget: < 300ms (dev), < 150ms (prod) for 95th percentile
- Alert if 2+ consecutive failures or p95 latency > SLO for 5m

---

## 2) Feature Flags

Use config-driven flags (already scaffolded in seed/config):

- `features.enableRegistration`
- `features.enableNotifications`
- `features.enableAnalytics`

Guidelines:

- Wrap new features behind flags
- Default to off in production; enable progressively
- Use percentage rollouts where applicable (by userId hash)

Example usage:

```js
import { ConfigProvider, SchemaKeys } from './src/config/config-provider.js';

const features = await ConfigProvider.getByPrefix('features');
if (features.enableRegistration) {
  // Execute new registration flow
}
```

Progressive rollout helper (pseudo):

```js
function isInCohort(userId, percent) {
  const hash = [...String(userId)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (hash % 100) < percent; // 0..99
}
```

---

## 3) Circuit Breakers

Goals:

- Prevent cascading failures from downstream services
- Fail fast; return graceful degraded responses

Patterns:

- Timeouts and retries (bounded)
- Bulkhead isolation (per-route limits)
- Open/half-open/closed states with cool-off windows

Example (remote config fetch):

```js
async function safeFetch(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 3000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Trip breaker if failure rate threshold exceeded (pseudo)
    return { value: undefined, fromCache: true };
  } finally {
    clearTimeout(timeout);
  }
}
```

Add a simple breaker to ConfigProvider’s `_fetchFromAPI`:

- Timeout after 3s
- Retry up to 2 times with exponential backoff
- Maintain a failure counter; if > N in T minutes → open breaker for 1 minute
- When open, return cached/default values and log warning

---

## 4) Rollback Strategy

### 4.1 CI/CD Safeguards

- Required PR reviews on `main`
- CI must pass (schema, check, examples)
- Optional: require `make dedupe-dry` to pass (non-blocking)

### 4.2 Release Strategy

- Deploy behind feature flags; leave old path intact for 24–48h
- Canary deploy: 5% → 25% → 50% → 100% with monitoring
- Roll-forward by default; rollback if SLO/SLA breached

### 4.3 Rollback Playbook

1. Identify the blast radius: what changed? which routes/services?
2. Disable feature flag(s) immediately to mitigate user impact
3. If systemic, roll back deployment to last good version
   - Git: revert PR or redeploy previous image/artifact
   - Track versions via `APP_VERSION` from ConfigProvider
4. Clear caches if stale/bad data suspected
5. Communicate: incident channel update, postmortem to follow

### 4.4 Versioning & Audit

- Log `APP_VERSION`, git SHA, and environment on boot and per error report
- Keep a CHANGELOG per release, linked from PRs

---

## 5) Observability

### 5.1 Logs

- Structured JSON logs with fields: `level`, `msg`, `time`, `service`, `env`, `version`, `traceId`
- Log health checks at `debug` level; errors at `error` level

### 5.2 Metrics (starter set)

- http_requests_total (by route, status)
- http_request_duration_seconds (histogram)
- config_fetch_failures_total
- feature_flag_toggles_total (by flag)
- circuit_breaker_state (by dependency)

### 5.3 Tracing

- Adopt a trace ID per request (add header propagation)
- Sample at low rate in dev; higher fidelity around error windows

---

## 6) Runbooks

### 6.1 Incident Triage

- Check `/readyz` and logs for error spikes
- Validate recent flag changes
- Compare traffic/latency vs baseline

### 6.2 Common Scenarios

- Config API down → breaker open; serve cached/defaults
- Spike in 5xx → disable new feature; inspect recent deployment
- High latency → increase timeouts, reduce concurrency, scale out

### 6.3 Postmortem Template

- What happened?
- Timeline of events
- Root cause
- Contributing factors
- Corrective actions (with owners and deadlines)

---

### 7) Implementation Tasks (follow-up)

- Add `/healthz` and `/readyz` endpoints in `server/index.js`
- Add breaker/backoff to ConfigProvider `_fetchFromAPI`
- Introduce a tiny metrics module (in-memory counters for now)
- Wire feature flag guardrails in sensitive flows (auth, checkout)
- Consider a lightweight status page (static HTML + JSON from `/readyz`)
