"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Le sur-mesure mis en scène comme un shooting : le fond passe au bleu nuit,
 * la lumière balaie le gâteau, le titre se révèle. Effet 2.5D (perspective +
 * lumière) : la photographie n'est jamais déformée.
 */
export function EventSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const split = SplitText.create(q("[data-name]"), { type: "words,chars", mask: "chars" });
        gsap.set(q("[data-bg]"), { clipPath: "circle(0% at 32% 55%)" });
        gsap.set(q("[data-cake]"), { scale: 0.62, rotationX: 22, rotationZ: -4, yPercent: 12 });
        gsap.set(q("[data-shadow]"), { scale: 0.5, autoAlpha: 0 });
        gsap.set(q("[data-light]"), { xPercent: -120, autoAlpha: 0 });
        gsap.set(split.chars, { yPercent: 110 });
        gsap.set(q("[data-text]"), { opacity: 0, y: 30 });

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } })
          .to(q("[data-bg]"), { clipPath: "circle(150% at 32% 55%)", duration: 1, ease: "power2.inOut" }, 0)
          .to(q("[data-cake]"), { scale: 1, rotationX: 0, rotationZ: 0, yPercent: 0, duration: 1.1, ease: "power2.out" }, 0.1)
          .to(q("[data-shadow]"), { scale: 1, autoAlpha: 1, duration: 1 }, 0.2)
          .to(q("[data-light]"), { autoAlpha: 1, duration: 0.2 }, 0.6)
          .to(q("[data-light]"), { xPercent: 120, duration: 1.1, ease: "sine.inOut" }, 0.6)
          .to(q("[data-light]"), { autoAlpha: 0.35, duration: 0.3 }, 1.4)
          .to(split.chars, { yPercent: 0, stagger: 0.012, duration: 0.5, ease: "power3.out" }, 0.85)
          .to(q("[data-text]"), { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 1.3)
          .to({}, { duration: 0.3 });

        // Inclinaison du cadre au pointeur, une fois la scène installée
        const frame = q("[data-tilt]")[0] as HTMLElement;
        const rx = gsap.quickTo(frame, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(frame, "rotationY", { duration: 1, ease: "power3" });
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
          rotationX: 14,
          autoAlpha: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: q("[data-cake]")[0], start: "top 85%", toggleActions: "play none none none" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="sur-mesure" className="relative bg-blue-deep lg:motion-safe:h-[240svh] lg:motion-safe:bg-ivory">
      <div className="on-dark relative overflow-hidden lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh">
        <div data-bg aria-hidden="true" className="absolute inset-0 bg-blue-deep grain" />

        <div className="container-x relative grid h-full items-center gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-0">
          <figure className="relative [perspective:1400px] lg:col-span-5 lg:col-start-1">
            <div data-cake className="relative mx-auto w-full max-w-[min(100%,74svh)] [transform-style:preserve-3d]">
              <div data-shadow aria-hidden="true" className="absolute -bottom-10 left-[8%] right-[8%] h-16 rounded-[50%] bg-blue-night/80 blur-2xl" />
              <div data-tilt className="moulure relative aspect-square overflow-hidden bg-blue-night shadow-[0_50px_90px_-40px_rgb(0_0_0/0.65)] [transform-style:preserve-3d]">
                <Photo name="fraisier" sizes="(min-width: 1024px) 42vw, 92vw" />
                <div
                  data-light
                  aria-hidden="true"
                  className="absolute -inset-y-10 left-0 w-[70%] bg-[radial-gradient(closest-side,rgb(255_250_240/0.55),rgb(255_250_240/0))] mix-blend-soft-light"
                />
              </div>
            </div>
          </figure>

          <div className="relative text-ivory lg:col-span-6 lg:col-start-7">
            <p data-text className="font-script text-[1.9rem] leading-none text-champagne">
              Sur mesure
            </p>
            <h2 id="sur-mesure" className="mt-5">
              <span data-name className="t-h1 block">
                Vos plus belles occasions méritent une création unique.
              </span>
            </h2>
            <p data-text className="t-lead mt-6 max-w-md text-ivory/80">
              Number cakes, gâteaux aux fruits ou assortiments pour une réception : décrivez votre idée, nous revenons
              vers vous pour la construire ensemble.
            </p>
            <div data-text className="mt-9">
              <ButtonLink href="/gateaux-sur-mesure" variant="light">
                Imaginer mon gâteau
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
