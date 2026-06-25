import { Link } from "@tanstack/react-router";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { buildWhatsAppLink } from "@/lib/brand";

export function CtaBand({
  title,
  subtitle,
  primaryLabel = "Order Now",
  primaryTo = "/order",
  whatsappMessage = "Hi! I'd like to know more about Maa Jaisa Tiffin.",
}: {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background px-6 py-12 text-center shadow-soft sm:px-12">
            <div className="motif-dots pointer-events-none absolute inset-0 opacity-40" />
            <h2 className="relative font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
                {subtitle}
              </p>
            )}
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="mustard" size="xl">
                <Link to={primaryTo}>
                  <ShoppingBag className="h-5 w-5" /> {primaryLabel}
                </Link>
              </Button>
              <Button asChild variant="hero" size="xl">
                <a
                  href={buildWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
