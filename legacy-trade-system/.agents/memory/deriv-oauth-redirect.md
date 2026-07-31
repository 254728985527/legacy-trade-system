---
name: Deriv OAuth redirect URI
description: The VITE_DERIV_REDIRECT_URI env var must be absent (not set to a specific host) so auth works on any deployment.
---

# Deriv OAuth redirect URI handling

**Rule:** Do NOT set `VITE_DERIV_REDIRECT_URI` to a hardcoded domain (Vercel, Replit, or otherwise).

**Why:** `use-auth.ts` already falls back to `window.location.origin` when the env var is absent. Hardcoding a specific host breaks OAuth callbacks on any other deployment.

**How to apply:**
- Keep `VITE_DERIV_REDIRECT_URI` absent from Replit Secrets.
- `EnvCheck` component only requires `VITE_DERIV_APP_ID` — the redirect URI check was removed.
- For production deploys: the deployed domain must be registered in the Deriv app settings as an allowed redirect URI.
