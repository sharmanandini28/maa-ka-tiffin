import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { plansQueryOptions } from "@/lib/queries";
import { formatINR } from "@/lib/brand";

export function PlansSection({
  withHeading = true,
  compact = false,
}: {
  withHeading?: boolean;
  compact?: boolean;
}) {
  const { data: plans } = useSuspenseQuery(plansQueryOptions);

  return (
    <section className={compact ? "" : "bg-cream py-16 sm:py-20"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {withHeading && (
          <SectionHeading
            className="mb-12"
            eyebrow="Pick Your Plan"
            title="Simple Plans. Honest Food."
            subtitle="Choose what suits your routine and appetite. Every plan uses farm-fresh, trusted-source ingredients with no palm oil."
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 100} variant="up">
              <div
                className={`card-lift relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm ${
                  plan.is_popular ? "border-mustard ring-2 ring-mustard/40" : "border-border"
                }`}
              >
                {plan.is_popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mustard px-3 py-0.5 text-xs font-bold text-mustard-foreground shadow-sm">
                    Most Popular
                  </span>
                )}
                <h3 className="font-serif text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-primary">{plan.tagline}</p>

                <div className="mt-5 flex items-end gap-1 border-t border-border pt-5">
                  <p className="font-serif text-4xl font-bold text-primary">
                    {formatINR(plan.price)}
                  </p>
                  <p className="pb-1 text-sm text-muted-foreground">/ {plan.period}</p>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground/85">
                      <Check className="h-4 w-4 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.is_popular ? "mustard" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link to="/order" search={{ plan: plan.slug }}>
                    Choose {plan.name}
                  </Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
