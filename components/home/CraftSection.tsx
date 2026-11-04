"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

/** Le savoir-faire : champ de blé plein écran, la phrase s'allume mot à mot au défilement. */
export function CraftSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(q("[data-words]"), { type: "words" });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 } })
          .fromTo(q("[data-img]"), { scale: 1.2 }, { scale: 1, duration: 1, ease: "none" }, 0)
          .fromTo(split.words, { opacity: 0.16 }, { opacity: 1, duration: 0.12, stagger: 0.07, ease: "none" }, 0.04)
          .fromTo(q("[data-cta]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "none" }, 0.74);
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="savoir-faire" className="relative h-[200svh] motion-reduce:h-auto">
      <div className="on-dark sticky top-0 flex h-svh min-h-[520px] items-center overflow-hidden bg-blue-night text-ivory motion-reduce:static">
        <div data-img className="absolute inset-0">
          <Photo name="champDeBleCouchant" sizes="100vw" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgb(20_10_4/0.58),rgb(20_10_4/0.12))]" />
        <div className="container-x relative text-center">
          <p className="font-script text-[clamp(1.9rem,2.6vw,2.8rem)] leading-none text-champagne">Le savoir-faire</p>
          <h2 id="savoir-faire" data-words className="t-hero mx-auto mt-6 max-w-[17ch] text-balance">
            Du pétrin à la vitrine, le soin du détail.
          </h2>
          <div data-cta className="mt-10">
            <ButtonLink href="/notre-maison" variant="light">
              Découvrir notre maison
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
