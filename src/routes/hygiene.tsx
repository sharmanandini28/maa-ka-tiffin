import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Sparkles,
  Droplets,
  Flame,
  Package,
  Refrigerator,
  HandPlatter,
  ShieldCheck,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import cooking from "@/assets/cooking.jpg";

export const Route = createFileRoute("/hygiene")({
  head: () => ({
    meta: [
      { title: "Hygiene Promise — Clean Kitchen & Fresh Cooking | Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Our hygiene promise: fresh cooking daily, clean kitchen, food-grade packaging, no stale food, no reused oil, no palm oil. Tiffin you can trust in Noida.",
      },
      { property: "og:title", content: "Hygiene Promise — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Clean kitchen, fresh cooking, food-grade packaging.",
      },
      { property: "og:url", content: "/hygiene" },
    ],
    links: [{ rel: "canonical", href: "/hygiene" }],
  }),
  component: HygienePage,
});

const PROCESS = [
  {
    icon: Droplets,
    title: "Ingredient Cleaning",
    body: "Every vegetable and grain is washed thoroughly in clean, drinking-quality water before cooking.",
  },
  {
    icon: Flame,
    title: "Fresh Daily Cooking",
    body: "Cooked fresh every single day on a pre-order basis — never stored, never reheated for days.",
  },
  {
    icon: Refrigerator,
    title: "Cold-Chain Care",
    body: "Perishables are stored correctly and used quickly. No stale or day-old food, ever.",
  },
  {
    icon: Package,
    title: "Food-Grade Packaging",
    body: "Leak-proof, food-grade containers that keep your meal hot, fresh and spill-free.",
  },
  {
    icon: HandPlatter,
    title: "Staff Hygiene",
    body: "Daily hygiene checklist — clean hands, aprons, hair caps and a sanitised cooking area.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Oil & Water",
    body: "Only clean, trusted cooking oil — never palm or reused oil — and purified water throughout.",
  },
];

const PROMISES = [
  "Fresh cooking every single day",
  "Clean, sanitised home-style kitchen",
  "Food-grade, leak-proof packaging",
  "Drinking-quality water in cooking",
  "No stale or day-old food",
  "No reused oil — ever",
  "No artificial colour or essence",
  "No palm oil",
  "No cheap adulterated raw material",
  "Maximum farm / trusted-farmer sourcing",
  "Light, home-style cooking",
  "Daily staff hygiene checklist",
];

function HygienePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Promise"
        title={
          <>
            Hygiene you can <span className="text-primary">trust</span>
          </>
        }
        subtitle="Hum food ko sirf business nahi, trust ke form me deliver karte hain. Here's exactly how we keep every meal pure, fresh and safe."
      />

      {/* Intro with image */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left" className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-primary/5" />
            <img
              src={cooking}
              alt="A clean kitchen with fresh ingredients and food being cooked"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-deep"
            />
          </Reveal>
          <Reveal variant="right">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Clean by design
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              A home kitchen, held to a higher standard
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              We cook the way a careful mother would — in a spotless kitchen, with clean hands, pure
              water and honest ingredients. Pre-order based cooking means we make only what's
              needed, so food is always fresh and never wasted.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Process cards */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            className="mb-12"
            eyebrow="Our Process"
            title="From ingredient to your tiffin"
            subtitle="Six steps of care behind every meal we deliver."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 90}>
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

      {/* Checklist */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            className="mb-10"
            eyebrow="The Checklist"
            title="Our 12-point hygiene promise"
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {PROMISES.map((p, i) => (
              <Reveal key={p} delay={(i % 2) * 60}>
                <li className="card-lift flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Pure food, delivered with care"
        subtitle="Experience the Maa Jaisa hygiene standard with your first tiffin."
      />
    </SiteLayout>
  );
}
