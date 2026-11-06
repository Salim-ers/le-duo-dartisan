"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Photo qui s'élargit au défilement : elle entre comme une carte arrondie
 * au centre, puis s'ouvre jusqu'aux bords du conteneur pendant que l'image se pose.
 * Sans mouvement : affichée directement à sa taille finale.
 */
export function ExpandImage({
  children,
  className,
  radius = 40,
}: {
  children: ReactNode;
  className?: string;
  /** Arrondi final, en pixels. */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const scrollTrigger = { trigger: el, start: "top bottom", end: "center 55%", scrub: 0.7 };
        gsap.fromTo(
          el,
          { clipPath: "inset(6% 14% 6% 14% round 999px)" },
          { clipPath: `inset(0% 0% 0% 0% round ${radius}px)`, ease: "power2.out", scrollTrigger },
        );
        gsap.fromTo(el.querySelector("[data-expand-img]"), { scale: 1.3 }, { scale: 1, ease: "power2.out", scrollTrigger });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={{ borderRadius: radius }}>
      <div data-expand-img className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
