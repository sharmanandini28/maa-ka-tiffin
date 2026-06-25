import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Full order shape read by the admin operations console (RLS: admin-only).
export type AdminOrder = {
  id: string;
  order_code: string;
  customer_name: string;
  mobile: string;
  whatsapp_number: string | null;
  email: string | null;
  meal: "lunch" | "dinner";
  delivery_date: string;
  plan_slug: string;
  plan_name: string;
  quantity: number;
  add_ons: unknown;
  spice_pref: string;
  rice_pref: boolean;
  extra_roti: number;
  address: string;
  landmark: string | null;
  sector: string;
  maps_link: string | null;
  payment_mode: string;
  payment_status: string;
  payment_proof: string | null;
  upi_txn_id: string | null;
  delivery_state: string;
  special_note: string | null;
  admin_notes: string | null;
  is_late_request: boolean;
  total: number;
  created_at: string;
};

const ORDER_COLS =
  "id, order_code, customer_name, mobile, whatsapp_number, email, meal, delivery_date, plan_slug, plan_name, quantity, add_ons, spice_pref, rice_pref, extra_roti, address, landmark, sector, maps_link, payment_mode, payment_status, upi_txn_id, delivery_state, special_note, admin_notes, is_late_request, total, created_at";

export const adminOrdersQueryOptions = queryOptions({
  queryKey: ["admin-orders"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_COLS)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as AdminOrder[];
  },
  staleTime: 15_000,
});

export type AdminZone = {
  id: string;
  sector: string;
  active: boolean;
  delivery_fee: number;
  min_qty: number;
  meals: string;
  subscription_only: boolean;
  cod_allowed: boolean;
  sort_order: number;
};

export const adminZonesQueryOptions = queryOptions({
  queryKey: ["admin-zones"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as AdminZone[];
  },
  staleTime: 60_000,
});

// Per-plan portion footprint used for the kitchen quantity summary.
export const PLAN_QTY: Record<string, { roti: number; rice: number; dal: number; sabzi: number }> = {
  basic: { roti: 4, rice: 1, dal: 1, sabzi: 1 },
  standard: { roti: 5, rice: 1, dal: 1, sabzi: 2 },
  premium: { roti: 6, rice: 1, dal: 1, sabzi: 2 },
};

export function computeKitchen(orders: AdminOrder[], bufferPct = 0) {
  let roti = 0,
    rice = 0,
    dal = 0,
    sabzi = 0,
    sets = 0;
  const addOns = new Map<string, number>();
  orders.forEach((o) => {
    const q = PLAN_QTY[o.plan_slug] ?? PLAN_QTY.standard;
    roti += q.roti * o.quantity + (o.extra_roti ?? 0);
    rice += q.rice * o.quantity;
    dal += q.dal * o.quantity;
    sabzi += q.sabzi * o.quantity;
    sets += o.quantity;
    const list = Array.isArray(o.add_ons) ? (o.add_ons as string[]) : [];
    list.forEach((id) => addOns.set(id, (addOns.get(id) ?? 0) + o.quantity));
  });
  const buf = (n: number) => Math.ceil(n * (1 + bufferPct / 100));
  return {
    raw: { roti, rice, dal, sabzi, sets },
    final: { roti: buf(roti), rice: buf(rice), dal: buf(dal), sabzi: buf(sabzi), sets: buf(sets) },
    addOns: Array.from(addOns.entries()).sort((a, b) => b[1] - a[1]),
  };
}

// Build a Google Maps multi-stop route link from order maps links / sectors.
export function buildRouteLink(orders: AdminOrder[]): string {
  const points = orders
    .map((o) => o.maps_link?.trim())
    .filter((x): x is string => Boolean(x))
    .slice(0, 9);
  if (points.length === 0) return "";
  return `https://www.google.com/maps/dir/${points.map((p) => encodeURIComponent(p)).join("/")}`;
}

export function mapsSearchLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
