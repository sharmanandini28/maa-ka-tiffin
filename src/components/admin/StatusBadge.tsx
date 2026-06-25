import { paymentMeta, deliveryMeta } from "@/lib/status";

export function PaymentBadge({ status }: { status: string }) {
  const m = paymentMeta(status);
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.chip}`}>
      {m.label}
    </span>
  );
}

export function DeliveryBadge({ status }: { status: string }) {
  const m = deliveryMeta(status);
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.chip}`}>
      {m.label}
    </span>
  );
}
