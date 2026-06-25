import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Users, Wheat, Droplet, ShieldCheck, Truck, ChefHat, Leaf } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import farmField from "@/assets/farm-field.jpg";
import farmBasket from "@/assets/farm-basket.jpg";
import cooking from "@/assets/cooking.jpg";

export const Route = createFileRoute("/khet-se-rasoi-tak")({
  head: () => ({
    meta: [
      { title: "Khet Se Rasoi Tak — Farm to Tiffin | Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Maximum raw material from our own farm and trusted local farmers. No palm oil, no adulteration — pure ghar ka khana, traceable from field to your tiffin in Noida.",
      },
      { property: "og:title", content: "Khet Se Rasoi Tak — Farm to Tiffin" },
      {
        property: "og:description",
        content: "From our fields to your plate — pure, trusted-source home-style cooking.",
      },
      { property: "og:url", content: "/khet-se-rasoi-tak" },
    ],
    links: [{ rel: "canonical", href: "/khet-se-rasoi-tak" }],
  }),
  component: KhetPage,
});

const PRINCIPLES = [
  {
    icon: Sprout,
    title: "Own Farm Produce",
    body: "A part of what we cook is grown on our own farm — picked fresh and used quickly.",
  },
  {
    icon: Users,
    title: "Trusted Farmers",
    body: "The rest comes from carefully chosen local farmers we know and trust.",
  },
  {
    icon: Wheat,
    title: "Quality Staples",
    body: "Chawal, atta, dal and oil sourced for purity — not the cheapest price.",
  },
  {
    icon: Droplet,
    title: "Never Palm Oil",
    body: "No palm oil, no reused oil, no cheap adulterated raw material. Ever.",
  },
];

const JOURNEY = [
  {
    icon: Sprout,
    title: "Grown & Harvested",
    body: "Seasonal vegetables and grains grown on our farm and trusted partner fields.",
  },
  {
    icon: Truck,
    title: "Sourced Fresh",
    body: "Picked and brought to our kitchen quickly — no long storage, no middlemen games.",
  },
  {
    icon: Droplet,
    title: "Cleaned & Checked",
    body: "Washed in clean water and checked for quality before anything touches the pan.",
  },
  {
    icon: ChefHat,
    title: "Cooked Like Home",
    body: "Freshly cooked daily, light on masala, balanced and wholesome.",
  },
];

function KhetPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Khet Se Rasoi Tak"
        title={
          <>
            From our fields to <span className="text-primary">your plate</span>
          </>
        }
        subtitle="Humara focus sirf taste par nahi, purity par bhi hai. Maximum saman apne khet ya trusted kisan source se aata hai — traceable, honest and pure."
      />

      {/* Philosophy */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left" className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-terracotta/10" />
            <img
              src={farmField}
              alt="A farmer holding freshly harvested vegetables at golden hour"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-deep"
            />
          </Reveal>
          <Reveal variant="right">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Our sourcing philosophy
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              Khana jo sirf pet nahi, bharosa bhi bhare
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              Hum maximum saman apne khet aur trusted kisan source se laate hain. Chawal, oil,
              sabzi, atta aur dal jaise raw materials ko quality ke sath select kiya jata hai. Hum
              palm oil, cheap local saman, artificial colour aur heavy masala se bachkar simple ghar
              jaisa khana banate hain.
            </p>
            <p className="mt-5 flex items-center gap-2 font-serif text-lg font-semibold text-primary">
              <ShieldCheck className="h-5 w-5" /> Pure ingredients. Thoughtful meals.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-12"
            eyebrow="What Goes In"
            title="Our food quality principles"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="icon-hop flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient journey */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-14"
            eyebrow="The Journey"
            title="From field to tiffin, step by step"
            subtitle="Every meal travels a short, honest path — and you can trace every step."
          />
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
            {JOURNEY.map((s, i) => (
              <Reveal key={s.title} delay={i * 110} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-soft">
                  <s.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-terracotta-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-sm text-muted-foreground">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional narrative split */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              <Leaf className="h-3.5 w-3.5" /> Cooked like home
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              The way your mother would cook it
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              Freshly cooked daily in a clean, home-style kitchen. Pre-order based cooking means
              less wastage and fresher food — never stale, never reheated for days. Just simple,
              balanced meals that taste like home.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <img
                src={farmBasket}
                alt="Basket of farm vegetables"
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover shadow-soft"
              />
              <img
                src={cooking}
                alt="Fresh home cooking"
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover shadow-soft"
              />
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft">
              <p className="font-serif text-2xl font-bold leading-snug text-foreground">
                “We don't cook for customers. We cook for people — the way we'd cook for our own
                family.”
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                That single belief shapes every decision: what we source, how we clean, how we cook
                and how we pack. No palm oil, no milawat, no shortcuts — just the Maa Jaisa promise.
              </p>
              <p className="mt-5 font-serif text-base font-semibold text-primary">
                — Team Maa Jaisa Tiffin
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Taste food that's traceable and pure"
        subtitle="From our khet to your rasoi — order your first home-style tiffin today."
      />
    </SiteLayout>
  );
}
