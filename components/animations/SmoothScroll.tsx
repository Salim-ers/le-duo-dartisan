"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/**
 * Défilement doux uniquement sur écrans à pointeur précis, sans préférence
 * de mouvement réduit. Sur tactile, le défilement natif est conservé.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: true });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!document.documentElement.classList.contains("intro-done")) lenis.stop();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
