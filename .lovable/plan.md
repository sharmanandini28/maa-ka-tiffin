# Maa Jaisa Tiffin — MVP Build Plan

A pre-order home-style tiffin platform for Noida. Public marketing site + order flow with strict cutoff logic, plus an admin dashboard. Backed by Lovable Cloud (database + admin auth). Visual direction follows the three uploaded concepts exactly.

## Design System

Pulled from the mockups — warm, trust-based, home-food feel (not a restaurant app).

- **Palette**: cream/off-white background, deep forest green (primary), warm mustard-yellow (CTAs/accents), terracotta/rust (secondary accents), earthy brown text. All defined as `oklch` tokens in `src/styles.css`.
- **Type**: elegant serif for display headings (hero, section titles), clean sans for body — loaded via `@fontsource` packages.
- **Motifs**: subtle block-print border patterns, leaf/sprig icons, rounded cards with soft shadows.
- Mobile-first, fast, clear CTAs.

## Backend (Lovable Cloud)

Enable Cloud, then create these tables with RLS + grants:

- `menu_items` — daily/weekly menu (date, meal type lunch/dinner, dish list, tagline). Public read.
- `plans` — Basic / Standard / Premium (name, price, period, item list, popular flag). Public read.
- `orders` — customer name, mobile, email, meal type, delivery date, plan, quantity, add-ons, spice/roti/rice prefs, full address, landmark, sector, maps link, payment mode, payment status, delivery status, special note, total, order code, created_at. Public INSERT (anyone can place an order); admin-only SELECT/UPDATE.
- `app_role` enum + `user_roles` table + `has_role()` security-definer function for admin gating.

Order writes go through a `createServerFn` that re-validates cutoff rules server-side and generates the order code (`MJT250518001` style). Admin reads/updates go through authenticated server functions gated by `has_role(uid,'admin')`.

## Cutoff Logic (shared util, enforced client + server)

- **Lunch** for date D: allowed only if now < midnight (00:00) of D (i.e. book by the night before). 
- **Dinner** for date D: allowed only if now < 12:00 PM of D.
- **Future dates** (more than 1 day out, up to 7 days): always allowed.
- After cutoff: block submission and show the WhatsApp "late order" message instead.
- Live countdown timers on hero + order form.

## Public Pages (routes under `src/routes/`)

- `/` Home — hero (Noida me ghar jaisa shuddh tiffin, 3 trust badges, Order/View Menu/Subscribe CTAs, booking cut-off card), today/tomorrow menu preview with Lunch/Dinner toggle, plans section, Khet Se Rasoi Tak band, booking-rule timeline, footer ribbon.
- `/menu` — weekly menu calendar (Mon–Sun, lunch + dinner) with the "menu may change seasonally" note.
- `/plans` — Basic / Standard / Premium cards (Standard highlighted as Most Popular) + trial/weekly/monthly info.
- `/order` — full order form (all PRD fields: contact, meal type, date picker with cutoff validation, plan, quantity, add-ons, prefs, address + sector + Google Maps link, payment mode UPI/COD, note, terms). On submit → save to DB → confirmation screen with order code + pre-filled WhatsApp confirm button.
- `/khet-se-rasoi-tak` — farm-to-tiffin trust story.
- `/hygiene` — hygiene promise.
- `/contact` — contact + WhatsApp.
- `/faq` — accordion.
- `/cancellation-policy`, `/terms`, `/privacy` — policy pages.
- Each route gets its own SEO `head()` (title/description/og) targeting the PRD's Noida tiffin keywords. Shared header nav + footer.

## Payment (MVP)

- Order form offers **UPI QR / manual UPI** and **Cash on Delivery**.
- A UPI QR image + UPI ID shown on the confirmation step for prepaid orders.
- Admin marks actual payment status (Pending/Paid/COD/etc.).

## Admin Panel (under `/admin`, behind login)

- `/auth` admin login (email/password). `_authenticated/admin` subtree gated by admin role.
- **Dashboard** — stat cards (today lunch, today dinner, tomorrow lunch, pending payments), date-wise orders table with filters (date, meal, sector, payment status, delivery status), Export CSV, Kitchen Quantity Summary (auto-computed roti/rice/dal/sabzi/packaging from per-plan config), Sector-wise Delivery Grouping. Matches the dashboard mockup layout.
- **Orders** — view/edit, update payment status and delivery status (received → confirmed → cooking → packed → out for delivery → delivered / cancelled).
- **Menu** — create/update daily & weekly menu items.
- CSV export of the filtered order list.

## Out of scope for this MVP (Phase 2, noted for later)

Customer login/accounts, monthly subscription + meal-credit wallet, pause meals, referral system, automated feedback collection, online payment gateway, corporate plan workflow. Static/marketing versions of these concepts may appear on the site, but no backend logic yet.

## Technical Notes

- Stack: TanStack Start (existing template), Tailwind v4 tokens, shadcn components, Lovable Cloud (Supabase).
- Order creation + admin reads via `createServerFn`; cutoff re-validated server-side.
- Seed initial plans + a sample weekly menu via migration so the site looks real on first load.
- WhatsApp confirmation = pre-filled `wa.me` deep link generated from order details.

I'll start by enabling Cloud and setting up the schema + design tokens, then build public pages, the order flow, and finally the admin dashboard.