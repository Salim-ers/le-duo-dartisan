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

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      anchors: true,
      // Une fenêtre ouverte (menu, fiche, visionneuse) verrouille le défilement :
      // Lenis se retire, la molette ne fait défiler que le contenu de la fenêtre.
      virtualScroll: () => !document.body.hasAttribute("data-scroll-locked"),
    });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    // En tête de file, avant le rendu des animations GSAP : la page défile puis les
    // animations écrivent leurs styles. Dans l'autre ordre, chaque lecture de la position
    // de défilement forçait un recalcul complet des styles à chaque image.
    gsap.ticker.add(tick, false, true);
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
