"use client";

import { useRef } from "react";
import { SplitReveal } from "@/components/animations/Reveal";
import { TransitionLink } from "@/components/animations/PageTransition";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";
import type { ImageKey } from "@/data/images";

/** Les trois piliers révélés au défilement : pain, pâtisserie, gâteau d'occasion. */
const trio: { image: ImageKey; title: string; text: string; href: string }[] = [
  { image: "baguettesCroisees", title: "Le pain", text: "Croûte dorée, mie alvéolée", href: "/nos-creations?categorie=pains" },
  { image: "vitrinePatisseries", title: "La pâtisserie", text: "Une vitrine qui change avec les saisons", href: "/nos-creations?categorie=patisseries" },
  { image: "numberCake", title: "Le gâteau d'occasion", text: "Imaginé pour vos fêtes", href: "/gateaux-sur-mesure" },
];

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Entrée chorégraphiée : la photo se dévoile par masque, puis les détails.
      mm.add(MQ.motion, () => {
        gsap.set(q("[data-frame]"), { clipPath: "inset(22% 16% 22% 16%)" });
        gsap.set(q("[data-frame-img]"), { scale: 1.28 });
        gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 16 });
        return onStageReady(() => {
          gsap
            .timeline()
            .to(q("[data-frame]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.inOut" })
            .to(q("[data-frame-img]"), { scale: 1.06, duration: 2.4, ease: "expo.out" }, 0.2)
            .to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: "expo.out" }, 1.15);
        });
      });

      // Desktop : la photo se resserre et devient la colonne centrale d'un triptyque.
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.9,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.to(q("[data-copy]"), { autoAlpha: 0, y: -70, duration: 0.3, ease: "power2.in" }, 0)
          .to(q("[data-scrim]"), { autoAlpha: 0, duration: 0.3 }, 0)
          .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.1 }, 0)
          .to(q("[data-shrink]"), { clipPath: "inset(10% 35% 17% 35%)", duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-side='0']"), { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 0.3)
          .fromTo(q("[data-side='2']"), { yPercent: 135, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 0.4)
          .fromTo(q("[data-trio-caption]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07 }, 0.85);

        // Parallaxe au pointeur
        const img = q("[data-frame-img]")[0];
        const copy = q("[data-copy]")[0];
        const ix = gsap.quickTo(img, "x", { duration: 1.2, ease: "power3" });
        const iy = gsap.quickTo(img, "y", { duration: 1.2, ease: "power3" });
        const cx = gsap.quickTo(copy, "x", { duration: 1.4, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ix(nx * -22);
          iy(ny * -14);
          cx(nx * 8);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
      <section
        ref={root}
        aria-label="Bienvenue"
        className="relative h-[calc(100svh-var(--header-h)-68px)] min-h-[560px] overflow-hidden bg-cream lg:h-[calc(100svh-var(--header-h))] lg:min-h-[640px]"
      >
        {/* Photo principale (devient la colonne centrale du triptyque sur desktop) */}
        <div data-shrink className="absolute inset-x-3 bottom-3 top-0 lg:inset-x-[var(--gutter)] lg:bottom-[var(--gutter)]" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <div data-frame className="moulure absolute inset-0 overflow-hidden bg-blue-deep">
            <div data-frame-img className="absolute -inset-6 will-change-transform">
              <Photo name="vitrinePatisseries" sizes="100vw" preload focus="42% 38%" />
            </div>
            <div
              data-scrim
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_45_66/0.45)_0%,rgb(13_45_66/0.08)_24%,rgb(13_45_66/0.18)_48%,rgb(13_45_66/0.88)_100%)]"
            />
          </div>
        </div>

        {/* Colonnes latérales du triptyque (desktop animé uniquement) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block motion-reduce:hidden">
          <div data-side="0" className="absolute bottom-[23%] left-[var(--gutter)] top-[18%] w-[calc(33%-var(--gutter)*1.4)] invisible overflow-hidden">
            <Photo name="baguettesCroisees" sizes="33vw" focus="50% 50%" />
          </div>
          <div data-side="2" className="absolute bottom-[11%] right-[var(--gutter)] top-[5%] w-[calc(33%-var(--gutter)*1.4)] invisible overflow-hidden">
            <Photo name="numberCake" sizes="33vw" />
          </div>
        </div>
        <div className="absolute inset-0 hidden lg:block motion-reduce:hidden">
          {trio.map((t, i) => (
            <div
              key={t.title}
              data-trio-caption
              className="invisible absolute w-[26%] opacity-0"
              style={
                i === 0
                  ? { left: "var(--gutter)", bottom: "9%" }
                  : i === 1
                    ? { left: "35%", bottom: "6%" }
                    : { right: "var(--gutter)", top: "calc(89% + 0.6rem)", textAlign: "right" }
              }
            >
              <TransitionLink href={t.href} className="group block">
                <span className="t-h3 block text-blue-deep">{t.title}</span>
                <span className="t-caption block text-mute transition-colors group-hover:text-blue">{t.text}</span>
              </TransitionLink>
            </div>
          ))}
        </div>

        {/* Texte d'accroche */}
        <div
          data-copy
          className="on-dark absolute inset-x-3 bottom-3 top-0 flex flex-col justify-between p-6 text-ivory sm:p-9 lg:inset-x-[var(--gutter)] lg:bottom-[var(--gutter)] lg:p-14"
        >
          <div data-fade className="flex items-start justify-between gap-6">
            <p className="t-caption text-ivory/90">Boulangerie et pâtisserie artisanales</p>
            <p className="t-caption hidden text-right text-ivory/90 sm:block">Rantigny, dans l’Oise</p>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_minmax(300px,380px)] lg:gap-16">
            <SplitReveal as="h1" onStage delay={0.9} className="t-hero max-w-[13ch] text-balance">
              Chaque création a le goût d’une passion.
            </SplitReveal>
            <div className="flex flex-col gap-6">
              <p data-fade className="max-w-sm text-[1.02rem] leading-relaxed text-ivory/90">
                Pains, viennoiseries et pâtisseries imaginés avec gourmandise, au cœur de Rantigny.
              </p>
              <div data-fade className="flex flex-wrap gap-3">
                <ButtonLink href="/nos-creations" variant="light">
                  Découvrir nos créations
                </ButtonLink>
                <ButtonLink href="/gateaux-sur-mesure" variant="outline-light">
                  Commander un gâteau
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur de défilement */}
        <div data-cue aria-hidden="true" className="absolute bottom-[calc(var(--gutter)+1.5rem)] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-ivory/85 lg:flex motion-reduce:hidden">
          <span data-fade className="flex flex-col items-center gap-3">
            <span className="t-small">Défiler</span>
            <span className="relative h-12 w-px overflow-hidden bg-ivory/30">
              <span className="absolute inset-x-0 top-0 h-1/3 bg-ivory [animation:scroll-cue_2.2s_var(--ease-luxe)_infinite]" />
            </span>
          </span>
        </div>
      </section>

      {/* Triptyque statique : mobile, tablette et mouvement réduit */}
      <section aria-label="Nos trois savoir-faire" className="bg-cream pb-6 pt-12 lg:hidden lg:motion-reduce:block lg:motion-reduce:pb-16">
        <div className="scroll-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] lg:grid lg:grid-cols-3 lg:gap-8">
          {trio.map((t) => (
            <TransitionLink key={t.title} href={t.href} className="group w-[72vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                <Photo name={t.image} sizes="(min-width: 1024px) 33vw, 72vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <span className="t-h3 mt-4 block text-blue-deep">{t.title}</span>
              <span className="t-caption block text-mute">{t.text}</span>
            </TransitionLink>
          ))}
        </div>
      </section>
    </>
  );
}
