# Deployment Checklist

## Required Environment Variables

Public client variables. These are safe to expose because Vite embeds `VITE_` values in the browser bundle:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ALLOW_ADMIN_SIGNUP`

Server-only variables. Do not prefix these with `VITE_`, do not log them, and do not expose them to client code:

- `SUPABASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase Setup

- Confirm the project URL and publishable key match the target Supabase project.
- Set `SUPABASE_SERVICE_ROLE_KEY` only in the server/runtime secret store.
- Confirm delivery zone rows exist for all live sectors before accepting orders.
- Confirm inactive or unknown sectors are rejected in staging before launch.
- Confirm RLS/security assumptions are preserved for public and admin tables.
- Do not run destructive SQL against production from local tools.

## Admin Signup

- Default production value: `VITE_ALLOW_ADMIN_SIGNUP=false` or leave it unset.
- To create the first admin account, temporarily deploy with `VITE_ALLOW_ADMIN_SIGNUP=true`.
- Visit `/auth` directly, create the admin account, then redeploy with signup disabled.
- Public navigation and footer must not expose the admin login route.

## Build Commands

- Lint: `npm run lint`
- Build: `npm run build`

The repository uses `bun.lock`/Lovable configuration as the committed lockfile setup. Do not commit `node_modules` or accidental extra lockfiles.

## Deployment Smoke Tests

- Open `/` and confirm the public website loads without console errors.
- Open `/auth` directly and confirm login is available.
- With signup disabled, confirm `/auth` shows: `Admin signup is disabled. Please contact the site owner.`
- Confirm footer and public header do not show admin login.
- Confirm `/admin` redirects unauthenticated users to `/auth`.

## Order Flow Smoke Tests

Run these only against staging or local test data, never against the connected production backend:

- Submit an order for an active sector and confirm totals, delivery fee, payment status, and order code.
- Submit an unknown sector and confirm the friendly delivery-unavailable error.
- Submit an inactive sector and confirm the same rejection path.
- Select COD, then switch to a non-COD sector and confirm UPI is selected cleanly.
- Test tomorrow lunch cutoff using Asia/Kolkata time.
- Test today dinner cutoff using Asia/Kolkata time.
- Test a late request after cutoff and confirm it is not auto-confirmed.
- Submit concurrent staging orders and confirm `MJT-YYMMDD-HHMMSS-XXXX` order codes remain unique.

## Rollback

- Identify the last known good commit with `git log --oneline`.
- Prefer reverting a bad deployment commit with `git revert <commit>` and redeploying.
- Avoid force-pushes or history rewrites on Lovable-connected branches.
