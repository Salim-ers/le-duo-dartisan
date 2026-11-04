"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out" });
  // Sur mobile, la barre d'adresse qui se replie ne doit pas recalculer les séquences.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Règles qui évitent les plantages et les sauts :
 * - pas de `pin` : les séquences utilisent `position: sticky` + un `scrub` ;
 * - pas de `once` : les apparitions uniques passent par IntersectionObserver.
 */

/** Points de rupture partagés par toutes les animations. */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
