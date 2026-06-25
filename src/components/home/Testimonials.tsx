import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TESTIMONIALS } from "@/lib/brand";

export function Testimonials() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          className="mb-12"
          eyebrow="Loved in Noida"
          title="Stories from our tiffin family"
          subtitle="From working professionals to PG residents and busy couples — here's what home-style food means to them."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 90}>
              <figure className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Quote className="h-7 w-7 text-mustard" />
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-mustard text-mustard" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 border-t border-border pt-4">
                  <p className="font-serif text-base font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
