---
name: Deriv Trading App Migration
description: Next.js to Vite migration lessons for the Deriv digits trading app in this workspace
---

# Deriv Trading App Migration

## Duplicate React instance fix for local workspace packages

**Rule:** When a workspace-local package (e.g. `@deriv/core` in `packages-local/`) imports React, Vite may resolve it to a different copy, causing "Invalid hook call" errors. Fix by:
1. Adding explicit React aliases in `vite.config.ts` pointing to the app's own `node_modules/react` and `node_modules/react-dom`
2. Setting `server.fs.strict: false` so Vite can serve files from the `packages-local/` directory outside the artifact root

**Why:** pnpm hoists packages per-workspace; a local private package living under `artifacts/trading-app/packages-local/` gets its own `node_modules` symlinks which can resolve to a different React instance than the app's.

**How to apply:** Any time a `workspace:*` local package outside `node_modules` imports React hooks/context.

## Next.js → Vite env var conversion
- `NEXT_PUBLIC_*` → `VITE_*`
- `next/link` → standard `<a>` tags or wouter `<Link>` (with matching closing tags)
- `'use client'` directives → remove entirely
- `next/font/google` → plain `@import url(...)` at top of CSS (must be first `@import`)

## CSS @import ordering (Tailwind v4 / PostCSS)
Google Fonts `@import url(...)` must come BEFORE `@import "tailwindcss"` — PostCSS throws if @import follows other statements.

## deriv-core `import.meta.env` check
The `typeof globalThis !== 'undefined' && typeof process !== 'undefined'` guard in urls.ts was replaced with `typeof import.meta !== "undefined"` since the package runs in a browser Vite context only.
