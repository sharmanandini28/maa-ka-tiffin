import { Moon, Sun, CalendarDays, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BOOKING_RULES } from "@/lib/brand";

const ICONS = [Moon, Sun, CalendarDays, MessageCircle];
const ACCENTS = [
  "bg-primary text-primary-foreground",
  "bg-terracotta text-terracotta-foreground",
  "bg-mustard text-mustard-foreground",
  "bg-primary text-primary-foreground",
];

export function BookingTimeline() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20">
      <div className="motif-dots pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          className="mb-14"
          eyebrow="Simple Booking Rule"
          title="Book on time, eat on time"
          subtitle="One clear cut-off system that keeps food fresh and reduces wastage. Same rules everywhere on the site."
        />

        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block">
            <div className="line-draw h-full w-full origin-top bg-gradient-to-b from-primary via-terracotta to-mustard" />
          </div>
          <ol className="space-y-6 lg:space-y-10">
            {BOOKING_RULES.map((r, i) => {
              const Icon = ICONS[i];
              const left = i % 2 === 0;
              return (
                <Reveal
                  key={r.key}
                  variant={left ? "left" : "right"}
                  delay={i * 80}
                  className={`relative lg:flex lg:items-center ${left ? "lg:justify-start" : "lg:justify-end"}`}
                >
                  <div className="card-lift relative w-full rounded-2xl border border-border bg-card p-5 shadow-sm lg:w-[46%]">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${ACCENTS[i]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-bold text-foreground">{r.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary">{r.cutoff}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.note}</p>
                  </div>
                  <span className="absolute left-1/2 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-cream bg-primary lg:block" />
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
