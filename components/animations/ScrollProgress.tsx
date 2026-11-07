"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getLenis } from "./SmoothScroll";

const R = 22;
const C = 2 * Math.PI * R;

/** Bouton rond « haut de page » dont l'anneau suit la lecture (desktop). */
export function ScrollProgress() {
  const ring = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    let y = 0;
    let max = 0;
    const update = () => {
      frame = 0;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - p));
      setVisible(y > window.innerHeight * 0.9);
    };
    // Lectures dans l'événement (styles à jour), écriture à l'image suivante :
    // pas de recalcul forcé au milieu des animations.
    const onScroll = () => {
      y = window.scrollY;
      max = document.documentElement.scrollHeight - window.innerHeight;
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Revenir en haut de la page"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "group fixed bottom-6 right-6 z-[54] hidden size-14 place-items-center rounded-full bg-ivory/90 text-blue-deep shadow-[var(--shadow-float)] ring-1 ring-line backdrop-blur-md transition-[opacity,transform] duration-500 ease-[var(--ease-spring)] lg:grid",
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
      )}
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--color-line)" strokeWidth="2" />
        <circle
          ref={ring}
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="var(--color-framboise)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <ArrowUp className="size-5 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  );
}
