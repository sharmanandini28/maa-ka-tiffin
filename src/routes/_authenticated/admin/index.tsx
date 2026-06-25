import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Soup,
  CalendarDays,
  IndianRupee,
  Download,
  Loader2,
  ChefHat,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  Route as RouteIcon,
} from "lucide-react";
import {
  adminOrdersQueryOptions,
  computeKitchen,
  buildRouteLink,
  type AdminOrder,
} from "@/lib/admin-data";
import { toDateKey } from "@/lib/cutoff";
import { formatINR, ADD_ONS, BUFFER_OPTIONS } from "@/lib/brand";
import { downloadCSV } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const today = toDateKey(new Date());
  const tomorrow = toDateKey(new Date(Date.now() + 86400000));
  const { data: orders = [], isLoading } = useQuery(adminOrdersQueryOptions);

  const [date, setDate] = useState(today);
  const [mealFilter, setMealFilter] = useState("all");
  const [buffer, setBuffer] = useState(0);

  const stats = useMemo(() => {
    const active = (o: AdminOrder) => o.delivery_state !== "cancelled";
    const todayLunch = orders.filter((o) => o.delivery_date === today && o.meal === "lunch" && active(o));
    const todayDinner = orders.filter((o) => o.delivery_date === today && o.meal === "dinner" && active(o));
    const tomLunch = orders.filter((o) => o.delivery_date === tomorrow && o.meal === "lunch" && active(o));
    const dinnerOpen = todayDinner.filter((o) => o.delivery_state === "received" || o.delivery_state === "confirmed");
    const pending = orders.filter((o) => o.payment_status === "pending");
    const late = orders.filter((o) => o.is_late_request && o.delivery_state === "received");
    return {
      todayLunch: todayLunch.reduce((s, o) => s + o.quantity, 0),
      todayDinner: todayDinner.reduce((s, o) => s + o.quantity, 0),
      tomLunch: tomLunch.reduce((s, o) => s + o.quantity, 0),
      dinnerOpen: dinnerOpen.length,
      pendingAmount: pending.reduce((s, o) => s + o.total, 0),
      pendingCount: pending.length,
      lateCount: late.length,
    };
  }, [orders, today, tomorrow]);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (o.delivery_state === "cancelled") return false;
        if (date && o.delivery_date !== date) return false;
        if (mealFilter !== "all" && o.meal !== mealFilter) return false;
        return true;
      }),
    [orders, date, mealFilter],
  );

  const kitchen = useMemo(() => computeKitchen(filtered, buffer), [filtered, buffer]);

  const sectorGroups = useMemo(() => {
    const map = new Map<string, { lunch: number; dinner: number; orders: AdminOrder[] }>();
    filtered.forEach((o) => {
      const g = map.get(o.sector) ?? { lunch: 0, dinner: 0, orders: [] };
      g[o.meal] += o.quantity;
      g.orders.push(o);
      map.set(o.sector, g);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  function exportKitchen() {
    const rows: (string | number)[][] = [
      ["Roti (pieces)", kitchen.raw.roti, kitchen.final.roti],
      ["Rice (portions)", kitchen.raw.rice, kitchen.final.rice],
      ["Dal (portions)", kitchen.raw.dal, kitchen.final.dal],
      ["Sabzi (portions)", kitchen.raw.sabzi, kitchen.final.sabzi],
      ["Packaging sets", kitchen.raw.sets, kitchen.final.sets],
      ...kitchen.addOns.map(([id, qty]) => [
        `Add-on: ${ADD_ONS.find((a) => a.id === id)?.label ?? id}`,
        qty,
        qty,
      ]),
    ];
    downloadCSV(`kitchen-${date}-${mealFilter}.csv`, ["Item", "Confirmed", `After ${buffer}% buffer`], rows);
  }

  function exportDelivery() {
    const rows = sectorGroups.map(([sector, g]) => [
      sector,
      g.lunch,
      g.dinner,
      g.lunch + g.dinner,
      buildRouteLink(g.orders),
    ]);
    downloadCSV(`delivery-${date}-${mealFilter}.csv`, ["Sector", "Lunch", "Dinner", "Total", "Route link"], rows);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground">Your tiffin operations at a glance.</p>
        </div>
        <Button asChild variant="default">
          <Link to="/admin/orders">
            Manage orders <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Overview cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard icon={ShoppingBag} color="bg-mustard text-mustard-foreground" label="Today Lunch" value={stats.todayLunch} hint="tiffins" />
            <StatCard icon={Soup} color="bg-terracotta text-terracotta-foreground" label="Today Dinner" value={stats.todayDinner} hint="tiffins" />
            <StatCard icon={Lock} color="bg-primary text-primary-foreground" label="Tomorrow Lunch (locked)" value={stats.tomLunch} hint="tiffins" />
            <StatCard icon={CalendarDays} color="bg-secondary text-secondary-foreground" label="Today Dinner — Open" value={stats.dinnerOpen} hint="to confirm" />
            <StatCard icon={IndianRupee} color="bg-terracotta text-terracotta-foreground" label="Pending Payments" value={formatINR(stats.pendingAmount)} hint={`${stats.pendingCount} orders`} to="/admin/payments" />
            <StatCard icon={Clock} color="bg-mustard text-mustard-foreground" label="Late Order Requests" value={stats.lateCount} hint="need approval" to="/admin/payments" />
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-4 text-xs text-muted-foreground">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            Active subscriptions, paused meals and rating alerts arrive with the Phase 2 subscription
            wallet.
          </div>

          {/* Filters for operational views */}
          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs font-medium text-muted-foreground">Meal</label>
              <Select value={mealFilter} onValueChange={setMealFilter}>
                <SelectTrigger className="w-[140px] capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["all", "lunch", "dinner"].map((o) => (
                    <SelectItem key={o} value={o} className="capitalize">
                      {o === "all" ? "Both" : o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="ml-auto self-center text-sm text-muted-foreground">
              {filtered.length} active order(s) in view
            </p>
          </div>

          {/* Kitchen + sector */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Kitchen */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                  <ChefHat className="h-5 w-5 text-primary" /> Kitchen Summary
                </h2>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Buffer</span>
                  <div className="inline-flex rounded-md border border-input p-0.5">
                    {BUFFER_OPTIONS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBuffer(b)}
                        className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                          buffer === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {b}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <KitchenStat label="Roti" raw={kitchen.raw.roti} final={kitchen.final.roti} unit="pcs" />
                <KitchenStat label="Rice" raw={kitchen.raw.rice} final={kitchen.final.rice} unit="portions" />
                <KitchenStat label="Dal" raw={kitchen.raw.dal} final={kitchen.final.dal} unit="portions" />
                <KitchenStat label="Sabzi" raw={kitchen.raw.sabzi} final={kitchen.final.sabzi} unit="portions" />
                <KitchenStat label="Packaging" raw={kitchen.raw.sets} final={kitchen.final.sets} unit="sets" />
              </div>
              {kitchen.addOns.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add-ons</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {kitchen.addOns.map(([id, qty]) => (
                      <span key={id} className="rounded-full bg-secondary/50 px-2.5 py-1 text-xs text-foreground">
                        {ADD_ONS.find((a) => a.id === id)?.label ?? id}: <strong>{qty}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" className="mt-4" onClick={exportKitchen} disabled={filtered.length === 0}>
                <Download className="h-4 w-4" /> Export kitchen sheet
              </Button>
            </div>

            {/* Sector grouping */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                <MapPin className="h-5 w-5 text-primary" /> Sector-wise Delivery
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Sector</th>
                      <th className="py-2 px-3 font-semibold">Lunch</th>
                      <th className="py-2 px-3 font-semibold">Dinner</th>
                      <th className="py-2 px-3 font-semibold">Total</th>
                      <th className="py-2 pl-3 font-semibold">Route</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectorGroups.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">No orders</td>
                      </tr>
                    ) : (
                      sectorGroups.map(([sector, g]) => {
                        const route = buildRouteLink(g.orders);
                        return (
                          <tr key={sector} className="border-b border-border/60 last:border-0">
                            <td className="py-2 pr-3 font-medium text-foreground">{sector}</td>
                            <td className="py-2 px-3 text-muted-foreground">{g.lunch}</td>
                            <td className="py-2 px-3 text-muted-foreground">{g.dinner}</td>
                            <td className="py-2 px-3 font-semibold text-foreground">{g.lunch + g.dinner}</td>
                            <td className="py-2 pl-3">
                              {route ? (
                                <a href={route} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">
                                  <RouteIcon className="h-4 w-4" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" size="sm" className="mt-4" onClick={exportDelivery} disabled={sectorGroups.length === 0}>
                <Download className="h-4 w-4" /> Export delivery sheet
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  hint,
  to,
}: {
  icon: typeof ShoppingBag;
  color: string;
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 font-serif text-3xl font-bold text-foreground">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
  if (to) return <Link to={to}>{inner}</Link>;
  return inner;
}

function KitchenStat({ label, raw, final, unit }: { label: string; raw: number; final: number; unit: string }) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold text-foreground">{final}</p>
      <p className="text-[11px] text-muted-foreground">
        {raw === final ? unit : `${raw} → ${final} ${unit}`}
      </p>
    </div>
  );
}
