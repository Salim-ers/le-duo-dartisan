"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";
import { cn } from "@/lib/utils";

type RevealKind = "up" | "down" | "left" | "right" | "circle" | "arch";

const FROM: Record<RevealKind, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  circle: "circle(8% at 50% 55%)",
  arch: "inset(100% 0% 0% 0% round 50% 50% 0 0)",
};
const TO: Record<RevealKind, string> = {
  up: "inset(0% 0% 0% 0%)",
  down: "inset(0% 0% 0% 0%)",
  left: "inset(0% 0% 0% 0%)",
  right: "inset(0% 0% 0% 0%)",
  circle: "circle(75% at 50% 50%)",
  arch: "inset(0% 0% 0% 0% round 50% 50% 0 0)",
};

/**
 * Photographie révélée par clip-path à l'entrée dans l'écran,
 * avec parallaxe interne facultative (contenu marqué data-parallax).
 */
export function RevealImage({
  children,
  className,
  kind = "up",
  parallax = 0,
  scale = 1.18,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  kind?: RevealKind;
  /** Amplitude de la parallaxe interne, en % (0 = aucune). */
  parallax?: number;
  scale?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>("[data-parallax]");
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(el, { clipPath: FROM[kind] });
        if (inner) gsap.set(inner, { scale });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          delay,
        });
        tl.to(el, { clipPath: TO[kind], duration: 1.4, ease: "expo.out" });
        if (inner) tl.to(inner, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);

        if (parallax && inner) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}

/**
 * Texte révélé ligne par ligne (SplitText + masque).
 * `onStage` : se déclenche à l'arrivée sur la page plutôt qu'au défilement.
 */
export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  onStage = false,
  delay = 0,
  stagger = 0.09,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  onStage?: boolean;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // opacity (et non visibility) : le titre reste lisible par les lecteurs d'écran.
        gsap.set(el, { opacity: 0 });
        let split: SplitText | null = null;
        let cancel = () => {};
        // Le découpage en lignes (coûteux) n'a lieu qu'au moment de l'animation.
        const run = () => {
          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 });
              self.masks?.forEach((m) => m.classList.add("split-line-mask"));
              return gsap.from(self.lines, { yPercent: 110, duration: 1.15, ease: "expo.out", stagger, delay });
            },
          });
        };
        if (onStage) cancel = onStageReady(run);
        else {
          const st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
          cancel = () => st.kill();
        }
        return () => {
          cancel();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Rafraîchit les déclencheurs quand les images ont fini de charger. */
export function refreshOnLoad() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
