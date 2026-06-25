import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, MapPin, Clock, Truck, Mail, Send } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  buildWhatsAppLink,
  NOIDA_SECTORS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Maa Jaisa Tiffin Noida | Orders, Plans & Support" },
      {
        name: "description",
        content:
          "Contact Maa Jaisa Tiffin in Noida. WhatsApp us for orders, late orders, corporate plans and delivery in Sector 62, 63, 76, 137 and nearby sectors.",
      },
      { property: "og:title", content: "Contact — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Reach us on WhatsApp for orders and delivery in Noida.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const INQUIRY = [
  "General question",
  "New order",
  "Late order",
  "Subscription",
  "Corporate / bulk",
  "Feedback",
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", type: "General question", message: "" });
  const msg = `Contact enquiry (${form.type})\nName: ${form.name}\nPhone: ${form.phone}\nMessage: ${form.message}`;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Get in Touch"
        title={
          <>
            We're a <span className="text-primary">message</span> away
          </>
        }
        subtitle="Have a question, want to place a late order, or set up a corporate plan? Reach out — we usually reply within minutes."
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Info column */}
          <Reveal variant="left" className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Reach Maa Jaisa Tiffin
              </h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </span>
                  {SUPPORT_PHONE_DISPLAY}
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  {SUPPORT_EMAIL}
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  Noida, Uttar Pradesh
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>Lunch delivery 12:00–2:00 PM · Dinner delivery 7:00–9:00 PM</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Truck className="h-5 w-5" />
                  </span>
                  <span>
                    Serving: {NOIDA_SECTORS.filter((s) => s.startsWith("Sector")).join(", ")} &
                    nearby PG/office areas.
                  </span>
                </li>
              </ul>
              <Button asChild variant="mustard" size="lg" className="mt-6 w-full">
                <a
                  href={buildWhatsAppLink("Hi! I'd like to know more about Maa Jaisa Tiffin.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-foreground">Booking cut-off</h3>
              <div className="mt-4 space-y-3 text-sm">
                <p className="rounded-xl border border-border bg-card p-3">
                  <span className="font-semibold text-primary">Tomorrow's Lunch</span> — before
                  12:00 AM (midnight) the night before.
                </p>
                <p className="rounded-xl border border-border bg-card p-3">
                  <span className="font-semibold text-terracotta">Today's Dinner</span> — before
                  12:00 PM (noon) the same day.
                </p>
                <p className="rounded-xl border border-border bg-card p-3">
                  <span className="font-semibold text-foreground">Late Orders</span> — via WhatsApp,
                  subject to availability.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal variant="right">
            <form className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill this in and we'll continue on WhatsApp.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1.5"
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>Inquiry type</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INQUIRY.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        form.type === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1.5"
                  rows={4}
                  placeholder="How can we help?"
                />
              </div>

              <Button asChild variant="mustard" size="lg" className="mt-5 w-full">
                <a href={buildWhatsAppLink(msg)} target="_blank" rel="noopener noreferrer">
                  <Send className="h-5 w-5" /> Send via WhatsApp
                </a>
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
