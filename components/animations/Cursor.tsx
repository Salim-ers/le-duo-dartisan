"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Curseur discret (desktop uniquement) : un anneau qui suit le pointeur
 * et s'ouvre au survol des éléments interactifs. Le curseur système reste visible.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const ok =
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role='button'], label");
      const view = t?.dataset.cursor;
      gsap.to(el, {
        scale: view ? 2.6 : t ? 1.6 : 1,
        backgroundColor: view ? "rgba(18,61,88,0.88)" : "rgba(18,61,88,0)",
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
      if (label.current) {
        label.current.textContent = view ?? "";
        gsap.to(label.current, { autoAlpha: view ? 1 : 0, duration: 0.2, overwrite: "auto" });
      }
    };
    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      shown = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] grid size-7 place-items-center rounded-full border border-blue-deep/50 opacity-0 mix-blend-normal max-lg:hidden"
    >
      <span ref={label} className="text-[5px] font-semibold tracking-wide text-ivory opacity-0" />
    </div>
  );
}
