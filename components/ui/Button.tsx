"use client";

import { ArrowRight } from "lucide-react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "outline-light" | "accent";
type Size = "md" | "sm";

const base =
  "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-semibold tracking-[0.005em] transition-[color,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-luxe)] disabled:cursor-not-allowed disabled:opacity-55";

const sizes: Record<Size, string> = {
  md: "min-h-[3.25rem] px-7 text-[0.97rem]",
  sm: "min-h-11 px-5 text-[0.92rem]",
};

const variants: Record<Variant, string> = {
  primary: "bg-blue-deep text-ivory shadow-[0_10px_24px_-12px_rgb(18_61_88/0.7)]",
  light: "bg-ivory text-blue-deep shadow-[0_10px_24px_-14px_rgb(0_0_0/0.45)] on-dark",
  outline: "border border-blue-deep/25 bg-ivory/40 text-blue-deep",
  "outline-light": "border border-ivory/40 text-ivory on-dark",
  accent: "bg-framboise text-ivory shadow-[0_12px_26px_-12px_rgb(228_87_125/0.8)]",
};

/** Couleur de la goutte qui envahit le bouton depuis le pointeur. */
const fill: Record<Variant, string> = {
  primary: "bg-blue",
  light: "bg-citron",
  outline: "bg-blue-deep",
  "outline-light": "bg-ivory",
  accent: "bg-framboise-deep",
};

const hoverText: Record<Variant, string> = {
  primary: "",
  light: "",
  outline: "group-hover/btn:text-ivory group-focus-visible/btn:text-ivory",
  "outline-light": "group-hover/btn:text-blue-deep group-focus-visible/btn:text-blue-deep",
  accent: "",
};

const arrowBg: Record<Variant, string> = {
  primary: "bg-ivory/15",
  light: "bg-blue-deep text-ivory",
  outline: "bg-blue-deep text-ivory group-hover/btn:bg-ivory group-hover/btn:text-blue-deep",
  "outline-light": "bg-ivory/15 group-hover/btn:bg-blue-deep group-hover/btn:text-ivory",
  accent: "bg-ivory/20",
};

/** La goutte part de l'endroit où le pointeur entre dans le bouton. */
function setOrigin(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`);
}

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-[var(--fx,50%)] top-[var(--fy,50%)] -z-10 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[650ms] ease-[var(--ease-luxe)] group-hover/btn:scale-100 group-focus-visible/btn:scale-100",
          fill[variant],
        )}
      />
      <span className={cn("relative flex items-center gap-2.5 transition-colors duration-500", hoverText[variant])}>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "relative -mr-3 grid size-8 shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-500",
            arrowBg[variant],
          )}
        >
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/btn:translate-x-6" />
          <ArrowRight className="absolute size-4 -translate-x-6 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );
}

/** Attraction magnétique douce vers le pointeur (souris uniquement). */
const magnetic = {
  onPointerEnter: setOrigin,
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.16,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    setOrigin(e);
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
  },
};

type Common = { variant?: Variant; size?: Size; arrow?: boolean; className?: string };

type LinkBtnProps = Omit<ComponentProps<typeof TransitionLink>, "className"> & Common & { external?: boolean };

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  external,
  href,
  ...props
}: LinkBtnProps) {
  const cls = cn(base, sizes[size], variants[variant], arrow && "pr-5", className);
  if (external) {
    return (
      <a {...magnetic} href={href.toString()} className={cls} {...(props as ComponentProps<"a">)}>
        <Inner variant={variant} arrow={arrow}>
          {children}
        </Inner>
      </a>
    );
  }
  return (
    <TransitionLink {...magnetic} href={href} className={cls} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </TransitionLink>
  );
}

type BtnProps = ComponentProps<"button"> & Common;

export function Button({ variant = "primary", size = "md", arrow = false, className, children, ...props }: BtnProps) {
  return (
    <button {...magnetic} className={cn(base, sizes[size], variants[variant], arrow && "pr-5", className)} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
