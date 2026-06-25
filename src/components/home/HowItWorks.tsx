import { UtensilsCrossed, CalendarCheck, CreditCard, Bike } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { HOW_IT_WORKS } from "@/lib/brand";

const ICONS = [UtensilsCrossed, CalendarCheck, CreditCard, Bike];

export function HowItWorks() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          className="mb-14"
          eyebrow="How It Works"
          title="Fresh tiffin in four simple steps"
          subtitle="From choosing your meal to a hot delivery — ordering with us takes less than a minute."
        />
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={s.step} delay={i * 110} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-soft">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-terracotta-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-muted-foreground">
                  {s.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
