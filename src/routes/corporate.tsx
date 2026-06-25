import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  Utensils,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppLink } from "@/lib/brand";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate & Bulk Tiffin Orders in Noida — Maa Jaisa Tiffin" },
      {
        name: "description",
        content:
          "Bulk and corporate tiffin orders in Noida for offices, startups, PGs and hostels. Reliable daily lunch for teams with farm-fresh, pure home-style food.",
      },
      { property: "og:title", content: "Corporate & Bulk Tiffin — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Office lunch, startup meals and PG/hostel bulk tiffin across Noida.",
      },
      { property: "og:url", content: "/corporate" },
    ],
    links: [{ rel: "canonical", href: "/corporate" }],
  }),
  component: CorporatePage,
});

const PLANS = [
  {
    icon: Building2,
    title: "Office Group Lunch",
    body: "Daily team lunches delivered hot to your workplace. Fixed menus, billed monthly.",
  },
  {
    icon: GraduationCap,
    title: "Startup Lunch Service",
    body: "Healthy, affordable meals for growing teams. Flexible headcount each day.",
  },
  {
    icon: Users,
    title: "PG / Hostel Bulk",
    body: "Reliable lunch & dinner for paying-guest accommodations and hostels at scale.",
  },
];

const PERKS = [
  "Minimum 10 meals per order",
  "Fixed monthly billing & GST invoice",
  "Dedicated coordinator on WhatsApp",
  "Customisable menu rotation",
  "Priority on-time delivery",
  "No palm oil, pure veg, hygienic packaging",
];

function CorporatePage() {
  const [form, setForm] = useState({
    name: "",
    org: "",
    phone: "",
    meals: "",
    area: "",
    notes: "",
  });

  const message =
    `Corporate / Bulk tiffin enquiry\n` +
    `Name: ${form.name}\n` +
    `Organisation: ${form.org}\n` +
    `Phone: ${form.phone}\n` +
    `Approx meals/day: ${form.meals}\n` +
    `Area/Sector: ${form.area}\n` +
    `Notes: ${form.notes}`;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Corporate & Bulk"
        title={
          <>
            Team lunches, <span className="text-primary">done right</span>
          </>
        }
        subtitle="Reliable bulk tiffin for offices, startups, PGs and hostels across Noida — pure, home-style and always on time. Tell us your needs and we'll build a plan."
      />

      {/* Plan types */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading className="mb-12" eyebrow="Built for Teams" title="Bulk plans we offer" />
          <div className="grid gap-5 sm:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
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

      {/* Perks + form */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Why teams choose us
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              Dependable, pure, scalable
            </h2>
            <ul className="mt-6 space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <Utensils className="h-6 w-6 text-terracotta" />
              <p className="text-sm text-muted-foreground">
                From <span className="font-semibold text-foreground">10 meals/day</span> to large
                hostel kitchens — we scale with you.
              </p>
            </div>
          </Reveal>

          <Reveal variant="right">
            <form className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h3 className="font-serif text-xl font-bold text-foreground">Request a bulk quote</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill this in and send it to us on WhatsApp — we'll reply with a custom plan.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="org">Organisation</Label>
                  <Input
                    id="org"
                    value={form.org}
                    onChange={(e) => setForm({ ...form, org: e.target.value })}
                    className="mt-1.5"
                    placeholder="Company / PG name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1.5"
                    placeholder="WhatsApp number"
                  />
                </div>
                <div>
                  <Label htmlFor="meals">Meals / day</Label>
                  <Input
                    id="meals"
                    value={form.meals}
                    onChange={(e) => setForm({ ...form, meals: e.target.value })}
                    className="mt-1.5"
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area / Sector</Label>
                  <Input
                    id="area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="mt-1.5"
                    placeholder="e.g. Sector 62"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-1.5"
                    placeholder="Veg preferences, timing, etc."
                    rows={3}
                  />
                </div>
              </div>
              <Button asChild variant="mustard" size="lg" className="mt-5 w-full">
                <a href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Send Enquiry on WhatsApp
                </a>
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
