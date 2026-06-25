# Customer And Subscription Improvement Plan

This document is a planning artifact only. Do not create migrations or implement these features until the audit-log migration has passed staging verification.

## Scope

Planned improvements:

1. Customer account dashboard
2. Customer order history
3. Repeat last order
4. Subscription wallet
5. Meal credits
6. Pause meal system
7. Feedback and rating system
8. Low-rating admin alerts
9. Customer support and complaint notes

## Proposed Database Tables To Evaluate

### `customer_profiles`

Purpose:

- Stores customer account details linked to Supabase Auth users.
- Provides a stable customer identity for dashboards, subscriptions, support, and order history.

Suggested columns:

- `id uuid primary key`
- `user_id uuid not null references auth.users(id)`
- `full_name text`
- `phone text`
- `default_sector text`
- `default_address text`
- `delivery_notes text`
- `created_at timestamptz`
- `updated_at timestamptz`

Security:

- Customers can read and update only their own profile.
- Admins can read profiles for operational support.
- Service role can perform server-side inserts during account setup.

Risks:

- Existing guest orders may not have a user account.
- Phone number uniqueness must be decided before enforcing constraints.

### `subscriptions`

Purpose:

- Tracks active, paused, expired, or cancelled meal subscription plans.
- Connects future subscription wallet and meal-credit behavior.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `plan_name text`
- `status text`
- `start_date date`
- `end_date date`
- `meal_type text`
- `meals_per_day integer`
- `created_at timestamptz`
- `updated_at timestamptz`

Security:

- Customers can read their own subscriptions.
- Admins can read and manage subscriptions.
- Customer writes should be limited to safe actions like pause requests, not direct balance edits.

Risks:

- Subscription billing rules are not yet implemented.
- Pauses and credits must not double-count meals.

### `meal_credits`

Purpose:

- Stores the current available meal credit balance per customer/subscription.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `subscription_id uuid references subscriptions(id)`
- `available_credits integer`
- `reserved_credits integer`
- `updated_at timestamptz`

Security:

- Customers can read their own balance.
- Admins can read balances.
- Only trusted server/admin paths can mutate balances.

Risks:

- Race conditions during repeat orders or bulk booking.
- Refund and cancellation behavior must be defined before production use.

### `meal_credit_transactions`

Purpose:

- Provides an immutable ledger for credit additions, deductions, reversals, and adjustments.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `subscription_id uuid references subscriptions(id)`
- `order_id uuid references orders(id)`
- `transaction_type text`
- `credit_delta integer`
- `balance_after integer`
- `reason text`
- `created_by uuid references auth.users(id)`
- `created_at timestamptz`

Security:

- Customers can read their own ledger.
- Admins can read all ledger rows.
- Inserts should be server/admin only.

Risks:

- Must be append-only for auditability.
- Must be transactionally consistent with order creation.

### `meal_pauses`

Purpose:

- Tracks customer pause requests and approved paused meal windows.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `subscription_id uuid references subscriptions(id)`
- `pause_start date`
- `pause_end date`
- `status text`
- `reason text`
- `admin_note text`
- `created_at timestamptz`
- `reviewed_at timestamptz`
- `reviewed_by uuid references auth.users(id)`

Security:

- Customers can create and read their own pause requests.
- Admins can approve, reject, and annotate pause requests.

Risks:

- Cutoff handling must prevent same-day abuse.
- Pause windows must not conflict with already-prepared meals.

### `feedback`

Purpose:

- Captures customer ratings and qualitative meal feedback.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `order_id uuid references orders(id)`
- `rating integer`
- `category text`
- `comment text`
- `status text`
- `created_at timestamptz`
- `reviewed_at timestamptz`

Security:

- Customers can create feedback for their own orders.
- Customers can read their own feedback.
- Admins can read and moderate all feedback.

Risks:

- Public testimonial use must be opt-in.
- Low ratings should notify admins without exposing private comments publicly.

### `customer_notes`

Purpose:

- Internal admin notes about customer preferences, delivery issues, or support context.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `admin_user_id uuid references auth.users(id)`
- `note text`
- `visibility text`
- `created_at timestamptz`

Security:

- Admin-only by default.
- Do not expose private admin notes to customers unless a separate public-note model is created.

Risks:

- Notes may contain sensitive data.
- Requires clear admin policy for acceptable content.

### `support_requests`

Purpose:

- Tracks customer complaints, delivery issues, refund questions, and service support.

Suggested columns:

- `id uuid primary key`
- `customer_id uuid references customer_profiles(id)`
- `order_id uuid references orders(id)`
- `subject text`
- `message text`
- `status text`
- `priority text`
- `assigned_admin_id uuid references auth.users(id)`
- `resolution_note text`
- `created_at timestamptz`
- `updated_at timestamptz`

Security:

- Customers can create and read their own support requests.
- Admins can read and update support requests.
- Status and assignment changes should be admin-only.

Risks:

- Need clear SLA states.
- Complaint notes should not leak across customers.

## Feature Plans

### 1. Customer Account Dashboard

Business purpose:

- Give customers a single place to view orders, subscription status, meal credits, pauses, and support.

Database needs:

- `customer_profiles`
- `subscriptions`
- `meal_credits`
- recent `orders`
- recent `support_requests`

Routes:

- Public/customer: `/customer/dashboard`
- Admin: customer detail view under admin customer management

Order flow changes:

- Link new orders to a customer profile when authenticated.
- Keep guest checkout behavior until account requirement is explicitly approved.

Risks:

- Mixed guest and logged-in order history.
- Phone/email matching must not expose another customer's data.

### 2. Customer Order History

Business purpose:

- Let customers review previous and upcoming meals.

Database needs:

- Existing `orders`
- Optional `customer_profiles`

Routes:

- Public/customer: `/customer/orders`
- Admin: existing order table can link to customer profile.

Order flow changes:

- Store `customer_id` on new authenticated orders, if not already available.

Risks:

- Backfilling old guest orders needs a careful matching policy.

### 3. Repeat Last Order

Business purpose:

- Reduce friction for frequent customers.

Database needs:

- Existing `orders`
- Optional `customer_profiles`
- Optional `meal_credits` when subscription credits exist

Routes:

- Public/customer: repeat action from `/customer/orders`

Order flow changes:

- Prefill order wizard from a previous order.
- Re-run all current validations: sector, active zone, COD availability, cutoff, and price.
- Generate new unique order codes.

Risks:

- Repeating old sector/menu data that is no longer valid.
- Accidentally bypassing current cutoff rules.

### 4. Subscription Wallet

Business purpose:

- Allow prepaid meal plans and account-level balance tracking.

Database needs:

- `subscriptions`
- `meal_credits`
- `meal_credit_transactions`

Routes:

- Public/customer: `/customer/subscription`
- Admin: subscription management and adjustment queue

Order flow changes:

- Deduct credits only after server-side order validation succeeds.
- Record every credit mutation in the ledger.

Risks:

- Concurrency during simultaneous bookings.
- Refund, cancellation, and late-order handling must be exact.

### 5. Meal Credits

Business purpose:

- Represent prepaid meal entitlement independent of payment status text.

Database needs:

- `meal_credits`
- `meal_credit_transactions`

Routes:

- Public/customer: credit balance card in dashboard
- Admin: credit adjustment panel

Order flow changes:

- Server-side transaction for credit reserve/deduct.
- Credit reversal on approved cancellation if business policy allows.

Risks:

- Ledger and balance drift.
- Need database transaction boundaries.

### 6. Pause Meal System

Business purpose:

- Let subscription customers pause meals for travel, illness, or schedule changes.

Database needs:

- `meal_pauses`
- `subscriptions`
- `meal_credit_transactions`

Routes:

- Public/customer: `/customer/pauses`
- Admin: pause approval queue

Order flow changes:

- Prevent automatic meal generation or credit deduction during approved pauses.
- Enforce cutoff rules for pause requests.

Risks:

- Same-day pause abuse.
- Conflict with already accepted orders.

### 7. Feedback And Rating System

Business purpose:

- Capture meal quality and delivery feedback.

Database needs:

- `feedback`
- optional relation to `orders` and `customer_profiles`

Routes:

- Public/customer: feedback form after delivered order
- Admin: feedback moderation and low-rating queue

Order flow changes:

- Offer feedback only for completed/delivered orders.

Risks:

- Fake or duplicate feedback.
- Public testimonial consent.

### 8. Low-Rating Admin Alerts

Business purpose:

- Surface quality issues quickly to operations.

Database needs:

- `feedback`
- optional admin notification model in a later pass

Routes:

- Admin: low-rating queue or dashboard widget

Order flow changes:

- None required in the first pass beyond feedback capture.

Risks:

- Alert fatigue.
- Rating thresholds need business approval.

### 9. Customer Support And Complaint Notes

Business purpose:

- Track customer complaints and support history without relying only on WhatsApp.

Database needs:

- `support_requests`
- `customer_notes`

Routes:

- Public/customer: `/customer/support`
- Admin: support queue and customer note panel

Order flow changes:

- Allow support requests to link to an order.

Risks:

- Sensitive notes need admin-only RLS.
- Customer-visible status updates must be separated from internal notes.

## RLS And Security Design

General rules:

- Enable RLS on every new public-schema table.
- Customers can only read or write rows linked to their own `auth.uid()`.
- Admins can read operational records through `public.has_role(auth.uid(), 'admin'::public.app_role)`.
- Service role can perform trusted server-side workflows only.
- Never expose service role credentials through `VITE_` variables.
- Use append-only ledgers for credit transactions and audit-sensitive actions.
- Avoid direct customer writes to balances, subscription status, payment status, or admin notes.

## Recommended Implementation Order

1. Staging verification for current audit-log migration.
2. Customer identity foundation: `customer_profiles` and authenticated customer route protection.
3. Customer dashboard and order history using existing `orders`.
4. Repeat last order with current server validations reused.
5. Feedback table and customer feedback route.
6. Admin feedback queue and low-rating alert surface.
7. Support requests and admin customer notes.
8. Subscription wallet schema.
9. Meal credits and ledger transaction model.
10. Pause meal system.
11. Admin subscription and credit adjustment workflows.

## Cross-Cutting Risks

- Existing guest orders may not map cleanly to future customer accounts.
- Credit deductions require strong transaction boundaries.
- Pause rules must align with kitchen cutoff operations.
- Admin-only notes must not leak to customers.
- RLS policies must be tested with anon, customer, and admin users.
- Wallet and credit behavior must be reconciled with payment verification.
- Customer account features should not break current public order flow.
