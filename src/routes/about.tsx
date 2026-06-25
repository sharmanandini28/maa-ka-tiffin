import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Sprout, ShieldCheck, HandHeart, Home } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { Counter } from "@/components/site/Counter";
import { STATS } from "@/lib/brand";
import cooking from "@/assets/cooking.jpg";
import farmField from "@/assets/farm-field.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Maa Jaisa Tiffin | Home-Style Tiffin Service Noida" },
      {
        name: "description",
        content:
          "The story behind Maa Jaisa Tiffin — a premium home-style tiffin service in Noida built on purity, trust and ghar jaisa khana for people living away from home.",
      },
      { property: "og:title", content: "About Maa Jaisa Tiffin — Ghar Jaisa Khana Noida" },
      {
        property: "og:description",
        content: "Our mission, values and the meaning behind Maa Jaisa Tiffin.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: "/emblem.png" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Purity First", body: "No palm oil, no milawat, no shortcuts — ever. What we won't feed our own family, we won't serve you." },
  { icon: Sprout, title: "Honest Sourcing", body: "Maximum raw material from our own farm and trusted local farmers, chosen for quality." },
  { icon: HandHeart, title: "Genuine Care", body: "We cook for people living away from home — every tiffin carries a little bit of maa's care." },
  { icon: Home, title: "Real Home Taste", body: "Light, balanced, home-style meals — not heavy restaurant food drowning in masala." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Story"
        title={<>Khana banaya gaya hai <span className="text-primary">maa jaise pyaar</span> se</>}
        subtitle="Maa Jaisa Tiffin isn't just a food service. It's a promise of purity, hygiene and the comfort of home-cooked meals for everyone in Noida living away from family."
      />

      {/* Why we started */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left" className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-primary/5" />
            <img
              src={cooking}
              alt="Fresh home-style cooking in a clean kitchen"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-deep"
            />
          </Reveal>
          <Reveal variant="right">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Why we started
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              Born from a simple problem
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground text-pretty">
              <p>
                Thousands of students, working professionals and families in Noida live away from
                home. Most tiffin services treat food like a commodity — cheap oil, heavy masala,
                stale cooking and zero transparency.
              </p>
              <p>
                We started Maa Jaisa Tiffin to change that. A home kitchen that cooks fresh every
                day, sources honestly from farms, and treats food as trust — not just business.
              </p>
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-primary">
                <Heart className="h-5 w-5" /> Ghar Ka Khana, Pyaar Ke Saath.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meaning + mission */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="card-lift h-full rounded-2xl border border-border bg-card p-7 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Home className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
                What "Maa Jaisa" means
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                "Maa Jaisa" means "like mother's". It's the standard we hold every meal to — the same
                purity, care and balance your mother would insist on. Simple, fresh, and made with
                love.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card-lift h-full rounded-2xl border border-border bg-card p-7 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                <Target className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-foreground">Our mission</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                To make pure, hygienic, home-style food effortlessly available across Noida — so
                that no one living away from home has to compromise on health, taste or trust.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-12"
            eyebrow="What We Stand For"
            title="Our values, in every tiffin"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="icon-hop flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats over farm image */}
      <section className="relative overflow-hidden py-20">
        <img src={farmField} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center">
              <p className="font-serif text-4xl font-bold text-mustard sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-sm font-medium text-primary-foreground/90">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="Taste the difference purity makes"
        subtitle="Try a meal today and see why Noida families call it ghar jaisa khana."
      />
    </SiteLayout>
  );
}
