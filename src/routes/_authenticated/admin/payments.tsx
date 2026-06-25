import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Wallet, Clock, Check, X, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminOrdersQueryOptions, type AdminOrder } from "@/lib/admin-data";
import { formatINR, buildWhatsAppTo } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { PaymentBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery(adminOrdersQueryOptions);

  const upiPending = useMemo(
    () => orders.filter((o) => o.payment_mode === "upi" && o.payment_status === "pending"),
    [orders],
  );
  const lateRequests = useMemo(
    () => orders.filter((o) => o.is_late_request && o.delivery_state === "received"),
    [orders],
  );

  async function patch(id: string, p: Record<string, unknown>, msg: string) {
    const { error } = await supabase
      .from("orders")
      .update(p as never)
      .eq("id", id);
    if (error) {
      toast.error("Update failed: " + error.message);
      return;
    }
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Payments & Requests</h1>
        <p className="text-sm text-muted-foreground">Verify UPI payments and approve late orders.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Payment verification queue */}
          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-3">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                <Wallet className="h-5 w-5 text-primary" /> Payment Verification Queue
              </h2>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {upiPending.length}
              </span>
            </div>
            {upiPending.length === 0 ? (
              <EmptyState icon={CheckCircle2} text="All UPI payments are verified. Nothing pending." />
            ) : (
              <div className="divide-y divide-border">
                {upiPending.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="min-w-[160px]">
                      <p className="font-mono text-xs font-semibold text-foreground">{o.order_code}</p>
                      <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{o.mobile}</p>
                    </div>
                    <div className="min-w-[140px] text-sm">
                      <p className="text-muted-foreground">UPI Txn ID</p>
                      <p className="font-medium text-foreground">{o.upi_txn_id || <span className="text-muted-foreground">— not provided</span>}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-serif text-lg font-bold text-primary">{formatINR(o.total)}</p>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <PaymentBadge status={o.payment_status} />
                      <Button size="sm" variant="default" onClick={() => patch(o.id, { payment_status: "paid" }, "Marked verified")}>
                        <Check className="h-4 w-4" /> Verify
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => patch(o.id, { payment_status: "failed" }, "Marked failed")}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => patch(o.id, { payment_mode: "cod", payment_status: "cod" }, "Switched to COD")}>
                        COD
                      </Button>
                      <a
                        href={buildWhatsAppTo(o.whatsapp_number || o.mobile, `Hi ${o.customer_name}, we couldn't verify your UPI payment for ${o.order_code}. Could you share the screenshot?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-secondary"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Late order requests */}
          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-3">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                <Clock className="h-5 w-5 text-terracotta" /> Late Order Requests
              </h2>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {lateRequests.length}
              </span>
            </div>
            {lateRequests.length === 0 ? (
              <EmptyState icon={CheckCircle2} text="No pending late order requests." />
            ) : (
              <div className="divide-y divide-border">
                {lateRequests.map((o) => (
                  <LateRow key={o.id} o={o} onPatch={patch} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function LateRow({
  o,
  onPatch,
}: {
  o: AdminOrder;
  onPatch: (id: string, p: Record<string, unknown>, msg: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
      <div className="min-w-[160px]">
        <p className="font-mono text-xs font-semibold text-foreground">{o.order_code}</p>
        <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
        <p className="text-xs text-muted-foreground">{o.mobile} · {o.sector}</p>
      </div>
      <div className="text-sm">
        <p className="text-muted-foreground">Requested</p>
        <p className="font-medium capitalize text-foreground">{o.meal} · {o.delivery_date}</p>
      </div>
      <div className="text-sm">
        <p className="text-muted-foreground">Qty / Amount</p>
        <p className="font-medium text-foreground">{o.quantity} · {formatINR(o.total)}</p>
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button size="sm" variant="default" onClick={() => onPatch(o.id, { is_late_request: false, delivery_state: "confirmed" }, "Late order approved")}>
          <Check className="h-4 w-4" /> Approve
        </Button>
        <Button size="sm" variant="outline" className="text-destructive" onClick={() => onPatch(o.id, { delivery_state: "cancelled" }, "Late order rejected")}>
          <X className="h-4 w-4" /> Reject
        </Button>
        <a
          href={buildWhatsAppTo(o.whatsapp_number || o.mobile, `Hi ${o.customer_name}, about your late ${o.meal} request (${o.order_code}) for ${o.delivery_date}...`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-secondary"
          title="WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Wallet; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Icon className="h-8 w-8 text-primary/60" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
