import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const alignment =
    align === "center" ? "mx-auto text-center items-center" : "text-left items-start";
  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground text-balance sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
