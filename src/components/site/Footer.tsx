import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, Phone, Clock, Leaf, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { buildWhatsAppLink } from "@/lib/brand";

const COLS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { to: "/menu", label: "Weekly Menu" },
      { to: "/plans", label: "Plans & Pricing" },
      { to: "/subscription", label: "Subscription" },
      { to: "/order", label: "Order Now" },
      { to: "/khet-se-rasoi-tak", label: "Khet Se Rasoi Tak" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/hygiene", label: "Hygiene Promise" },
      { to: "/delivery-areas", label: "Delivery Areas" },
      { to: "/corporate", label: "Corporate / Bulk" },
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/cancellation-policy", label: "Cancellation" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const HIGHLIGHTS = ["No Palm Oil", "No Milawat", "Farm Sourced", "Fresh Daily"];

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Subscription CTA band */}
      <div className="bg-gradient-forest">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-serif text-2xl font-bold text-primary-foreground sm:text-3xl">
              Ghar ka khana, har din — fikar-free.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              Start a monthly subscription and let us handle lunch & dinner with farm-fresh, pure
              ingredients.
            </p>
          </div>
          <Link
            to="/subscription"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mustard px-6 py-3 text-sm font-semibold text-mustard-foreground shadow-soft transition-transform hover:scale-105"
          >
            Start Subscription <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="bg-terracotta py-3 text-center font-serif text-base text-terracotta-foreground">
        ✦&nbsp;&nbsp;Good food, good time. That's the Maa Jaisa way.&nbsp;&nbsp;✦
      </div>

      <div className="border-t border-border/60 bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Ghar Ka Khana, Pyaar Ke Saath. Pre-order based home-style vegetarian tiffin for Noida —
              made with farm-fresh, trusted-source ingredients.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Noida, Uttar Pradesh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +91 93112 34567
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Lunch 12–2 PM · Dinner 7–9 PM
              </p>
            </div>
            <a
              href={buildWhatsAppLink("Hi! I'd like to know more about Maa Jaisa Tiffin.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-base font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Our Promise</h4>
            <ul className="mt-3 space-y-2">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="h-3.5 w-3.5 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} Maa Jaisa Tiffin. All rights reserved.</p>
            <Link to="/auth" className="transition-colors hover:text-primary">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
