import { Link } from "@tanstack/react-router";
import {
  Leaf,
  ShoppingBag,
  BookOpen,
  Clock,
  Container,
  Soup,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import heroTiffin from "@/assets/thali-spread.jpg";

const BADGES = ["No Palm Oil", "No Milawat", "No Heavy Masala"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="motif-dots pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="float-slow pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-terracotta shadow-sm">
              <Leaf className="h-3.5 w-3.5" /> Noida's Home-Style Tiffin
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.04] text-foreground text-balance sm:text-6xl">
              Noida me <span className="text-primary">ghar jaisa</span> shuddh tiffin
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Apne khet aur trusted kisan source ke saman se bana fresh ghar ka khana — daily lunch
              & dinner, delivered hot to your door.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {BADGES.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary"
                >
                  <ShieldCheck className="h-4 w-4" /> {b}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="mustard" size="xl">
                <Link to="/order">
                  <ShoppingBag className="h-5 w-5" /> Order Now
                </Link>
              </Button>
              <Button asChild variant="hero" size="xl">
                <Link to="/menu">
                  <BookOpen className="h-5 w-5" /> View Menu
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={330}>
            <div className="mt-8 rounded-2xl border border-border bg-background/80 p-5 shadow-soft backdrop-blur-sm">
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                <Clock className="h-5 w-5 text-primary" /> Booking Cut-off
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Container className="mt-0.5 h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold text-primary">Tomorrow's Lunch</p>
                    <p className="text-sm text-muted-foreground">
                      Before <span className="font-semibold text-foreground">12:00 AM</span>{" "}
                      (midnight)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:border-l sm:border-border sm:pl-4">
                  <Soup className="mt-0.5 h-6 w-6 text-terracotta" />
                  <div>
                    <p className="font-semibold text-terracotta">Today's Dinner</p>
                    <p className="text-sm text-muted-foreground">
                      Before <span className="font-semibold text-foreground">12:00 PM</span> (noon)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={150} className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary/5" />
          <div className="absolute -right-3 -top-3 z-10 rotate-3 rounded-2xl border border-border bg-background px-4 py-3 shadow-deep">
            <p className="flex items-center gap-1 text-sm font-bold text-foreground">
              <Star className="h-4 w-4 fill-mustard text-mustard" /> 4.9 / 5
            </p>
            <p className="text-xs text-muted-foreground">Loved by Noida families</p>
          </div>
          <img
            src={heroTiffin}
            alt="Home-style Indian thali with dal, rice, sabzi, roti, salad and curd"
            width={1280}
            height={1280}
            fetchPriority="high"
            className="aspect-square w-full rounded-[2rem] object-cover shadow-deep"
          />
          <div className="absolute -bottom-4 left-6 rounded-2xl border border-border bg-background px-4 py-3 shadow-deep">
            <p className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <Leaf className="h-4 w-4" /> Farm-fresh daily
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
