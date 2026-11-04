"use client";

import { Expand } from "lucide-react";
import { useRef, useState } from "react";
import { SplitReveal } from "@/components/animations/Reveal";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const items: (LightboxItem & { caption: string })[] = [
  { image: "vitrinePatisseries", caption: "Macarons, tartelettes et éclairs" },
  { image: "vitrineFlans", caption: "Flans, coffrets de macarons et religieuses" },
  { image: "vitrineEclairs", caption: "Éclairs, tartelettes aux fraises et choux" },
  { image: "vitrineTartes", caption: "Tartes aux fruits et meringues" },
];

/** Section F — Notre vitrine gourmande : galerie horizontale pilotée par le défilement. */
export function ShowcaseGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-slide-img]", el).forEach((img) => {
          gsap.fromTo(img, { xPercent: -6 }, {
            xPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="vitrine-titre" className="relative overflow-hidden bg-ivory py-20 lg:flex lg:h-svh lg:items-center lg:py-0">
      <div
        ref={track}
        className="scroll-row flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[var(--gutter)] lg:snap-none lg:gap-10 lg:overflow-visible lg:will-change-transform"
      >
        <div className="w-[82vw] max-w-sm shrink-0 snap-start lg:w-[28vw] lg:max-w-none lg:pr-6">
          <p className="font-script text-[1.9rem] leading-none text-blue">En boutique</p>
          <SplitReveal as="h2" className="t-h1 mt-5 text-blue-deep">
            <span id="vitrine-titre">Notre vitrine gourmande.</span>
          </SplitReveal>
          <p className="mt-6 max-w-xs text-ink/75">
            Les photos de la boutique, telles que vous la découvrez en poussant la porte. Touchez une image pour
            l’afficher en entier.
          </p>
        </div>

        {items.map((it, i) => (
          <figure key={it.image} className="w-[86vw] shrink-0 snap-center lg:w-[min(62vw,1100px)]">
            <button
              type="button"
              onClick={() => setIndex(i)}
              data-cursor="Agrandir"
              className="group relative block aspect-[16/9] w-full overflow-hidden bg-paper"
              aria-label={`Agrandir : ${it.caption}`}
            >
              <div data-slide-img className="absolute -inset-x-[8%] inset-y-0">
                <Photo name={it.image} sizes="(min-width: 1024px) 66vw, 90vw" imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.03]" />
              </div>
              <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-ivory/90 text-blue-deep opacity-90 transition group-hover:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            </button>
            <figcaption className="mt-4 flex items-baseline gap-4">
              <span className="text-xs font-semibold tabular-nums text-champagne-deep">
                {i + 1}/{items.length}
              </span>
              <span className="t-caption text-mute">{it.caption}</span>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden="true" className="w-px shrink-0 lg:w-[4vw]" />
      </div>

      <Lightbox items={items} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
