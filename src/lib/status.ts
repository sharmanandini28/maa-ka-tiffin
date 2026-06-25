// Shared status configuration for orders — payment + delivery.
// Used by the admin panel and the order confirmation flow.

export type PaymentStatus =
  | "pending"
  | "paid"
  | "partial"
  | "cod"
  | "refunded"
  | "failed";

export type DeliveryStatus =
  | "received"
  | "confirmed"
  | "cooking"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string; chip: string }[] = [
  { value: "pending", label: "Pending", chip: "bg-mustard/25 text-foreground" },
  { value: "paid", label: "Paid", chip: "bg-primary/15 text-primary" },
  { value: "partial", label: "Partial", chip: "bg-terracotta/20 text-foreground" },
  { value: "cod", label: "COD", chip: "bg-secondary text-secondary-foreground" },
  { value: "refunded", label: "Refunded", chip: "bg-muted text-muted-foreground" },
  { value: "failed", label: "Failed", chip: "bg-destructive/15 text-destructive" },
];

// Ordered operational flow (used for the status timeline)
export const DELIVERY_FLOW: DeliveryStatus[] = [
  "received",
  "confirmed",
  "cooking",
  "packed",
  "out_for_delivery",
  "delivered",
];

export const DELIVERY_STATUSES: {
  value: DeliveryStatus;
  label: string;
  chip: string;
}[] = [
  { value: "received", label: "Received", chip: "bg-muted text-muted-foreground" },
  { value: "confirmed", label: "Confirmed", chip: "bg-secondary text-secondary-foreground" },
  { value: "cooking", label: "Cooking", chip: "bg-mustard/25 text-foreground" },
  { value: "packed", label: "Packed", chip: "bg-terracotta/20 text-foreground" },
  { value: "out_for_delivery", label: "Out for delivery", chip: "bg-primary/15 text-primary" },
  { value: "delivered", label: "Delivered", chip: "bg-primary text-primary-foreground" },
  { value: "cancelled", label: "Cancelled", chip: "bg-destructive/15 text-destructive" },
];

export function paymentMeta(value: string) {
  return (
    PAYMENT_STATUSES.find((p) => p.value === value) ?? {
      value,
      label: value,
      chip: "bg-muted text-muted-foreground",
    }
  );
}

export function deliveryMeta(value: string) {
  return (
    DELIVERY_STATUSES.find((d) => d.value === value) ?? {
      value,
      label: value.replace(/_/g, " "),
      chip: "bg-muted text-muted-foreground",
    }
  );
}

// Next-step action shown in the admin row / drawer
export const DELIVERY_NEXT: Record<string, { next: DeliveryStatus; label: string } | null> = {
  received: { next: "confirmed", label: "Confirm" },
  confirmed: { next: "cooking", label: "Start cooking" },
  cooking: { next: "packed", label: "Mark packed" },
  packed: { next: "out_for_delivery", label: "Out for delivery" },
  out_for_delivery: { next: "delivered", label: "Mark delivered" },
  delivered: null,
  cancelled: null,
};
