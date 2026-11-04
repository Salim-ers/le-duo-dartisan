"use client";

import { useRef } from "react";
import { FlourDust } from "@/components/animations/FlourDust";
import { SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";

/**
 * Ouverture : nuage de farine sur fond noir, poussière animée, titre ligne à ligne.
 * Au défilement (desktop), la photo se referme en arche, la forme d'une porte de
 * fournil, entre les deux moitiés de la devise.
 */
export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // Après l'intro, la photo est déjà entièrement visible à travers le logo.
      const afterIntro = !document.documentElement.classList.contains("intro-done");

      mm.add(MQ.motion, () => {
        const breathing = gsap.to(q("[data-breathe]"), { scale: 1.07, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
        const cancel = onStageReady(() => {
          const tl = gsap.timeline();
          if (!afterIntro) {
            tl.fromTo(q("[data-frame]"), { clipPath: "inset(22% 16% 22% 16%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "expo.inOut" }).fromTo(
              q("[data-img]"),
              { scale: 1.28 },
              { scale: 1, duration: 2.4, ease: "expo.out" },
              0.2,
            );
          }
          tl.fromTo(
            q("[data-fade]"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: "expo.out" },
            afterIntro ? 0.45 : 1.15,
          );
        });
        return () => {
          cancel();
          breathing.kill();
        };
      });

      mm.add(MQ.desktop, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.9 } })
          .to(q("[data-copy]"), { autoAlpha: 0, y: -70, duration: 0.3, ease: "power2.in" }, 0)
          .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.1 }, 0)
          .to(q("[data-scrim]"), { autoAlpha: 0, duration: 0.35 }, 0.05)
          .fromTo(
            q("[data-shrink]"),
            { clipPath: "inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)" },
            { clipPath: "inset(9% 32% 7% 32% round 18vw 18vw 0vw 0vw)", duration: 1, ease: "power2.inOut" },
            0.05,
          )
          .to(q("[data-recenter]"), { x: "-21vw", duration: 1, ease: "power2.inOut" }, 0.05)
          .fromTo(q("[data-word='left']"), { autoAlpha: 0, x: "-5vw" }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0.62)
          .fromTo(q("[data-word='right']"), { autoAlpha: 0, x: "5vw" }, { autoAlpha: 1, x: 0, duration: 0.5 }, 0.68)
          .to({}, { duration: 0.3 });

        // Parallaxe au pointeur
        const img = q("[data-img]")[0];
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
    <div ref={root} className="relative -mt-[var(--header-h)] lg:motion-safe:h-[220svh]">
      <section
        aria-labelledby="accueil-titre"
        className="relative h-[calc(100svh-68px)] min-h-[560px] overflow-hidden bg-cream lg:h-svh lg:min-h-[640px] lg:motion-safe:sticky lg:motion-safe:top-0"
      >
        {/* La devise, de part et d'autre de l'arche en fin de séquence */}
        <div aria-hidden="true" className="absolute inset-x-[var(--gutter)] inset-y-0 hidden items-center justify-between lg:flex motion-reduce:hidden">
          <span data-word="left" className="invisible font-script text-[clamp(2.4rem,4.6vw,5.2rem)] leading-none text-blue">
            Le goût
          </span>
          <span data-word="right" className="invisible font-script text-[clamp(2.4rem,4.6vw,5.2rem)] leading-none text-blue">
            du savoir-faire
          </span>
        </div>

        <div data-shrink className="absolute inset-0">
          <div data-frame className="absolute inset-0 overflow-hidden bg-[#060504]">
            {/* Le bord gauche de la photo se fond dans le noir, y compris quand elle se recentre */}
            <div data-recenter className="absolute inset-y-0 right-0 w-full lg:w-[58%] lg:[mask-image:linear-gradient(90deg,transparent,black_18%)]">
              <div data-img className="absolute inset-0">
                <div data-breathe className="absolute inset-0">
                  <Photo name="farineSurPain" sizes="(min-width: 1024px) 60vw, 100vw" preload />
                </div>
              </div>
            </div>
            <div
              data-scrim
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_5_4/0.5)_0%,rgb(6_5_4/0.05)_22%,rgb(6_5_4/0.72)_46%,rgb(6_5_4/0.97)_100%)] lg:bg-[linear-gradient(90deg,rgb(6_5_4/0.55)_30%,rgb(6_5_4/0)_58%)]"
            />
            <FlourDust />
          </div>
        </div>

        <div data-copy className="on-dark absolute inset-0 flex flex-col justify-end px-[var(--gutter)] pb-8 text-ivory sm:pb-12 lg:justify-center lg:pb-0 lg:pl-[max(var(--gutter),calc((100vw-1760px)/2+var(--gutter)))] lg:pt-[var(--header-h)]">
          <p data-fade className="font-script text-[clamp(1.7rem,2.4vw,2.6rem)] leading-none text-champagne">
            Boulangerie et pâtisserie
          </p>
          <SplitReveal as="h1" id="accueil-titre" onStage delay={0.25} className="t-hero mt-5 max-w-[13ch] lg:max-w-[46vw]">
            Chaque création a le goût d’une passion.
          </SplitReveal>
          <p data-fade className="t-lead mt-6 max-w-md text-ivory/85">
            Pains, viennoiseries et pâtisseries imaginés avec gourmandise, au cœur de Rantigny.
          </p>
          <div data-fade className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/nos-creations" variant="light">
              Découvrir nos créations
            </ButtonLink>
            <ButtonLink href="/gateaux-sur-mesure" variant="outline-light">
              Commander un gâteau
            </ButtonLink>
          </div>
        </div>

        <div data-cue aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-ivory/85 lg:block motion-reduce:hidden">
          <span data-fade className="flex flex-col items-center gap-3">
            <span className="t-small">Défiler</span>
            <span className="relative h-12 w-px overflow-hidden bg-ivory/30">
              <span className="absolute inset-x-0 top-0 h-1/3 bg-ivory [animation:scroll-cue_2.2s_var(--ease-luxe)_infinite]" />
            </span>
          </span>
        </div>
      </section>
    </div>
  );
}
