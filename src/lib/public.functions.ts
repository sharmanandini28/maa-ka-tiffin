import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
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

export const getZones = createServerFn({ method: "GET" }).handler(
  async (): Promise<ZoneDTO[]> => {
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
  },
);
