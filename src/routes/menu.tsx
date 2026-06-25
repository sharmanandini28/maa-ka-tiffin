import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Sun, Moon, Leaf, Info } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { weekMenuQueryOptions } from "@/lib/queries";
import { toDateKey } from "@/lib/cutoff";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Weekly Menu — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "See this week's home-style lunch and dinner menu for Maa Jaisa Tiffin in Noida. Fresh, rotated daily, pure vegetarian.",
      },
      { property: "og:title", content: "Weekly Menu — Maa Jaisa Tiffin Noida" },
      { property: "og:description", content: "This week's fresh home-style lunch & dinner menu." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(weekMenuQueryOptions),
  component: MenuPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="px-4 py-20 text-center text-destructive">{error.message}</div>
    </SiteLayout>
  ),
});

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function MenuPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="This Week"
        title="Weekly Menu Calendar"
        subtitle="Home-style vegetarian meals, freshly cooked and rotated daily for taste and balance."
      />
      <section className="bg-background py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-secondary/30" />}>
            <MenuTable />
          </Suspense>
          <p className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-mustard/15 p-3 text-center text-sm text-foreground">
            <Info className="h-4 w-4 text-terracotta" /> Menu may slightly change based on fresh
            seasonal availability.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function MenuTable() {
  const { data: menu } = useSuspenseQuery(weekMenuQueryOptions);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-3">
      {days.map((d) => {
        const key = toDateKey(d);
        const lunch = menu.find((m) => m.menu_date === key && m.meal === "lunch");
        const dinner = menu.find((m) => m.menu_date === key && m.meal === "dinner");
        const isToday = key === toDateKey(today);
        return (
          <div
            key={key}
            className={`grid gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-[140px_1fr_1fr] sm:items-stretch ${
              isToday ? "border-primary ring-1 ring-primary/30" : "border-border"
            }`}
          >
            <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:justify-center">
              <p className="font-serif text-lg font-bold text-foreground">{DOW[d.getDay()]}</p>
              <p className="text-sm text-muted-foreground">
                {d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {isToday && <span className="ml-1 font-semibold text-primary">• Today</span>}
              </p>
            </div>
            <MealCell icon={Sun} label="Lunch" color="text-primary" item={lunch} />
            <MealCell icon={Moon} label="Dinner" color="text-terracotta" item={dinner} />
          </div>
        );
      })}
    </div>
  );
}

function MealCell({
  icon: Icon,
  label,
  color,
  item,
}: {
  icon: typeof Sun;
  label: string;
  color: string;
  item?: { dishes: string; descriptor: string | null };
}) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <p className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${color}`}>
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 font-medium text-foreground">{item?.dishes ?? "Updating soon"}</p>
      {item?.descriptor && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Leaf className="h-3 w-3 text-primary" /> {item.descriptor}
        </p>
      )}
    </div>
  );
}
