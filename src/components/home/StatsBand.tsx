import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { STATS } from "@/lib/brand";

export function StatsBand() {
  return (
    <section className="bg-gradient-forest py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <p className="font-serif text-4xl font-bold text-mustard sm:text-5xl">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1.5 text-sm font-medium text-primary-foreground/85">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
