/**
 * Central runtime configuration & environment validation.
 *
 * This is the single source of truth for reading environment variables on the
 * client. It NEVER throws at import time so the public marketing site keeps
 * loading even when backend config is missing. Database/admin features check
 * `isSupabaseConfigured` and degrade gracefully instead of crashing the app.
 *
 * SECURITY: only the public anon/publishable key is read on the client.
 * The service-role key must never be referenced in browser code.
 */

function readEnv(key: string): string | undefined {
  // Vite inlines import.meta.env.* at build time for client bundles.
  const viteVal = (import.meta.env as Record<string, string | undefined>)[key];
  if (viteVal && viteVal.trim().length > 0) return viteVal.trim();
  // SSR fallback (server-only). process may be undefined in the browser.
  if (typeof process !== "undefined" && process.env) {
    const procVal = process.env[key];
    if (procVal && procVal.trim().length > 0) return procVal.trim();
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Supabase client config (public/anon only)                          */
/* ------------------------------------------------------------------ */

export const supabaseConfig = {
  url: readEnv("VITE_SUPABASE_URL") ?? readEnv("SUPABASE_URL"),
  publishableKey:
    readEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ?? readEnv("SUPABASE_PUBLISHABLE_KEY"),
} as const;

/** True only when both public Supabase values are present. */
export const isSupabaseConfigured = Boolean(
  supabaseConfig.url && supabaseConfig.publishableKey,
);

/* ------------------------------------------------------------------ */
/* Public site config                                                 */
/* ------------------------------------------------------------------ */

export const siteConfig = {
  siteUrl:
    readEnv("VITE_SITE_URL") ?? "https://maa-ka-tiffin.lovable.app",
  name: "Maa Jaisa Tiffin",
} as const;

/* ------------------------------------------------------------------ */
/* Admin / backend config                                             */
/* ------------------------------------------------------------------ */

export const adminConfig = {
  allowAdminSignup: readEnv("VITE_ALLOW_ADMIN_SIGNUP") === "true",
} as const;

/* ------------------------------------------------------------------ */
/* Graceful-degradation copy                                          */
/* ------------------------------------------------------------------ */

export const CONFIG_MESSAGES = {
  ordering:
    "Ordering is temporarily unavailable. Please contact us on WhatsApp to place your order.",
  admin: "Admin backend is not configured yet.",
} as const;

/**
 * Emit a one-time developer warning (console only, never a crash) when
 * optional backend config is missing. Public pages keep working.
 */
let warned = false;
export function warnIfBackendMissing(): void {
  if (warned || isSupabaseConfigured) return;
  warned = true;
  console.warn(
    "[config] Supabase backend is not configured. Public pages will render " +
      "with static content; ordering and admin features are disabled until " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.",
  );
}
