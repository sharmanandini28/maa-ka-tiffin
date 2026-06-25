import { Link } from "@tanstack/react-router";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_GROUPS } from "@/lib/faq-data";

const PREVIEW = [
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[1].items[1],
  FAQ_GROUPS[0].items[1],
  FAQ_GROUPS[3].items[0],
  FAQ_GROUPS[5].items[0],
];

export function FaqPreview() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Got Questions?"
            title="Everything you want to know"
            subtitle="Quick answers about ordering, cut-offs and plans. For the full list, visit our FAQ page."
          />
          <Reveal delay={120}>
            <Button asChild variant="hero" size="lg" className="mt-7">
              <Link to="/faq">
                <HelpCircle className="h-4 w-4" /> Read all FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal variant="right">
          <Accordion type="single" collapsible className="space-y-3">
            {PREVIEW.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="card-lift rounded-xl border border-border bg-card px-5 shadow-sm"
              >
                <AccordionTrigger className="text-left font-serif text-base font-semibold text-foreground">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
