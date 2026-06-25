import { Sprout, ShieldX, Flame, Wheat, Sun } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { PURITY_PROMISES } from "@/lib/brand";

const ICONS = [ShieldX, Sprout, Flame, Wheat, Sun];

export function PurityStrip() {
  return (
    <section className="border-y border-border/60 bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PURITY_PROMISES.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={p.title} delay={i * 70}>
                <div className="card-lift flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                  <span className="icon-hop flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-1 font-serif text-base font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
