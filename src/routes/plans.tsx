import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Calendar, Clock, Repeat, Sparkles } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { PlansSection } from "@/components/home/PlansSection";
import { plansQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Monthly Tiffin Plans & Subscription — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Choose Basic, Standard or Premium tiffin plans in Noida. Trial packs, weekly and monthly subscriptions with lunch and dinner options.",
      },
      { property: "og:title", content: "Tiffin Plans & Subscriptions — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Trial, weekly and monthly home-style tiffin plans for Noida.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(plansQueryOptions),
  component: PlansPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="px-4 py-20 text-center text-destructive">{error.message}</div>
    </SiteLayout>
  ),
});

const OPTIONS = [
  {
    icon: Sparkles,
    title: "Trial Packs",
    body: "1 Day, 3 Day or 7 Day packs to test taste, hygiene, timing and quantity before you commit.",
  },
  {
    icon: Repeat,
    title: "Weekly Plans",
    body: "Lunch only, Dinner only, or Lunch + Dinner — flexible weekly subscriptions.",
  },
  {
    icon: Calendar,
    title: "Monthly Plans",
    body: "26 lunches, 26 dinners, or 52 meals (lunch + dinner). Custom plans available too.",
  },
  {
    icon: Clock,
    title: "Pause Anytime",
    body: "Pause tomorrow's lunch before midnight or today's dinner before noon. Up to 4 pauses a month.",
  },
];

function PlansPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Pick Your Plan"
        title="Simple Plans. Honest Food."
        subtitle="Choose what suits your routine and appetite. All plans use farm-fresh, trusted-source ingredients with no palm oil."
      />
      <section className="bg-cream py-14">
        <Suspense
          fallback={
            <div className="mx-auto h-80 max-w-7xl animate-pulse rounded-xl bg-secondary/30" />
          }
        >
          <PlansSection withHeading={false} compact />
        </Suspense>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl font-bold text-foreground">
            Flexible Subscription Options
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OPTIONS.map((o) => (
              <div key={o.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <o.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{o.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
