import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  Wallet,
  CalendarRange,
  PauseCircle,
  Repeat,
  Briefcase,
  GraduationCap,
  Users,
  Check,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { PlansSection } from "@/components/home/PlansSection";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";
import { plansQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Monthly Tiffin Subscription in Noida — Maa Jaisa Tiffin" },
      {
        name: "description",
        content:
          "Monthly tiffin subscription in Noida with meal credits, easy pause and free delivery. Perfect for office employees, PG residents and working couples.",
      },
      { property: "og:title", content: "Monthly Tiffin Subscription — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Meal credits, pause anytime, free delivery — home-style tiffin made effortless.",
      },
      { property: "og:url", content: "/subscription" },
    ],
    links: [{ rel: "canonical", href: "/subscription" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(plansQueryOptions),
  component: SubscriptionPage,
});

const HOW = [
  {
    icon: Wallet,
    title: "Buy Meal Credits",
    body: "Choose a weekly or monthly plan and get a set of meal credits — e.g. 26 lunches a month.",
  },
  {
    icon: CalendarRange,
    title: "Use Them Daily",
    body: "Each delivered meal uses one credit. Skip a day and the credit simply stays with you.",
  },
  {
    icon: PauseCircle,
    title: "Pause Anytime",
    body: "Travelling or eating out? Pause before the cut-off — up to 4 pauses every month.",
  },
  {
    icon: Repeat,
    title: "Auto Renew",
    body: "Running low? Top up or renew in a tap. No daily ordering, no daily payments.",
  },
];

const BEST_FOR = [
  {
    icon: Briefcase,
    title: "Office Employees",
    body: "Hot, healthy lunch at your desk — no more greasy canteen or last-minute Swiggy.",
  },
  {
    icon: GraduationCap,
    title: "PG & Hostel Residents",
    body: "Ghar jaisa khana, daily. The single best upgrade to life away from home.",
  },
  {
    icon: Users,
    title: "Working Couples",
    body: "Skip the cooking after long days. Lunch + dinner handled, every single day.",
  },
];

const PERKS = [
  "Free delivery on all subscriptions",
  "Priority kitchen & routing",
  "Lock in today's prices for the month",
  "Easy pause before cut-off",
  "Unused credits never wasted",
  "Switch lunch/dinner anytime",
];

function SubscriptionPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Subscription"
        title={
          <>
            Ghar ka khana, on <span className="text-primary">auto-pilot</span>
          </>
        }
        subtitle="A monthly tiffin subscription built for busy lives in Noida. Buy meal credits once, eat fresh home-style food every day — with the flexibility to pause whenever you need."
      >
        <Button asChild variant="mustard" size="xl">
          <Link to="/order">Start Subscription</Link>
        </Button>
        <Button asChild variant="hero" size="xl">
          <Link to="/plans">Compare Plans</Link>
        </Button>
      </PageHero>

      {/* How meal credits work */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-14"
            eyebrow="Meal Credits"
            title="How subscription works"
            subtitle="No daily ordering, no daily payments. Just fresh food, handled."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <Reveal key={h.title} delay={i * 100} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-soft">
                  <h.icon className="h-7 w-7 text-primary" />
                  <span className="absolute mt-12 ml-12 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-terracotta-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{h.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-muted-foreground">
                  {h.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-cream py-16 sm:py-20">
        <SectionHeading
          className="mb-12"
          eyebrow="Choose Your Plan"
          title="Weekly & monthly plans"
          subtitle="Start with a trial, then go weekly or monthly. Lunch only, dinner only, or both."
        />
        <Suspense
          fallback={
            <div className="mx-auto h-80 max-w-7xl animate-pulse rounded-xl bg-secondary/30" />
          }
        >
          <PlansSection withHeading={false} compact />
        </Suspense>
      </section>

      {/* Best for */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-12"
            eyebrow="Made For You"
            title="Who loves a subscription"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {BEST_FOR.map((b, i) => (
              <Reveal key={b.title} delay={i * 100}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="icon-hop flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="rounded-2xl border border-border bg-cream p-7 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-foreground">Subscription perks</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-foreground/85">
                    <Check className="h-4 w-4 shrink-0 text-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Start your monthly tiffin today"
        subtitle="One subscription. Daily ghar jaisa khana. Zero daily hassle."
        primaryLabel="Start Subscription"
        whatsappMessage="Hi! I'd like to start a monthly tiffin subscription."
      />
    </SiteLayout>
  );
}
