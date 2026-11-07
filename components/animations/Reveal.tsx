"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { hasNavigated, onStageReady } from "@/lib/stage";
import { cn } from "@/lib/utils";

type RevealKind = "up" | "left" | "right" | "pill" | "circle";

/**
 * Appelle `cb` une seule fois, quand l'élément entre à l'écran et que la scène est visible.
 * `atLanding` : l'élément était déjà visible à l'arrivée sur le site (première page, sans défiler).
 */
function onceInView(el: Element, cb: (atLanding: boolean) => void) {
  let first = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      const initial = first;
      first = false;
      if (!entry.isIntersecting) return;
      io.disconnect();
      // Arrivée = première page, élément déjà à l'écran, dans les premières secondes de la visite
      // (pas après un filtre ou une interaction).
      cb(initial && !hasNavigated() && performance.now() < 6000);
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
 * Photographie révélée par un masque aux coins arrondis à son entrée dans l'écran
 * (transition CSS, voir globals.css), avec parallaxe interne facultative au défilement.
 * Le contenu à déplacer porte data-parallax (voir la prop `parallax` de Photo).
 * `radius` doit correspondre à l'arrondi du cadre : le bord qui avance reste arrondi.
 */
export function RevealImage({
  children,
  className,
  kind = "up",
  parallax = 0,
  delay = 0,
  radius = "1.75rem",
  style,
}: {
  children: ReactNode;
  className?: string;
  kind?: RevealKind;
  /** Amplitude de la parallaxe interne, en % (0 = aucune). */
  parallax?: number;
  delay?: number;
  radius?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      onceInView(ref.current!, (atLanding) => {
        // Visible dès l'arrivée : c'est souvent l'image principale (LCP), révélation plus courte.
        if (atLanding) ref.current?.setAttribute("data-quick", "");
        ref.current?.setAttribute("data-in", "");
      }),
    [],
  );

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
      style={{ "--r": radius, ...(delay ? { "--reveal-delay": `${delay}s` } : {}), ...style } as CSSProperties}
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

/**
 * Apparition douce (fondu + montée) à l'entrée dans l'écran.
 * `stagger` : les enfants directs apparaissent l'un après l'autre.
 */
export function FadeIn({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 28,
  stagger = 0,
  onStage = false,
  id,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  onStage?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const run = () => {
          if (stagger) {
            gsap.set(el, { opacity: 1 });
            gsap.fromTo(el.children, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger, delay });
          } else {
            gsap.fromTo(el, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", delay });
          }
        };
        return onStage ? onStageReady(run) : onceInView(el, run);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-fade="" className={className}>
      {children}
    </Tag>
  );
}
