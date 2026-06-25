import { Heart, ShieldCheck, Sparkles, Truck, RefreshCw, Recycle } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WHY_CHOOSE } from "@/lib/brand";

const ICONS = [Heart, ShieldCheck, Sparkles, Truck, RefreshCw, Recycle];

export function WhyChoose() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          className="mb-12"
          eyebrow="Why Maa Jaisa"
          title="Trust you can taste, every single day"
          subtitle="We're not a restaurant. We're a home kitchen built on purity, hygiene and genuine care for people living away from home."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((w, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={w.title} delay={(i % 3) * 90}>
                <div className="card-lift flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="icon-hop flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{w.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
