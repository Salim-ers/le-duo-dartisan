import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Flavour = "framboise" | "pistache" | "citron" | "blue" | "caramel";

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

type Halo = {
  /** Couleur en « r g b » et opacité au centre. */
  rgb: string;
  alpha: number;
  /** Diamètre du disque coloré, en vmax. */
  size: number;
  /** Position du disque (bords du conteneur, en %). */
  at: Partial<Record<"left" | "right" | "top" | "bottom", string>>;
  drift: "a" | "b";
};

const HALOS: Record<"cream" | "blue", Halo[]> = {
  cream: [
    { rgb: "249 201 214", alpha: 0.7, size: 46, at: { left: "-10%", top: "8%" }, drift: "a" },
    { rgb: "220 235 192", alpha: 0.7, size: 40, at: { right: "-12%", top: "-6%" }, drift: "b" },
    { rgb: "251 231 163", alpha: 0.6, size: 38, at: { left: "22%", bottom: "-18%" }, drift: "b" },
    { rgb: "207 227 242", alpha: 0.6, size: 26, at: { right: "8%", bottom: "4%" }, drift: "a" },
  ],
  blue: [
    { rgb: "61 145 198", alpha: 0.7, size: 46, at: { left: "-10%", top: "8%" }, drift: "a" },
    { rgb: "228 87 125", alpha: 0.35, size: 40, at: { right: "-12%", top: "-6%" }, drift: "b" },
    { rgb: "159 189 91", alpha: 0.24, size: 38, at: { left: "22%", bottom: "-18%" }, drift: "b" },
    { rgb: "42 122 174", alpha: 0.6, size: 26, at: { right: "8%", bottom: "4%" }, drift: "a" },
  ],
};

/** Le dégradé déborde du disque d'un quart de son diamètre de chaque côté, comme le ferait un flou. */
const SPREAD = 1.5;

function haloStyle(h: Halo): CSSProperties {
  const pad = ((SPREAD - 1) / 2) * h.size;
  const c = (a: number) => `rgb(${h.rgb} / ${+(h.alpha * a).toFixed(3)})`;
  const style: CSSProperties = {
    width: `${h.size * SPREAD}vmax`,
    height: `${h.size * SPREAD}vmax`,
    // Profil proche d'un flou gaussien : plein au centre, moitié au bord du disque, nul au-delà.
    background: `radial-gradient(closest-side, ${c(1)} 0%, ${c(0.92)} 45%, ${c(0.5)} 67%, ${c(0.12)} 85%, ${c(0)} 100%)`,
  };
  for (const [side, value] of Object.entries(h.at)) {
    (style as Record<string, string>)[side] = `calc(${value} - ${pad}vmax)`;
  }
  return style;
}

/**
 * Halos de couleur qui dérivent lentement derrière un contenu.
 * Dégradés radiaux plutôt que `filter: blur()` : même douceur, sans flou
 * recalculé par la carte graphique à chaque image de l'animation.
 */
export function Glow({ className, variant = "cream" }: { className?: string; variant?: "cream" | "blue" }) {
  return (
    // content-visibility: auto : hors de l'écran, le navigateur ne rend plus les halos
    // ni leur dérive (la section garde sa taille, les halos sont en position absolue).
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden [content-visibility:auto]", className)}>
      {HALOS[variant].map((h, i) => (
        <div key={i} className={cn("absolute", h.drift === "a" ? "animate-blob-a" : "animate-blob-b")} style={haloStyle(h)} />
      ))}
    </div>
  );
}
