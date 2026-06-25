import { Link } from "@tanstack/react-router";
import { Sprout, Users, Droplet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import farmField from "@/assets/farm-field.jpg";

const POINTS = [
  {
    icon: Sprout,
    title: "Own Farm Produce",
    text: "A part of what we cook is grown on our own farm — picked fresh.",
  },
  {
    icon: Users,
    title: "Trusted Farmers",
    text: "The rest comes from carefully chosen local farmers we trust.",
  },
  {
    icon: Droplet,
    title: "No Palm Oil",
    text: "No palm oil, no reused oil, no cheap adulterated raw material.",
  },
];

export function KhetBand() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal variant="left" className="relative">
          <div className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-terracotta/10" />
          <img
            src={farmField}
            alt="A farmer holding freshly harvested vegetables at golden hour"
            loading="lazy"
            width={1280}
            height={960}
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-deep"
          />
          <div className="absolute -bottom-4 right-6 rounded-2xl border border-border bg-background px-4 py-3 shadow-deep">
            <p className="font-serif text-lg font-bold text-primary">Khet → Rasoi</p>
            <p className="text-xs text-muted-foreground">Traceable, trusted sourcing</p>
          </div>
        </Reveal>

        <Reveal variant="right">
          <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            Khet Se Rasoi Tak
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground text-balance sm:text-4xl">
            From our fields to your plate.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            Hum maximum saman apne khet aur trusted kisan source se laate hain. Chawal, oil, sabzi,
            atta aur dal — sab quality ke sath select kiya jata hai, cheapest price ke liye nahi.
          </p>

          <ul className="mt-6 space-y-4">
            {POINTS.map((p) => (
              <li key={p.title} className="flex items-start gap-3">
                <span className="icon-hop flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button asChild variant="hero" size="lg" className="mt-7">
            <Link to="/khet-se-rasoi-tak">
              Read Our Story <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
