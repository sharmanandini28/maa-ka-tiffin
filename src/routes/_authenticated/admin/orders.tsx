import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Search, Eye, MessageCircle, MapPin, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  adminOrdersQueryOptions,
  adminZonesQueryOptions,
  mapsSearchLink,
  type AdminOrder,
} from "@/lib/admin-data";
import { toDateKey } from "@/lib/cutoff";
import { formatINR, buildWhatsAppTo } from "@/lib/brand";
import { downloadCSV } from "@/lib/csv";
import { PAYMENT_STATUSES, DELIVERY_STATUSES } from "@/lib/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentBadge, DeliveryBadge } from "@/components/admin/StatusBadge";
import { OrderDrawer } from "@/components/admin/OrderDrawer";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery(adminOrdersQueryOptions);
  const { data: zones = [] } = useQuery(adminZonesQueryOptions);

  const [date, setDate] = useState("");
  const [meal, setMeal] = useState("all");
  const [sector, setSector] = useState("all");
  const [pay, setPay] = useState("all");
  const [deliv, setDeliv] = useState("all");
  const [plan, setPlan] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sectors = useMemo(
    () =>
      Array.from(new Set([...zones.map((z) => z.sector), ...orders.map((o) => o.sector)])).sort(),
    [zones, orders],
  );
  const plans = useMemo(() => Array.from(new Set(orders.map((o) => o.plan_slug))).sort(), [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (date && o.delivery_date !== date) return false;
      if (meal !== "all" && o.meal !== meal) return false;
      if (sector !== "all" && o.sector !== sector) return false;
      if (pay !== "all" && o.payment_status !== pay) return false;
      if (deliv !== "all" && o.delivery_state !== deliv) return false;
      if (plan !== "all" && o.plan_slug !== plan) return false;
      if (q) {
        const hay =
          `${o.order_code} ${o.customer_name} ${o.mobile} ${o.whatsapp_number ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, date, meal, sector, pay, deliv, plan, search]);

  async function patchOrder(id: string, p: Record<string, unknown>) {
    const { error } = await supabase
      .from("orders")
      .update(p as never)
      .eq("id", id);
    if (error) {
      toast.error("Update failed: " + error.message);
      return;
    }
    toast.success("Order updated");
    await qc.invalidateQueries({ queryKey: ["admin-orders"] });
    setSelected((prev) => (prev && prev.id === id ? ({ ...prev, ...p } as AdminOrder) : prev));
  }

  function openOrder(o: AdminOrder) {
    setSelected(o);
    setDrawerOpen(true);
  }

  function exportCSV() {
    downloadCSV(
      `orders-${date || "all"}.csv`,
      [
        "Order",
        "Time",
        "Customer",
        "Mobile",
        "Sector",
        "Meal",
        "Plan",
        "Qty",
        "Amount",
        "Payment mode",
        "Payment",
        "Delivery",
        "Late",
      ],
      filtered.map((o) => [
        o.order_code,
        new Date(o.created_at).toLocaleString("en-IN"),
        o.customer_name,
        o.mobile,
        o.sector,
        o.meal,
        o.plan_name,
        o.quantity,
        o.total,
        o.payment_mode,
        o.payment_status,
        o.delivery_state,
        o.is_late_request ? "yes" : "no",
      ]),
    );
  }

  function resetFilters() {
    setDate("");
    setMeal("all");
    setSector("all");
    setPay("all");
    setDeliv("all");
    setPlan("all");
    setSearch("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-sm text-muted-foreground">Search, filter and operate every order.</p>
        </div>
        <Button variant="default" onClick={exportCSV} disabled={filtered.length === 0}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-0 z-20 space-y-3 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order code, customer or mobile..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="grid gap-1">
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <FilterSelect
            label="Meal"
            value={meal}
            onChange={setMeal}
            options={["all", "lunch", "dinner"]}
          />
          <FilterSelect
            label="Sector"
            value={sector}
            onChange={setSector}
            options={["all", ...sectors]}
          />
          <FilterSelect label="Plan" value={plan} onChange={setPlan} options={["all", ...plans]} />
          <FilterSelect
            label="Payment"
            value={pay}
            onChange={setPay}
            options={["all", ...PAYMENT_STATUSES.map((p) => p.value)]}
          />
          <FilterSelect
            label="Delivery"
            value={deliv}
            onChange={setDeliv}
            options={["all", ...DELIVERY_STATUSES.map((d) => d.value)]}
          />
          <Button variant="ghost" size="sm" className="ml-auto" onClick={resetFilters}>
            <Filter className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <h2 className="font-serif text-lg font-bold text-foreground">Orders</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {filtered.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">No orders match these filters.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-3 py-3 font-semibold">Customer</th>
                  <th className="px-3 py-3 font-semibold">Sector</th>
                  <th className="px-3 py-3 font-semibold">Meal</th>
                  <th className="px-3 py-3 font-semibold">Qty</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Payment</th>
                  <th className="px-3 py-3 font-semibold">Delivery</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {o.order_code}
                        </span>
                        {o.is_late_request && (
                          <span className="rounded-full bg-mustard/25 px-1.5 py-0.5 text-[9px] font-bold uppercase text-foreground">
                            Late
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(o.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {o.delivery_date}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-foreground">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{o.mobile}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{o.sector}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${o.meal === "lunch" ? "bg-mustard/25 text-foreground" : "bg-terracotta/20 text-foreground"}`}
                      >
                        {o.meal}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-foreground">{o.quantity}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{formatINR(o.total)}</td>
                    <td className="px-3 py-3">
                      <select
                        value={o.payment_status}
                        onChange={(e) => patchOrder(o.id, { payment_status: e.target.value })}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs capitalize"
                      >
                        {PAYMENT_STATUSES.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={o.delivery_state}
                        onChange={(e) => patchOrder(o.id, { delivery_state: e.target.value })}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs capitalize"
                      >
                        {DELIVERY_STATUSES.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => openOrder(o)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <a
                          href={buildWhatsAppTo(
                            o.whatsapp_number || o.mobile,
                            `Hi ${o.customer_name}, regarding order ${o.order_code}...`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-secondary"
                          title="WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        <a
                          href={o.maps_link || mapsSearchLink(`${o.address} ${o.sector} Noida`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
                          title="Maps"
                        >
                          <MapPin className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDrawer
        order={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onPatch={patchOrder}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="grid gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px] capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o} className="capitalize">
              {o === "all" ? "All" : o.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
