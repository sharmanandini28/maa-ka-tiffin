import { Link } from "@tanstack/react-router";
import emblem from "@/assets/brand-emblem.png";

export function Logo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "compact" | "footer";
}) {
  const footer = variant === "footer";
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ring-1 transition-transform duration-300 group-hover:scale-105 ${
          footer ? "h-12 w-12 bg-background/10 ring-background/20" : "h-12 w-12 bg-primary/8 ring-primary/15"
        }`}
      >
        <img
          src={emblem}
          alt="Maa Jaisa Tiffin"
          width={48}
          height={48}
          className="h-9 w-9 object-contain"
        />
      </span>
      {variant !== "compact" && (
        <span className="leading-[1.05]">
          <span
            className={`block font-serif text-[1.35rem] font-bold ${
              footer ? "text-background" : "text-foreground"
            }`}
          >
            Maa Jaisa
          </span>
          <span
            className={`-mt-0.5 block font-serif text-[1.35rem] font-bold ${
              footer ? "text-mustard" : "text-primary"
            }`}
          >
            Tiffin
          </span>
        </span>
      )}
    </Link>
  );
}
