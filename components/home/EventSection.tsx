"use client";

import { Phone } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { FadeIn, SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Glow, Macaron, RotatingBadge } from "@/components/ui/Decor";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { siteConfig, telHref } from "@/lib/site.config";

/**
 * Le sur-mesure : un panneau bleu nuit arrondi, le number cake dans un grand
 * cercle entouré d'un anneau de texte qui tourne. Au défilement, le gâteau
 * se redresse et grandit ; au pointeur, la scène s'incline en 3D.
 */
export function EventSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: q("[data-scene]")[0], start: "top bottom", end: "center 55%", scrub: 0.8 },
          })
          .fromTo(q("[data-cake]"), { scale: 0.72, rotate: -14 }, { scale: 1, rotate: 0 }, 0)
          .fromTo(q("[data-ring]"), { rotate: -90, scale: 0.85 }, { rotate: 0, scale: 1 }, 0)
          .fromTo(q("[data-float]"), { y: (i) => 120 + i * 60 }, { y: 0 }, 0);
      });

      mm.add(MQ.desktop, () => {
        const scene = q<HTMLElement>("[data-scene]")[0];
        const tilt = q<HTMLElement>("[data-tilt]")[0];
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = scene.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(((e.clientY - r.top) / r.height - 0.5) * -12);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        scene.addEventListener("pointermove", onMove);
        scene.addEventListener("pointerleave", onLeave);
        return () => {
          scene.removeEventListener("pointermove", onMove);
          scene.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className="bg-cream px-2 sm:px-3 lg:px-4">
      <section
        ref={root}
        aria-labelledby="sur-mesure"
        className="on-dark relative isolate overflow-hidden rounded-[2.5rem] bg-blue-deep text-ivory grain lg:rounded-[4rem]"
      >
        <Glow variant="blue" className="-z-10 opacity-50" />
        <div className="container-x grid items-center gap-14 py-20 lg:grid-cols-12 lg:gap-8 lg:py-32">
          <div className="lg:col-span-6">
            <SplitReveal as="h2" id="sur-mesure" className="t-h1 max-w-[15ch]">
              Vos plus belles occasions méritent une création unique.
            </SplitReveal>
            <FadeIn>
              <p className="t-lead mt-6 max-w-lg text-ivory/80">
                Number cakes, gâteaux aux fruits ou assortiments pour une réception : décrivez votre idée, nous revenons
                vers vous pour la construire ensemble.
              </p>
            </FadeIn>
            <FadeIn className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/gateaux-sur-mesure" variant="light" arrow>
                Imaginer mon gâteau
              </ButtonLink>
              <ButtonLink href={telHref} external variant="outline-light">
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.phone.display}
              </ButtonLink>
            </FadeIn>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div data-scene className="relative mx-auto aspect-square w-full max-w-[min(100%,600px)] [perspective:1200px]">
              <div data-tilt className="absolute inset-0 [transform-style:preserve-3d]">
                <div data-ring className="absolute inset-0 text-ivory/70">
                  <RotatingBadge
                    text="Anniversaires · Mariages · Baptêmes · Fêtes de famille · Réceptions · "
                    className="size-full [--spin-d:40s]"
                    textClassName="text-[9.5px] tracking-[0.3em]"
                  />
                </div>
                <div
                  data-cake
                  className="absolute inset-[15%] overflow-hidden rounded-full bg-blue-night shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-[6px] ring-ivory/10"
                >
                  <Photo name="numberCake" sizes="(min-width: 1024px) 34vw, 70vw" />
                </div>
                <div data-float className="absolute right-[4%] top-[10%] w-[18%] [transform:translateZ(60px)]">
                  <Macaron flavour="framboise" className="w-full animate-bob drop-shadow-[0_16px_20px_rgb(0_0_0/0.35)]" style={{ "--rot": "14deg" } as CSSProperties} />
                </div>
                <div data-float className="absolute bottom-[8%] left-[2%] grid size-[24%] place-items-center [transform:translateZ(90px)]">
                  <span className="grid size-full -rotate-12 place-items-center rounded-full bg-citron p-3 text-center font-display text-[clamp(0.9rem,1.5vw,1.2rem)] font-semibold leading-tight text-cacao shadow-[0_18px_30px_-12px_rgb(0_0_0/0.5)] [font-variation-settings:'SOFT'_100]">
                    Sur
                    <br />
                    commande
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
