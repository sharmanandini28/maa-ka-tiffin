import { useEffect, useState } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Wallet,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaymentBadge, DeliveryBadge } from "./StatusBadge";
import { DELIVERY_FLOW, DELIVERY_NEXT } from "@/lib/status";
import { formatINR, buildWhatsAppTo, ADD_ONS } from "@/lib/brand";
import { mapsSearchLink, type AdminOrder } from "@/lib/admin-data";

export function OrderDrawer({
  order,
  open,
  onOpenChange,
  onPatch,
}: {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPatch: (id: string, patch: Record<string, unknown>) => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotes(order?.admin_notes ?? "");
  }, [order?.id, order?.admin_notes]);

  if (!order) return null;

  const wa = order.whatsapp_number || order.mobile;
  const addOnLabels = (Array.isArray(order.add_ons) ? (order.add_ons as string[]) : []).map(
    (id) => ADD_ONS.find((a) => a.id === id)?.label ?? id,
  );
  const nextStep = DELIVERY_NEXT[order.delivery_state];
  const currentIdx = DELIVERY_FLOW.indexOf(order.delivery_state as never);

  async function patch(p: Record<string, unknown>) {
    setBusy(true);
    try {
      await onPatch(order!.id, p);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-mono text-base">
            {order.order_code}
            {order.is_late_request && (
              <span className="rounded-full bg-mustard/25 px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">
                Late
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Placed {new Date(order.created_at).toLocaleString("en-IN")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-5 text-sm">
          {/* Status chips + quick actions */}
          <div className="flex flex-wrap items-center gap-2">
            <PaymentBadge status={order.payment_status} />
            <DeliveryBadge status={order.delivery_state} />
          </div>

          {/* Status timeline */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status timeline
            </p>
            <ol className="space-y-2">
              {DELIVERY_FLOW.map((s, i) => {
                const reached = currentIdx >= i && order.delivery_state !== "cancelled";
                return (
                  <li key={s} className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        reached
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {reached ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </span>
                    <span
                      className={`capitalize ${reached ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s.replace(/_/g, " ")}
                    </span>
                  </li>
                );
              })}
              {order.delivery_state === "cancelled" && (
                <li className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" /> Cancelled
                </li>
              )}
            </ol>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {nextStep && (
              <Button
                size="sm"
                variant="default"
                disabled={busy}
                onClick={() => patch({ delivery_state: nextStep.next })}
              >
                <ChevronRight className="h-4 w-4" /> {nextStep.label}
              </Button>
            )}
            {order.payment_status !== "paid" && (
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => patch({ payment_status: "paid" })}
              >
                <Wallet className="h-4 w-4" /> Mark paid
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <a
                href={buildWhatsAppTo(
                  wa,
                  `Hi ${order.customer_name}, regarding your order ${order.order_code}...`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
            {order.delivery_state !== "cancelled" && order.delivery_state !== "delivered" && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                disabled={busy}
                onClick={() => patch({ delivery_state: "cancelled" })}
              >
                <XCircle className="h-4 w-4" /> Cancel
              </Button>
            )}
          </div>

          {/* Customer */}
          <Section title="Customer">
            <Row label="Name" value={order.customer_name} />
            <Row label="Mobile" value={order.mobile} />
            {order.whatsapp_number && <Row label="WhatsApp" value={order.whatsapp_number} />}
            {order.email && <Row label="Email" value={order.email} />}
            <div className="mt-2 flex gap-2">
              <Button asChild size="sm" variant="ghost" className="px-2">
                <a href={`tel:${order.mobile}`}>
                  <Phone className="h-4 w-4" /> Call
                </a>
              </Button>
            </div>
          </Section>

          {/* Address */}
          <Section title="Delivery address">
            <p className="text-foreground">{order.address}</p>
            {order.landmark && <p className="text-muted-foreground">Landmark: {order.landmark}</p>}
            <Row label="Sector" value={order.sector} />
            <Button asChild size="sm" variant="ghost" className="mt-2 px-2">
              <a
                href={order.maps_link || mapsSearchLink(`${order.address} ${order.sector} Noida`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" /> Open in Maps
              </a>
            </Button>
          </Section>

          {/* Meal */}
          <Section title="Meal details">
            <Row label="Meal" value={order.meal} capitalize />
            <Row label="Date" value={order.delivery_date} />
            <Row label="Plan" value={`${order.plan_name} × ${order.quantity}`} />
            <Row label="Spice" value={order.spice_pref} capitalize />
            <Row label="Rice" value={order.rice_pref ? "Yes" : "No"} />
            {order.extra_roti > 0 && <Row label="Extra roti" value={String(order.extra_roti)} />}
            {addOnLabels.length > 0 && <Row label="Add-ons" value={addOnLabels.join(", ")} />}
            {order.special_note && <Row label="Note" value={order.special_note} />}
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <Row label="Mode" value={order.payment_mode.toUpperCase()} />
            <Row label="Status" value={order.payment_status} capitalize />
            {order.upi_txn_id && <Row label="UPI Txn ID" value={order.upi_txn_id} />}
            <Row label="Total" value={formatINR(order.total)} />
          </Section>

          {/* Admin notes */}
          <Section title="Admin notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes (not shown to customer)"
            />
            <Button
              size="sm"
              variant="mustard"
              className="mt-2"
              disabled={savingNotes}
              onClick={async () => {
                setSavingNotes(true);
                await onPatch(order.id, { admin_notes: notes.trim() || null });
                setSavingNotes(false);
              }}
            >
              {savingNotes ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save notes
            </Button>
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}
