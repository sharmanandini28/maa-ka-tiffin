import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Wallet, Clock, Check, X, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminOrdersQueryOptions,
  updateOrderWithAudit,
  type AdminOrder,
  type AdminActionType,
  type OrderAdminPatch,
} from "@/lib/admin-data";
import { formatINR, buildWhatsAppTo } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { PaymentBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery(adminOrdersQueryOptions);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const upiPending = useMemo(
    () => orders.filter((o) => o.payment_mode === "upi" && o.payment_status === "pending"),
    [orders],
  );
  const lateRequests = useMemo(
    () => orders.filter((o) => o.is_late_request && o.delivery_state === "received"),
    [orders],
  );

  async function patch(
    order: AdminOrder,
    p: OrderAdminPatch,
    msg: string,
    options: { actionType?: AdminActionType; note?: string | null; confirm?: string } = {},
  ) {
    if (options.confirm && !window.confirm(options.confirm)) return;

    const actionKey = `${order.id}:${options.actionType ?? Object.keys(p).join(",")}`;
    setPendingAction(actionKey);
    try {
      const { auditError } = await updateOrderWithAudit(order, p, {
        actionType: options.actionType,
        note: options.note,
      });
      toast.success(msg);
      if (auditError) toast.warning("Updated, but audit log failed: " + auditError.message);
      await qc.invalidateQueries({ queryKey: ["admin-orders"] });
      await qc.invalidateQueries({ queryKey: ["admin-action-logs"] });
    } catch (error) {
      toast.error("Update failed: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setPendingAction(null);
    }
  }

  function isPending(order: AdminOrder, actionType: AdminActionType) {
    return pendingAction === `${order.id}:${actionType}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Payments & Requests</h1>
        <p className="text-sm text-muted-foreground">
          Verify UPI payments and approve late orders.
        </p>
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
              <EmptyState
                icon={CheckCircle2}
                text="All UPI payments are verified. Nothing pending."
              />
            ) : (
              <div className="divide-y divide-border">
                {upiPending.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="min-w-[160px]">
                      <p className="font-mono text-xs font-semibold text-foreground">
                        {o.order_code}
                      </p>
                      <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{o.mobile}</p>
                    </div>
                    <div className="min-w-[140px] text-sm">
                      <p className="text-muted-foreground">UPI Txn ID</p>
                      <p className="font-medium text-foreground">
                        {o.upi_txn_id || (
                          <span className="text-muted-foreground">— not provided</span>
                        )}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-serif text-lg font-bold text-primary">
                        {formatINR(o.total)}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <PaymentBadge status={o.payment_status} />
                      <Button
                        size="sm"
                        variant="default"
                        disabled={pendingAction !== null}
                        onClick={() =>
                          patch(o, { payment_status: "paid" }, "Marked verified", {
                            actionType: "payment_verified",
                            confirm: `Verify UPI payment for ${o.order_code}?`,
                          })
                        }
                      >
                        {isPending(o, "payment_verified") ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pendingAction !== null}
                        onClick={() => {
                          if (!window.confirm(`Reject UPI payment for ${o.order_code}?`)) return;
                          const note =
                            window.prompt(
                              `Optional admin note for rejecting ${o.order_code}:`,
                              "",
                            ) ?? null;
                          void patch(o, { payment_status: "failed" }, "Marked failed", {
                            actionType: "payment_rejected",
                            note,
                          });
                        }}
                      >
                        {isPending(o, "payment_rejected") ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pendingAction !== null}
                        onClick={() =>
                          patch(
                            o,
                            { payment_mode: "cod", payment_status: "cod" },
                            "Switched to COD",
                            {
                              actionType: "payment_marked_cod",
                              confirm: `Switch ${o.order_code} to COD?`,
                            },
                          )
                        }
                      >
                        {isPending(o, "payment_marked_cod") ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        COD
                      </Button>
                      <a
                        href={buildWhatsAppTo(
                          o.whatsapp_number || o.mobile,
                          `Hi ${o.customer_name}, we couldn't verify your UPI payment for ${o.order_code}. Could you share the screenshot?`,
                        )}
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
                  <LateRow key={o.id} o={o} onPatch={patch} pendingAction={pendingAction} />
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
  pendingAction,
}: {
  o: AdminOrder;
  onPatch: (
    order: AdminOrder,
    p: OrderAdminPatch,
    msg: string,
    options?: { actionType?: AdminActionType; note?: string | null; confirm?: string },
  ) => Promise<void>;
  pendingAction: string | null;
}) {
  const approving = pendingAction === `${o.id}:late_order_approved`;
  const rejecting = pendingAction === `${o.id}:late_order_rejected`;

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
      <div className="min-w-[160px]">
        <p className="font-mono text-xs font-semibold text-foreground">{o.order_code}</p>
        <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
        <p className="text-xs text-muted-foreground">
          {o.mobile} · {o.sector}
        </p>
      </div>
      <div className="text-sm">
        <p className="text-muted-foreground">Requested</p>
        <p className="font-medium capitalize text-foreground">
          {o.meal} · {o.delivery_date}
        </p>
      </div>
      <div className="text-sm">
        <p className="text-muted-foreground">Qty / Amount</p>
        <p className="font-medium text-foreground">
          {o.quantity} · {formatINR(o.total)}
        </p>
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="default"
          disabled={pendingAction !== null}
          onClick={() =>
            onPatch(
              o,
              { is_late_request: false, delivery_state: "confirmed" },
              "Late order approved",
              {
                actionType: "late_order_approved",
                confirm: `Approve late request ${o.order_code}?`,
              },
            )
          }
        >
          {approving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive"
          disabled={pendingAction !== null}
          onClick={() => {
            if (!window.confirm(`Reject late request ${o.order_code}?`)) return;
            const note =
              window.prompt(`Optional admin note for rejecting ${o.order_code}:`, "") ?? null;
            void onPatch(o, { delivery_state: "cancelled" }, "Late order rejected", {
              actionType: "late_order_rejected",
              note,
            });
          }}
        >
          {rejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          Reject
        </Button>
        <a
          href={buildWhatsAppTo(
            o.whatsapp_number || o.mobile,
            `Hi ${o.customer_name}, about your late ${o.meal} request (${o.order_code}) for ${o.delivery_date}...`,
          )}
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
