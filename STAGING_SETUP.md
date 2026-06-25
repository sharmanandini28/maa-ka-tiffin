# Staging Supabase Setup

This project must be verified against a staging Supabase project before any production deployment.

## Why Staging Is Required

- The application now depends on the audit-log migration at `supabase/migrations/20260625091500_admin_action_logs.sql`.
- Admin-managed UPI settings depend on `supabase/migrations/20260625103000_payment_settings.sql`.
- Admin payment and order actions write to `public.admin_action_logs`.
- The order drawer reads audit history from `public.admin_action_logs`.
- These migrations must be applied and smoke-tested on staging before production.
- Production must not be touched until staging migration and smoke tests pass.

## Required Staging Supabase Details

Collect these values from the Supabase dashboard for the staging project only:

- Staging project ref
- Staging Supabase URL
- Staging publishable or anon key
- Staging service role key
- Database password, if the CLI prompts for it
- Written confirmation that the project is staging, not production

Do not copy production keys into any staging env file.

## Required Local Env File

Create a local-only staging env file such as `.env.staging.local` or `.env.staging`.
These files are ignored by `.gitignore` through `.env.*`, so they must not be committed.

Use placeholders first, then replace them locally with staging-only values:

```bash
SUPABASE_PROJECT_ID=<STAGING_PROJECT_REF>
SUPABASE_URL=<STAGING_SUPABASE_URL>
SUPABASE_PUBLISHABLE_KEY=<STAGING_PUBLISHABLE_KEY>
SUPABASE_SERVICE_ROLE_KEY=<STAGING_SERVICE_ROLE_KEY>

VITE_SUPABASE_PROJECT_ID=<STAGING_PROJECT_REF>
VITE_SUPABASE_URL=<STAGING_SUPABASE_URL>
VITE_SUPABASE_PUBLISHABLE_KEY=<STAGING_PUBLISHABLE_KEY>
VITE_ALLOW_ADMIN_SIGNUP=false
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Never create a `VITE_SUPABASE_SERVICE_ROLE_KEY`.
- Keep `VITE_ALLOW_ADMIN_SIGNUP=false` unless intentionally creating a staging admin account.
- If admin signup must be temporarily enabled on staging, set it back to `false` immediately after setup.

## Supabase CLI Setup

Install Supabase CLI using the official Supabase CLI installation guide for your platform.
Do not use `npm install -g supabase`; Supabase documents that global npm install is not supported.

Check the CLI:

```bash
supabase --version
supabase --help
```

Staging-only login and link:

```bash
supabase login
supabase link --project-ref <STAGING_PROJECT_REF>
```

Staging-only migration checks:

```bash
supabase migration list
supabase db push
```

Run `supabase db push` only after the staging safety checklist below is complete.

## Staging Safety Checklist

Before running `supabase db push`, confirm all items:

- The project ref belongs to staging.
- The Supabase URL belongs to staging.
- The service role key belongs to staging.
- No production env file is loaded in the current terminal.
- The migration is additive.
- No destructive SQL is present.
- A staging backup or export has been taken if needed.
- The current branch is intended for staging validation.
- The target is not production.

## Audit Log Migration Review

Migration file:

```text
supabase/migrations/20260625091500_admin_action_logs.sql
```

Expected properties:

- Creates `public.admin_action_logs`.
- Adds indexes for order, entity, and admin lookups.
- Grants `SELECT` and `INSERT` to `authenticated`.
- Grants all access to `service_role`.
- Enables RLS.
- Allows only admins to read audit logs.
- Allows only admins to insert audit logs.
- Does not drop existing tables.
- Does not destructively change existing columns.

## Payment Settings Migration Review

Migration file:

```text
supabase/migrations/20260625103000_payment_settings.sql
```

Expected properties:

- Creates `public.payment_settings`.
- Seeds one active placeholder UPI settings row.
- Allows public/anonymous read of active payment settings only.
- Allows only admins to insert/update payment settings.
- Grants full access to `service_role`.
- Enables RLS.
- Adds `payment_settings_updated` to audit-log action validation when the audit table exists.
- Does not drop existing tables.
- Does not destructively change existing columns.

## Staging Smoke Test Checklist

### Public Order Flow

- Valid sector order succeeds.
- Unknown sector is rejected with the unavailable-sector message.
- Inactive sector is rejected.
- COD unavailable sector cleanly switches to UPI.
- Tomorrow lunch cutoff is evaluated in `Asia/Kolkata`.
- Today dinner cutoff is evaluated in `Asia/Kolkata`.
- Late order path routes to manual approval behavior.
- Lunch + Dinner linked order creates unique order codes.
- UPI QR uses the active staging payment settings.
- Updating UPI settings in admin changes the order page QR destination.

### Admin Flow

- Admin login works through direct auth route.
- Payment Settings page loads.
- Admin can update UPI ID, payee name, instructions, UPI enabled, and transaction ID requirement.
- Payments queue loads.
- Payments queue shows the active UPI ID and payee.
- UPI payment can be verified.
- UPI payment can be rejected with note.
- Payment can be marked as COD.
- Late order can be approved.
- Late order can be rejected with note.
- Delivery status can be changed.
- Order can be cancelled.
- Admin note can be updated.
- Order drawer opens.
- Audit history appears in the order drawer.
- Each admin action creates an audit-log row.

### RLS And Security

- Anonymous users cannot read `admin_action_logs`.
- Non-admin authenticated users cannot read `admin_action_logs`.
- Admin users can read audit logs.
- Admin actions create audit-log rows.
- Public order creation still works only through server-side validation.

## Stop Conditions

Stop immediately and do not apply migrations if:

- The project ref is not clearly staging.
- The terminal is using production env values.
- The service role key is missing or appears to be production.
- The Supabase CLI is not linked to the intended staging project.
- `supabase migration list` shows unexpected pending or missing migrations.
- Any smoke test would mutate production data.
