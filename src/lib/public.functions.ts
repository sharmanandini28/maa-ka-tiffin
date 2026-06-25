import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  PAYMENT_INSTRUCTION_TEXT,
  PAYMENT_PAYEE_NAME,
  PAYMENT_SCREENSHOT_INSTRUCTION,
  PAYMENT_TRANSACTION_ID_REQUIRED,
  PAYMENT_UPI_ENABLED,
  PAYMENT_UPI_ID,
} from "./brand";

function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export interface PlanDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  period: string;
  items: string[];
  is_popular: boolean;
}

export interface MenuDTO {
  menu_date: string;
  meal: "lunch" | "dinner";
  weekday: number | null;
  dishes: string;
  descriptor: string | null;
}

export const getPlans = createServerFn({ method: "GET" }).handler(async (): Promise<PlanDTO[]> => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("plans")
    .select("id, slug, name, tagline, price, period, items, is_popular")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getPlans error", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({
    ...p,
    items: Array.isArray(p.items) ? (p.items as string[]) : [],
  }));
});

export const getWeekMenu = createServerFn({ method: "GET" }).handler(
  async (): Promise<MenuDTO[]> => {
    const supabase = publicClient();
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("menu_items")
      .select("menu_date, meal, weekday, dishes, descriptor")
      .gte("menu_date", start)
      .lte("menu_date", end)
      .order("menu_date", { ascending: true });
    if (error) {
      console.error("getWeekMenu error", error.message);
      return [];
    }
    return data ?? [];
  },
);

export interface ZoneDTO {
  sector: string;
  delivery_fee: number;
  min_qty: number;
  meals: string;
  subscription_only: boolean;
  cod_allowed: boolean;
}

export interface PaymentSettingsDTO {
  id: string | null;
  upi_id: string;
  payee_name: string;
  payment_instructions: string;
  screenshot_instructions: string;
  transaction_id_required: boolean;
  upi_enabled: boolean;
  is_active: boolean;
  unavailable: boolean;
  using_placeholder: boolean;
}

export const PAYMENT_SETTINGS_UNAVAILABLE_MESSAGE =
  "Payment settings table is unavailable. Apply the payment-settings migration to enable admin-managed UPI settings.";

export function fallbackPaymentSettings(
  unavailable = false,
  usingPlaceholder = PAYMENT_UPI_ID === "your-upi-id@bank",
): PaymentSettingsDTO {
  return {
    id: null,
    upi_id: PAYMENT_UPI_ID,
    payee_name: PAYMENT_PAYEE_NAME,
    payment_instructions: PAYMENT_INSTRUCTION_TEXT,
    screenshot_instructions: PAYMENT_SCREENSHOT_INSTRUCTION,
    transaction_id_required: PAYMENT_TRANSACTION_ID_REQUIRED,
    upi_enabled: PAYMENT_UPI_ENABLED,
    is_active: true,
    unavailable,
    using_placeholder: usingPlaceholder,
  };
}

export function isPaymentSettingsUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { code?: string; message?: string; details?: string };
  const text = `${maybe.message ?? ""} ${maybe.details ?? ""}`.toLowerCase();
  return (
    maybe.code === "42P01" ||
    maybe.code === "PGRST205" ||
    (text.includes("payment_settings") &&
      (text.includes("does not exist") ||
        text.includes("could not find") ||
        text.includes("schema cache")))
  );
}

function mapPaymentSettings(row: {
  id: string;
  upi_id: string;
  payee_name: string;
  payment_instructions: string | null;
  screenshot_instructions: string | null;
  transaction_id_required: boolean | null;
  upi_enabled: boolean | null;
  is_active: boolean | null;
}): PaymentSettingsDTO {
  return {
    id: row.id,
    upi_id: row.upi_id,
    payee_name: row.payee_name,
    payment_instructions: row.payment_instructions || PAYMENT_INSTRUCTION_TEXT,
    screenshot_instructions: row.screenshot_instructions || PAYMENT_SCREENSHOT_INSTRUCTION,
    transaction_id_required: Boolean(row.transaction_id_required),
    upi_enabled: row.upi_enabled ?? true,
    is_active: row.is_active ?? true,
    unavailable: false,
    using_placeholder: row.upi_id === "your-upi-id@bank",
  };
}

export const getZones = createServerFn({ method: "GET" }).handler(async (): Promise<ZoneDTO[]> => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("sector, delivery_fee, min_qty, meals, subscription_only, cod_allowed")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getZones error", error.message);
    return [];
  }
  return data ?? [];
});

export const getActivePaymentSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<PaymentSettingsDTO> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("payment_settings")
      .select(
        "id, upi_id, payee_name, payment_instructions, screenshot_instructions, transaction_id_required, upi_enabled, is_active",
      )
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (isPaymentSettingsUnavailableError(error)) {
        console.warn(PAYMENT_SETTINGS_UNAVAILABLE_MESSAGE, error.message);
        return fallbackPaymentSettings(true);
      }
      console.error("getActivePaymentSettings error", error.message);
      return fallbackPaymentSettings(false);
    }

    return data ? mapPaymentSettings(data) : fallbackPaymentSettings(false);
  },
);
