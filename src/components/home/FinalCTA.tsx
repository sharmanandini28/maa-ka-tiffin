import { Link } from "@tanstack/react-router";
import { ShoppingBag, MessageCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/brand";

export function FinalCTA() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-forest px-6 py-14 text-center shadow-deep sm:px-12">
            <div className="motif-dots pointer-events-none absolute inset-0 opacity-20" />
            <div
              className="float-slow pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mustard/20 blur-2xl"
              aria-hidden
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-background/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground">
              <Leaf className="h-3.5 w-3.5" /> Ghar Ka Khana, Pyaar Ke Saath
            </span>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-serif text-3xl font-bold text-primary-foreground text-balance sm:text-4xl md:text-5xl">
              Aaj se ghar jaisa khana, har din.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
              Pre-order your next pure, home-style tiffin in under a minute — or message us on
              WhatsApp and we'll take it from there.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="mustard" size="xl">
                <Link to="/order">
                  <ShoppingBag className="h-5 w-5" /> Order Now
                </Link>
              </Button>
              <a
                href={buildWhatsAppLink("Hi! I'd like to start with Maa Jaisa Tiffin.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-background/30 bg-background/10 px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-background/20"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
