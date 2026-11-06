"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Decor";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Photo ronde sertie dans la phrase, comme un gâteau posé en vitrine. */
function Inline({ name, shape = "pill", tilt = 0 }: { name: ImageKey; shape?: "pill" | "round"; tilt?: number }) {
  return (
    <span
      data-inline
      style={{ rotate: `${tilt}deg` }}
      className={cn(
        "relative mx-[0.06em] inline-block h-[0.84em] -translate-y-[0.06em] overflow-hidden rounded-full bg-paper align-middle shadow-[0_14px_30px_-14px_rgb(18_61_88/0.55)] ring-[0.05em] ring-ivory",
        shape === "pill" ? "w-[1.7em]" : "w-[0.84em]",
      )}
    >
      <Photo as="span" name={name} sizes="(min-width: 1024px) 220px, 120px" decorative />
    </span>
  );
}

/**
 * Le savoir-faire : la phrase s'allume mot à mot au défilement et les photos
 * serties s'ouvrent au moment où on les atteint.
 */
export function CraftSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const title = root.current!.querySelector<HTMLElement>("[data-words]")!;
        const split = SplitText.create(title, { type: "words", tag: "span", wordsClass: "craft-word", ignore: "[data-inline]" });
        const parts = Array.from(title.querySelectorAll<HTMLElement>(".craft-word, [data-inline]"));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: title, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        });
        parts.forEach((el, i) => {
          if (el.hasAttribute("data-inline")) {
            tl.fromTo(el, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)" }, i * 0.12);
          } else {
            tl.fromTo(el, { opacity: 0.14 }, { opacity: 1, duration: 0.3 }, i * 0.12);
          }
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="savoir-faire" className="relative overflow-hidden bg-cream py-24 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(220_235_245/0.9),rgb(220_235_245/0))]" />
      <div className="container-x relative flex flex-col items-center text-center">
        <Chip dot="pistache">Le savoir-faire</Chip>
        <h2 id="savoir-faire" data-words className="t-hero mt-8 max-w-[19ch] text-balance text-blue-deep">
          Du pétrin <Inline name="petrissage" /> à la vitrine, chaque création est façonnée{" "}
          <Inline name="farineSurPain" shape="round" tilt={-6} /> avec soin, pour le plaisir{" "}
          <Inline name="champDeBleCouchant" tilt={4} /> des gourmands.
        </h2>
        <div className="mt-12">
          <ButtonLink href="/notre-maison" variant="outline" arrow>
            Découvrir notre maison
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
