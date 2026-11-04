"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";
import { cn } from "@/lib/utils";

type RevealKind = "up" | "down" | "left" | "right" | "circle" | "arch";

/** Appelle `cb` une seule fois, quand l'élément entre à l'écran et que la scène est visible. */
function onceInView(el: Element, cb: () => void) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      cb();
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  const cancelStage = onStageReady(() => io.observe(el));
  return () => {
    cancelStage();
    io.disconnect();
  };
}

/**
 * Photographie révélée par masque à son entrée dans l'écran (transition CSS,
 * voir globals.css), avec parallaxe interne facultative au défilement.
 * Le contenu à déplacer porte data-parallax (voir la prop `parallax` de Photo).
 */
export function RevealImage({
  children,
  className,
  kind = "up",
  parallax = 0,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  kind?: RevealKind;
  /** Amplitude de la parallaxe interne, en % (0 = aucune). */
  parallax?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => onceInView(ref.current!, () => ref.current?.setAttribute("data-in", "")), []);

  useGSAP(
    () => {
      if (!parallax) return;
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>("[data-parallax]");
      if (!inner) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          inner,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-reveal={kind}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
      className={cn("relative overflow-hidden", className)}
    >
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
  id,
  onStage = false,
  delay = 0,
  stagger = 0.09,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
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
        let split: SplitText | null = null;
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
        const cancel = onStage ? onStageReady(run) : onceInView(el, run);
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
    <Tag ref={ref} id={id} data-split="" className={className}>
      {children}
    </Tag>
  );
}
