import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Truck, CheckCircle2, Building2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { DELIVERY_ZONES } from "@/lib/brand";

export const Route = createFileRoute("/delivery-areas")({
  head: () => ({
    meta: [
      { title: "Delivery Areas — Tiffin Service in Noida Sectors | Maa Jaisa Tiffin" },
      {
        name: "description",
        content:
          "Home-style tiffin delivery across Noida — Sector 58, 59, 62, 63, 65, 76, 78, 137, 142 and nearby PG & office areas. Daily lunch & dinner delivery.",
      },
      { property: "og:title", content: "Delivery Areas — Maa Jaisa Tiffin Noida" },
      { property: "og:description", content: "Sector-wise tiffin delivery across Noida." },
      { property: "og:url", content: "/delivery-areas" },
    ],
    links: [{ rel: "canonical", href: "/delivery-areas" }],
  }),
  component: DeliveryAreasPage,
});

const TIMING = [
  { icon: Clock, label: "Lunch Delivery", value: "12:00 PM – 2:00 PM" },
  { icon: Clock, label: "Dinner Delivery", value: "7:00 PM – 9:00 PM" },
  { icon: Truck, label: "Delivery Charge", value: "Free on subscriptions" },
];

function DeliveryAreasPage() {
  const live = DELIVERY_ZONES.filter((z) => z.live);
  const soon = DELIVERY_ZONES.filter((z) => !z.live);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Delivery Areas"
        title={
          <>
            Now serving across <span className="text-primary">Noida</span>
          </>
        }
        subtitle="Daily fresh lunch & dinner delivered to homes, PGs, societies and offices. Find your sector below — and if you don't see it, just ask."
      />

      {/* Timing band */}
      <section className="bg-background py-12">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {TIMING.map((t, i) => (
            <Reveal key={t.label} delay={i * 90}>
              <div className="card-lift flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <t.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.label}</p>
                  <p className="font-serif text-lg font-bold text-foreground">{t.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Live sectors */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-10"
            eyebrow="Live Now"
            title="Sectors we deliver to today"
            subtitle="Active delivery zones with daily lunch & dinner service."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((z, i) => (
              <Reveal key={z.sector} delay={(i % 3) * 80}>
                <div className="card-lift flex items-center justify-between rounded-2xl border border-primary/20 bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">{z.sector}</p>
                      <p className="text-xs text-muted-foreground">{z.area}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Live
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon + note */}
      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <h3 className="font-serif text-2xl font-bold text-foreground">Expanding soon</h3>
            <p className="mt-2 text-muted-foreground">
              We're growing fast. These areas are next on our map — request yours and we'll
              prioritise it.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {soon.map((z) => (
                <span
                  key={z.sector}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm text-muted-foreground"
                >
                  <MapPin className="h-4 w-4" /> {z.sector}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-border bg-cream p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                <Building2 className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-serif text-lg font-bold text-foreground">
                Subscription-first areas
              </h4>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Some newer zones are served on a subscription-only basis to keep delivery reliable.
                Monthly plans get priority routing and free delivery.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Don't see your sector? Just ask."
        subtitle="Message us your location on WhatsApp — we add new Noida areas every week."
        primaryLabel="Order Now"
        whatsappMessage="Hi! Do you deliver tiffin to my area in Noida? My sector is: "
      />
    </SiteLayout>
  );
}
