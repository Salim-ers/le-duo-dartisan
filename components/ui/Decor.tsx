import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Flavour = "framboise" | "pistache" | "citron" | "blue" | "caramel";

const DOT: Record<Flavour, string> = {
  framboise: "bg-framboise",
  pistache: "bg-pistache",
  citron: "bg-citron",
  blue: "bg-blue",
  caramel: "bg-caramel",
};

/** Étiquette en pastille avec sa pastille de couleur. */
export function Chip({
  children,
  dot = "framboise",
  tone = "light",
  className,
}: {
  children: ReactNode;
  dot?: Flavour;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "chip",
        tone === "light" ? "bg-ivory/75 text-blue-deep ring-1 ring-line backdrop-blur-sm" : "bg-ivory/10 text-ivory ring-1 ring-ivory/20",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2.5 rounded-full", DOT[dot])} />
      {children}
    </span>
  );
}

const SHELL: Record<Flavour, [string, string]> = {
  framboise: ["#ec6d8f", "#d94a72"],
  pistache: ["#b2cd73", "#93b04f"],
  citron: ["#f7d955", "#e9c22e"],
  blue: ["#8fc1e3", "#5fa3d1"],
  caramel: ["#dcaa68", "#c48c42"],
};

/** Macaron stylisé : deux coques et une ganache. Purement décoratif. */
export function Macaron({ flavour = "framboise", className, style }: { flavour?: Flavour; className?: string; style?: CSSProperties }) {
  const [light, dark] = SHELL[flavour];
  return (
    <svg viewBox="0 0 120 92" className={cn("overflow-visible", className)} style={style} aria-hidden="true">
      <ellipse cx="60" cy="86" rx="44" ry="5" fill="#123d58" opacity="0.12" />
      {/* coque du bas */}
      <path d="M10 58 C10 50 110 50 110 58 C110 78 10 78 10 58Z" fill={light} />
      <path d="M14 66 C30 76 90 76 106 66 C104 74 16 74 14 66Z" fill={dark} opacity="0.55" />
      <path d="M12 56 h96" stroke={dark} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 5.2" />
      {/* ganache */}
      <rect x="13" y="43" width="94" height="13" rx="6.5" fill="#fff6e6" />
      {/* coque du haut */}
      <path d="M12 44 h96" stroke={dark} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 5.2" />
      <path d="M10 42 C10 10 110 10 110 42 C110 48 10 48 10 42Z" fill={light} />
      <path d="M12 40 C26 46 94 46 108 40 C108 46 12 46 12 40Z" fill={dark} opacity="0.5" />
      <ellipse cx="44" cy="25" rx="17" ry="6" fill="#fff" opacity="0.35" transform="rotate(-12 44 25)" />
    </svg>
  );
}

/**
 * Badge rond au texte qui tourne. Le texte est décoratif (aria-hidden) :
 * le lien ou le contenu central porte le sens.
 */
export function RotatingBadge({
  text,
  className,
  children,
  textClassName,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
  textClassName?: string;
}) {
  // Identifiant stable dérivé du texte (plusieurs badges peuvent cohabiter sur une page).
  const id = `badge-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
  return (
    <span className={cn("relative grid place-items-center rounded-full", className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className={cn("fill-current text-[19px] font-semibold uppercase tracking-[0.22em]", textClassName)}>
          <textPath href={`#${id}`} textLength="486">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** Halos de couleur flous qui dérivent lentement derrière un contenu. */
export function Glow({ className, variant = "cream" }: { className?: string; variant?: "cream" | "blue" }) {
  const colors =
    variant === "cream"
      ? ["bg-[#f9c9d6]", "bg-[#dcebc0]", "bg-[#fbe7a3]", "bg-[#cfe3f2]"]
      : ["bg-[#3d91c6]", "bg-[#e4577d]/50", "bg-[#9fbd5b]/40", "bg-[#2a7aae]"];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className={cn("animate-blob-a absolute -left-[10%] top-[8%] size-[46vmax] rounded-full opacity-70 blur-[90px]", colors[0])} />
      <div className={cn("animate-blob-b absolute -right-[12%] top-[-6%] size-[40vmax] rounded-full opacity-70 blur-[90px]", colors[1])} />
      <div className={cn("animate-blob-b absolute bottom-[-18%] left-[22%] size-[38vmax] rounded-full opacity-60 blur-[100px]", colors[2])} />
      <div className={cn("animate-blob-a absolute bottom-[4%] right-[8%] size-[26vmax] rounded-full opacity-60 blur-[80px]", colors[3])} />
    </div>
  );
}
