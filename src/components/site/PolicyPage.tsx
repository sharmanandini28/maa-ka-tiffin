import type { ReactNode } from "react";
import { SiteLayout, PageHero } from "./SiteLayout";

export function PolicyPage({
  eyebrow,
  title,
  subtitle,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  sections: { heading: string; items: ReactNode[] }[];
}) {
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <section className="bg-background py-14">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-serif text-xl font-bold text-foreground">{s.heading}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {s.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
