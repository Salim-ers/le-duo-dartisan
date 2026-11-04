"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Section D — La création à l'honneur, mise en scène comme un shooting :
 * le fond passe au bleu nuit, la lumière balaie le gâteau, son nom se révèle.
 * Effet 2.5D (perspective + lumière) : la photographie n'est jamais déformée.
 */
export function FeaturedCake() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const split = SplitText.create(q("[data-name]"), { type: "words,chars", mask: "chars" });
        gsap.set(q("[data-bg]"), { clipPath: "circle(0% at 50% 55%)" });
        gsap.set(q("[data-cake]"), { scale: 0.62, rotateX: 22, rotateZ: -4, yPercent: 12 });
        gsap.set(q("[data-shadow]"), { scale: 0.5, autoAlpha: 0 });
        gsap.set(q("[data-light]"), { xPercent: -120, autoAlpha: 0 });
        gsap.set(split.chars, { yPercent: 110 });
        gsap.set(q("[data-text]"), { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", scrub: 1, pin: true, anticipatePin: 1 },
        });
        tl.to(q("[data-bg]"), { clipPath: "circle(150% at 50% 55%)", duration: 1, ease: "power2.inOut" }, 0)
          .to(q("[data-cake]"), { scale: 1, rotateX: 0, rotateZ: 0, yPercent: 0, duration: 1.1, ease: "power2.out" }, 0.1)
          .to(q("[data-shadow]"), { scale: 1, autoAlpha: 1, duration: 1 }, 0.2)
          .to(q("[data-light]"), { autoAlpha: 1, duration: 0.2 }, 0.6)
          .to(q("[data-light]"), { xPercent: 120, duration: 1.1, ease: "sine.inOut" }, 0.6)
          .to(q("[data-light]"), { autoAlpha: 0.35, duration: 0.3 }, 1.4)
          .to(split.chars, { yPercent: 0, stagger: 0.025, duration: 0.5, ease: "power3.out" }, 0.95)
          .to(q("[data-text]"), { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 1.3)
          .to({}, { duration: 0.3 });

        // Inclinaison du cadre au pointeur, une fois la scène installée
        const frame = q("[data-tilt]")[0] as HTMLElement;
        const rx = gsap.quickTo(frame, "rotateX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(frame, "rotateY", { duration: 1, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = frame.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 9);
          rx(((e.clientY - r.top) / r.height - 0.5) * -7);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        frame.addEventListener("pointermove", onMove);
        frame.addEventListener("pointerleave", onLeave);
        return () => {
          frame.removeEventListener("pointermove", onMove);
          frame.removeEventListener("pointerleave", onLeave);
          split.revert();
        };
      });

      mm.add(MQ.mobile, () => {
        gsap.from(q("[data-cake]"), {
          scale: 0.86,
          rotateX: 14,
          autoAlpha: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: q("[data-cake]")[0], start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="creation-honneur" className="on-dark relative overflow-hidden bg-cream lg:h-svh">
      <div data-bg aria-hidden="true" className="absolute inset-0 bg-blue-deep grain" />

      <div className="container-x relative grid h-full items-center gap-12 py-24 lg:grid-cols-12 lg:gap-8 lg:py-0">
        <div className="relative [perspective:1400px] lg:col-span-6 lg:col-start-2">
          <div data-cake className="relative mx-auto w-full max-w-[640px] [transform-style:preserve-3d]">
            <div data-shadow aria-hidden="true" className="absolute -bottom-10 left-[8%] right-[8%] h-16 rounded-[50%] bg-blue-night/80 blur-2xl" />
            <div data-tilt className="moulure relative aspect-square overflow-hidden bg-blue-night shadow-[0_50px_90px_-40px_rgb(0_0_0/0.65)] [transform-style:preserve-3d]">
              <Photo name="fraisier" sizes="(min-width: 1024px) 45vw, 92vw" />
              <div
                data-light
                aria-hidden="true"
                className="absolute -inset-y-10 left-0 w-[70%] bg-[radial-gradient(closest-side,rgb(255_250_240/0.55),rgb(255_250_240/0))] mix-blend-soft-light"
              />
            </div>
          </div>
        </div>

        <div className="relative text-ivory lg:col-span-4 lg:col-start-8">
          <p data-text className="t-caption text-champagne">La création à l’honneur</p>
          <h2 id="creation-honneur" className="mt-4">
            <span data-name className="t-h1 block">
              Le grand fraisier aux fruits
            </span>
          </h2>
          <p data-text className="t-h3 mt-8 font-[380] italic text-ivory/90">
            Pour les moments qui comptent.
          </p>
          <p data-text className="mt-5 max-w-sm text-ivory/75">
            Une bordure de fraises, une couronne de fruits frais et quelques feuilles de chocolat : le
            gâteau qui fait lever les tables.
          </p>
          <div data-text className="mt-10">
            <ButtonLink href="/gateaux-sur-mesure?inspiration=grand-fraisier" variant="light">
              Imaginer mon gâteau
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
