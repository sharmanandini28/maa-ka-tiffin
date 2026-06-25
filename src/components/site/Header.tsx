import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/plans", label: "Plans" },
  { to: "/subscription", label: "Subscription" },
  { to: "/khet-se-rasoi-tak", label: "Our Story" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const MORE = [
  { to: "/hygiene", label: "Hygiene Promise" },
  { to: "/delivery-areas", label: "Delivery Areas" },
  { to: "/corporate", label: "Corporate / Bulk" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              activeProps={{ className: "text-primary font-semibold after:w-full" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <a
            href={buildWhatsAppLink("Hi! I'd like to order from Maa Jaisa Tiffin.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="icon-hop flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:bg-primary/5"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Button asChild variant="mustard" size="sm">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-border/60 bg-background transition-[max-height,opacity] duration-300 ease-out xl:hidden ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
          {[...NAV, ...MORE].map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 25}ms` : "0ms" }}
              className="flex items-center justify-between rounded-md px-2 py-3 text-base font-medium text-foreground/85 transition-colors hover:bg-secondary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
          <Button asChild variant="mustard" className="mt-3">
            <Link to="/order" onClick={() => setOpen(false)}>
              Order Now
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
