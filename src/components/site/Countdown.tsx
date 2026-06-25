import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { checkCutoff, getCutoffMoment, toDateKey, formatCountdown, type Meal } from "@/lib/cutoff";

/** Returns the next upcoming delivery date key for a meal that is still bookable. */
function nextBookableDateKey(meal: Meal): string {
  const now = new Date();
  for (let i = 0; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const key = toDateKey(d);
    if (checkCutoff(meal, key, now).allowed) return key;
  }
  return toDateKey(now);
}

export function useCountdown(meal: Meal) {
  const [dateKey] = useState(() => nextBookableDateKey(meal));
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const cutoff = getCutoffMoment(meal, dateKey);
  const ms = cutoff.getTime() - now.getTime();
  return { dateKey, ms, label: formatCountdown(ms) };
}

export function CountdownBadge({ meal }: { meal: Meal }) {
  const { label } = useCountdown(meal);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 font-mono text-sm font-semibold text-foreground ring-1 ring-border">
      <Clock className="h-3.5 w-3.5 text-terracotta" /> {label}
    </span>
  );
}
