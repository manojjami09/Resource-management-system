---
name: RMS App Architecture
description: Key decisions for the TechCorp RMS frontend-only app in artifacts/rms-app
---

## Mock service pattern
All service files in `src/services/` simulate API calls with `setTimeout` delays. To connect to a real backend, replace only the `return` statements — no structural changes needed.

**Why:** The user explicitly wants to swap to Java Spring Boot REST API later without refactoring.

**How to apply:** Each service function has a `delay()` call followed by `return [...data]`. Replace with a `fetch(url)` call returning parsed JSON.

## Routing
- Uses `wouter` (not react-router-dom)
- WouterRouter base: `import.meta.env.BASE_URL.replace(/\/$/, "")` — strip trailing slash

## Auth
- No auth library. `localStorage.getItem("rms_auth") === "true"` guards routes.
- Credential: `admin@techcorp.com` / `Admin@123`

## TypeScript gotchas
- `const` variables in data files must be declared BEFORE any array that references them (no hoisting)
- Timeline event `type` fields need `as const` to satisfy the union literal type

## Key packages
- `wouter` — routing
- `framer-motion` — all animations (sidebar, panels, page transitions, cards)
- `cmdk` — command palette (Ctrl+K / ⌘K)
- `recharts` — all charts (Area, Bar, Line, Pie)
- `react-hook-form` — login form
