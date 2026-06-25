import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, MessageCircle } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_GROUPS } from "@/lib/faq-data";
import { buildWhatsAppLink } from "@/lib/brand";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Tiffin Service Questions Answered | Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Frequently asked questions about Maa Jaisa Tiffin — ordering, cut-off rules, meal plans, pause, cancellation, delivery, payment and purity in Noida.",
      },
      { property: "og:title", content: "FAQ — Maa Jaisa Tiffin Noida" },
      {
        property: "og:description",
        content: "Answers about ordering, plans, delivery and payment.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_GROUPS.flatMap((g) =>
            g.items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const categories = ["All", ...FAQ_GROUPS.map((g) => g.category)];
  const [active, setActive] = useState("All");
  const groups = active === "All" ? FAQ_GROUPS : FAQ_GROUPS.filter((g) => g.category === active);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Help Centre"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about ordering home-style tiffin from Maa Jaisa Tiffin in Noida."
      />

      <section className="bg-background py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Category filter */}
          <Reveal className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                  active === c
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </Reveal>

          <div className="space-y-10">
            {groups.map((group) => (
              <Reveal key={group.category}>
                <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                  <HelpCircle className="h-5 w-5 text-primary" /> {group.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {group.items.map((f, i) => (
                    <AccordionItem
                      key={i}
                      value={`${group.category}-${i}`}
                      className="card-lift rounded-xl border border-border bg-card px-5 shadow-sm"
                    >
                      <AccordionTrigger className="text-left font-serif text-base font-semibold text-foreground">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 rounded-2xl border border-border bg-cream p-7 text-center shadow-sm">
            <h3 className="font-serif text-xl font-bold text-foreground">Still have a question?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Our team is a message away — we usually reply within minutes.
            </p>
            <Button asChild variant="mustard" size="lg" className="mt-5">
              <a
                href={buildWhatsAppLink("Hi! I have a question about Maa Jaisa Tiffin.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
              </a>
            </Button>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
