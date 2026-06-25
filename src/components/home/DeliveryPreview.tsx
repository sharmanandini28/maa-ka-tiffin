import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DELIVERY_ZONES } from "@/lib/brand";

export function DeliveryPreview() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          className="mb-12"
          eyebrow="Delivery Areas"
          title="Now serving across Noida"
          subtitle="Daily lunch & dinner delivery to homes, PGs and offices in these sectors — with more on the way."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {DELIVERY_ZONES.map((z, i) => (
            <Reveal key={z.sector} delay={(i % 6) * 50}>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-transform hover:scale-105 ${
                  z.live
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-secondary/40 text-muted-foreground"
                }`}
              >
                <MapPin className={`h-4 w-4 ${z.live ? "text-primary" : "text-muted-foreground"}`} />
                {z.sector}
                {!z.live && <span className="text-xs">(soon)</span>}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-primary" /> Lunch 12–2 PM · Dinner 7–9 PM
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/delivery-areas">
              Check Your Area <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
