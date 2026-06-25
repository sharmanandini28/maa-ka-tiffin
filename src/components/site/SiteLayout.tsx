import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { buildWhatsAppLink } from "@/lib/brand";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border/60 bg-background/95 p-3 backdrop-blur-md lg:hidden">
      <Link
        to="/order"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mustard px-4 py-3 text-sm font-semibold text-mustard-foreground shadow-soft transition-transform active:scale-95"
      >
        <ShoppingBag className="h-4 w-4" /> Order Now
      </Link>
      <a
        href={buildWhatsAppLink("Hi! I'd like to know more about Maa Jaisa Tiffin.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform active:scale-95"
      >
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-cream">
      <div className="motif-dots pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="float-slow pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-terracotta/10 blur-2xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.06] text-foreground text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
          </Reveal>
        )}
      </div>
      {image && (
        <div className="relative mx-auto -mb-px max-w-5xl px-4 sm:px-6">
          <Reveal variant="scale">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-48 w-full rounded-t-[2rem] object-cover shadow-deep sm:h-64"
            />
          </Reveal>
        </div>
      )}
    </section>
  );
}
