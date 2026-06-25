import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { DeliveryStatus, PaymentStatus } from "./status";

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
  payment_mode: "upi" | "cod";
  payment_status: PaymentStatus;
  upi_txn_id: string | null;
  delivery_state: DeliveryStatus;
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

export type AdminActionType =
  | "payment_verified"
  | "payment_rejected"
  | "payment_marked_cod"
  | "delivery_status_changed"
  | "payment_status_changed"
  | "order_cancelled"
  | "late_order_approved"
  | "late_order_rejected"
  | "order_note_updated"
  | "zone_updated"
  | "menu_updated";

export type AdminActionLog = Tables<"admin_action_logs">;
export type AdminAuditLogQueryResult = {
  logs: AdminActionLog[];
  unavailable: boolean;
};
export type OrderAdminPatch = Pick<
  TablesUpdate<"orders">,
  "payment_status" | "payment_mode" | "delivery_state" | "admin_notes" | "is_late_request"
>;

export const AUDIT_LOG_UNAVAILABLE_MESSAGE =
  "Audit history is unavailable. Apply the audit-log migration to enable this section.";

export function isAuditLogUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { code?: string; message?: string; details?: string };
  const text = `${maybe.message ?? ""} ${maybe.details ?? ""}`.toLowerCase();
  return (
    maybe.code === "42P01" ||
    maybe.code === "PGRST205" ||
    (text.includes("admin_action_logs") &&
      (text.includes("does not exist") ||
        text.includes("could not find") ||
        text.includes("schema cache")))
  );
}

export const adminAuditLogsByOrderQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: ["admin-action-logs", "order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_action_logs")
        .select(
          "id, admin_user_id, action_type, entity_type, entity_id, order_id, old_value, new_value, note, created_at",
        )
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });
      if (error) {
        if (isAuditLogUnavailableError(error)) {
          console.warn(AUDIT_LOG_UNAVAILABLE_MESSAGE, error.message);
          return { logs: [], unavailable: true } satisfies AdminAuditLogQueryResult;
        }
        throw error;
      }
      return {
        logs: (data ?? []) as AdminActionLog[],
        unavailable: false,
      } satisfies AdminAuditLogQueryResult;
    },
    staleTime: 15_000,
  });

type AdminActionLogInsert = TablesInsert<"admin_action_logs">;

const ORDER_AUDIT_FIELDS = [
  "payment_status",
  "payment_mode",
  "delivery_state",
  "admin_notes",
  "is_late_request",
] as const;

function toJson(value: unknown): Json {
  if (value === undefined) return null;
  return value as Json;
}

function getOrderAuditValues(order: AdminOrder, patch: OrderAdminPatch) {
  const oldValue: Record<string, Json> = {};
  const newValue: Record<string, Json> = {};

  ORDER_AUDIT_FIELDS.forEach((field) => {
    if (field in patch) {
      const next = patch[field];
      if (next !== order[field]) {
        oldValue[field] = toJson(order[field]);
        newValue[field] = toJson(next);
      }
    }
  });

  return {
    oldValue: Object.keys(oldValue).length > 0 ? oldValue : null,
    newValue: Object.keys(newValue).length > 0 ? newValue : null,
  };
}

function inferOrderActionType(order: AdminOrder, patch: OrderAdminPatch): AdminActionType {
  if (
    order.is_late_request &&
    patch.is_late_request === false &&
    patch.delivery_state === "confirmed"
  ) {
    return "late_order_approved";
  }
  if (order.is_late_request && patch.delivery_state === "cancelled") {
    return "late_order_rejected";
  }
  if (patch.delivery_state === "cancelled" && order.delivery_state !== "cancelled") {
    return "order_cancelled";
  }
  if (patch.payment_mode === "cod" || patch.payment_status === "cod") {
    return "payment_marked_cod";
  }
  if (patch.payment_status === "paid" && order.payment_status !== "paid") {
    return "payment_verified";
  }
  if (patch.payment_status === "failed" && order.payment_status !== "failed") {
    return "payment_rejected";
  }
  if (patch.payment_status !== undefined && patch.payment_status !== order.payment_status) {
    return "payment_status_changed";
  }
  if (patch.delivery_state !== undefined && patch.delivery_state !== order.delivery_state) {
    return "delivery_status_changed";
  }
  if ("admin_notes" in patch && patch.admin_notes !== order.admin_notes) {
    return "order_note_updated";
  }
  return "payment_status_changed";
}

export async function logAdminAction(input: Omit<AdminActionLogInsert, "admin_user_id">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("admin_action_logs").insert({
    admin_user_id: user?.id ?? null,
    ...input,
  });

  if (error) {
    if (isAuditLogUnavailableError(error)) {
      console.warn(AUDIT_LOG_UNAVAILABLE_MESSAGE, error.message);
      return;
    }
    throw error;
  }
}

export async function updateOrderWithAudit(
  order: AdminOrder,
  patch: OrderAdminPatch,
  options: { actionType?: AdminActionType; note?: string | null } = {},
) {
  const { error } = await supabase.from("orders").update(patch).eq("id", order.id);
  if (error) throw error;

  const { oldValue, newValue } = getOrderAuditValues(order, patch);
  try {
    await logAdminAction({
      action_type: options.actionType ?? inferOrderActionType(order, patch),
      entity_type: "order",
      entity_id: order.id,
      order_id: order.id,
      old_value: oldValue,
      new_value: newValue,
      note: options.note?.trim() || null,
    });
    return { auditError: null };
  } catch (auditError) {
    return { auditError: auditError instanceof Error ? auditError : new Error(String(auditError)) };
  }
}

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
export const PLAN_QTY: Record<string, { roti: number; rice: number; dal: number; sabzi: number }> =
  {
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
