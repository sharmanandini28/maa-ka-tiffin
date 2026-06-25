import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkCutoff, INDIA_TIME_ZONE } from "./cutoff";
import { ADD_ONS, DAILY_PRICES, EXTRA_ROTI_PRICE } from "./brand";

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid WhatsApp number")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  meal: z.enum(["lunch", "dinner"]),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  plan_slug: z.enum(["basic", "standard", "premium"]),
  quantity: z.number().int().min(1).max(20),
  add_ons: z.array(z.string()).max(12),
  spice_pref: z.enum(["normal", "less", "extra"]),
  rice_pref: z.boolean(),
  extra_roti: z.number().int().min(0).max(10),
  address: z.string().trim().min(8).max(400),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  sector: z.string().trim().min(2).max(60),
  maps_link: z.string().trim().max(400).optional().or(z.literal("")),
  payment_mode: z.enum(["upi", "cod"]),
  upi_txn_id: z.string().trim().max(60).optional().or(z.literal("")),
  special_note: z.string().trim().max(400).optional().or(z.literal("")),
  late_request: z.boolean().optional().default(false),
});

export type OrderInput = z.infer<typeof orderSchema>;

export interface OrderResultDTO {
  order_code: string;
  customer_name: string;
  mobile: string;
  meal: string;
  delivery_date: string;
  plan_name: string;
  quantity: number;
  total: number;
  delivery_fee: number;
  payment_mode: string;
  payment_status: string;
  upi_txn_id: string | null;
  is_late_request: boolean;
}

const PLAN_NAMES: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

function orderTimestampParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: INDIA_TIME_ZONE,
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    yymmdd: `${get("year")}${get("month")}${get("day")}`,
    hhmmss: `${get("hour")}${get("minute")}${get("second")}`,
  };
}

function randomOrderSuffix(length = 4): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function generateOrderCode(now = new Date()): string {
  const { yymmdd, hhmmss } = orderTimestampParts(now);
  return `MJT-${yymmdd}-${hhmmss}-${randomOrderSuffix()}`;
}

export const createOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }): Promise<OrderResultDTO> => {
    const isLate = Boolean(data.late_request);

    // Re-validate cutoff on the server — never trust the client clock.
    // Late requests bypass the hard cutoff but are flagged for manual approval.
    if (!isLate) {
      const cutoff = checkCutoff(data.meal, data.delivery_date);
      if (!cutoff.allowed) {
        throw new Error(cutoff.reason ?? "Booking window closed for this meal.");
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Validate delivery zone (active / meals / COD / min qty) and read its fee.
    let deliveryFee = 0;
    const { data: zone } = await supabaseAdmin
      .from("delivery_zones")
      .select("active, delivery_fee, min_qty, meals, cod_allowed")
      .eq("sector", data.sector)
      .maybeSingle();

    if (!zone?.active) {
      throw new Error(
        "Delivery is not available in this sector yet. Please contact us on WhatsApp.",
      );
    }
    if (zone.meals !== "both" && zone.meals !== data.meal) {
      throw new Error(`This sector currently has ${zone.meals} delivery only.`);
    }
    if (data.payment_mode === "cod" && !zone.cod_allowed) {
      throw new Error("Cash on Delivery is not available for this sector. Please use UPI.");
    }
    if (data.quantity < zone.min_qty) {
      throw new Error(`Minimum ${zone.min_qty} tiffin(s) required for this sector.`);
    }
    deliveryFee = zone.delivery_fee ?? 0;

    // Recompute total server-side.
    const base = DAILY_PRICES[data.plan_slug] ?? 0;
    const addOnTotal = data.add_ons.reduce((sum, id) => {
      const a = ADD_ONS.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);
    const total =
      base * data.quantity + addOnTotal + data.extra_roti * EXTRA_ROTI_PRICE + deliveryFee;

    const order_code = generateOrderCode();

    const payment_status = data.payment_mode === "cod" ? "cod" : "pending";

    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code,
        customer_name: data.customer_name,
        mobile: data.mobile,
        whatsapp_number: data.whatsapp_number || null,
        email: data.email || null,
        meal: data.meal,
        delivery_date: data.delivery_date,
        plan_slug: data.plan_slug,
        plan_name: PLAN_NAMES[data.plan_slug] ?? data.plan_slug,
        quantity: data.quantity,
        add_ons: data.add_ons,
        spice_pref: data.spice_pref,
        rice_pref: data.rice_pref,
        extra_roti: data.extra_roti,
        address: data.address,
        landmark: data.landmark || null,
        sector: data.sector,
        maps_link: data.maps_link || null,
        payment_mode: data.payment_mode,
        payment_status: payment_status as "pending" | "cod",
        upi_txn_id: data.upi_txn_id || null,
        special_note: data.special_note || null,
        is_late_request: isLate,
        total,
      })
      .select(
        "order_code, customer_name, mobile, meal, delivery_date, plan_name, quantity, total, payment_mode, payment_status, upi_txn_id, is_late_request",
      )
      .single();

    if (error || !inserted) {
      console.error("createOrder insert error", error?.message);
      throw new Error("Could not place your order. Please try again or WhatsApp us.");
    }

    return { ...inserted, delivery_fee: deliveryFee } as OrderResultDTO;
  });
