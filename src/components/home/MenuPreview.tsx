import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, ArrowRight, Leaf, CalendarDays } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { weekMenuQueryOptions } from "@/lib/queries";
import { toDateKey } from "@/lib/cutoff";
import type { Meal } from "@/lib/cutoff";
import thali from "@/assets/thali-spread.jpg";

function MenuCard({
  when,
  meal,
  dishes,
  descriptor,
  accent,
}: {
  when: string;
  meal: Meal;
  dishes: string;
  descriptor: string | null;
  accent: "primary" | "terracotta";
}) {
  return (
    <div className="card-lift overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-36 overflow-hidden">
        <img src={thali} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            accent === "primary"
              ? "bg-primary text-primary-foreground"
              : "bg-terracotta text-terracotta-foreground"
          }`}
        >
          {meal === "lunch" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {when}
        </span>
      </div>
      <div className="p-5">
        <p className="font-serif text-xl font-semibold leading-snug text-foreground">{dishes}</p>
        {descriptor && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" /> {descriptor}
          </p>
        )}
      </div>
    </div>
  );
}

export function MenuPreview() {
  const { data: menu } = useSuspenseQuery(weekMenuQueryOptions);
  const [meal, setMeal] = useState<Meal>("lunch");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayKey = toDateKey(today);
  const tomorrowKey = toDateKey(tomorrow);

  const todayItem = menu.find((m) => m.menu_date === todayKey && m.meal === meal);
  const tomorrowItem = menu.find((m) => m.menu_date === tomorrowKey && m.meal === meal);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            eyebrow="Today & Tomorrow"
            title="Menu Made with Love, Everyday"
            subtitle="Home-style vegetarian meals, freshly cooked and rotated daily for taste and balance."
          />
          <Reveal delay={120}>
            <div className="inline-flex rounded-full border border-border bg-secondary/50 p-1">
              {(["lunch", "dinner"] as Meal[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMeal(m)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                    meal === m
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "lunch" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {m === "lunch" ? "Lunch" : "Dinner"}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div key={meal} className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          <Reveal variant="left">
            <MenuCard
              when="Today"
              meal={meal}
              dishes={todayItem?.dishes ?? "Menu updating soon"}
              descriptor={todayItem?.descriptor ?? null}
              accent="primary"
            />
          </Reveal>
          <Reveal variant="right" delay={80}>
            <MenuCard
              when="Tomorrow"
              meal={meal}
              dishes={tomorrowItem?.dishes ?? "Menu updating soon"}
              descriptor={tomorrowItem?.descriptor ?? null}
              accent="terracotta"
            />
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-10 flex justify-center">
          <Button asChild variant="mustard" size="lg">
            <Link to="/menu">
              <CalendarDays className="h-4 w-4" /> View Full Weekly Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
