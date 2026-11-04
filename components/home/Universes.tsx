"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const universes: { n: string; title: string; text: string; image: ImageKey; href: string; kind: "up" | "down" | "circle" | "left" }[] = [
  { n: "01", title: "Les pains", text: "Baguettes, pains traditionnels et spécialités boulangères.", image: "baguetteFondNoir", href: "/nos-creations?categorie=pains", kind: "up" },
  { n: "02", title: "Les viennoiseries", text: "Croissants, pains au chocolat et gourmandises du matin.", image: "croissantsFondNoir", href: "/nos-creations?categorie=viennoiseries", kind: "circle" },
  { n: "03", title: "Les pâtisseries", text: "Entremets, tartes, flans, créations fruitées et chocolat.", image: "tarteletteFramboises", href: "/nos-creations?categorie=patisseries", kind: "down" },
  { n: "04", title: "La pause gourmande", text: "Sandwichs, salades et préparations salées.", image: "sandwichBaguette", href: "/nos-creations?categorie=snacking", kind: "left" },
];

/**
 * Nos univers : galerie horizontale pilotée par le défilement sur desktop
 * (section collante, sans épinglage), balayage tactile sur mobile.
 * --track correspond à la largeur totale du rail : la hauteur est connue sans mesure, donc rien ne saute.
 */
export function Universes() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - document.documentElement.clientWidth;
        const trigger = { trigger: root.current, start: "top top", end: "bottom bottom", invalidateOnRefresh: true };
        const move = gsap.to(el, { x: () => -distance(), ease: "none", scrollTrigger: { ...trigger, scrub: 0.8 } });
        gsap.utils.toArray<HTMLElement>("[data-slide-img]", el).forEach((img) => {
          gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: { ...trigger, scrub: true } });
        });

        // Au clavier, un lien hors écran ramène la galerie à lui.
        const onFocus = (e: FocusEvent) => {
          const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-panel]");
          const st = move.scrollTrigger;
          if (!panel || !st) return;
          const progress = Math.min(1, Math.max(0, (panel.offsetLeft - 48) / distance()));
          window.scrollTo(0, st.start + (st.end - st.start) * progress);
        };
        el.addEventListener("focusin", onFocus);
        return () => el.removeEventListener("focusin", onFocus);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="creations-titre"
      style={{ "--track": "250vw" } as CSSProperties}
      className="relative bg-ivory py-20 lg:motion-safe:h-[calc(100svh+var(--track)-100vw)] lg:motion-safe:py-0"
    >
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:items-center lg:motion-safe:overflow-clip">
        <div
          ref={track}
          className="scroll-row flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[var(--gutter)] lg:gap-[3vw] lg:motion-safe:w-[var(--track)] lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:motion-safe:will-change-transform"
        >
          <div className="w-[78vw] max-w-sm shrink-0 snap-start lg:w-[28vw] lg:max-w-none">
            <p className="font-script text-[1.9rem] leading-none text-blue">Nos créations</p>
            <SplitReveal as="h2" id="creations-titre" className="t-h1 mt-5 text-blue-deep">
              De quoi passer nous voir à toute heure.
            </SplitReveal>
            <p className="mt-6 max-w-xs text-ink/75">Du premier croissant au goûter, la vitrine se renouvelle au fil de la journée.</p>
          </div>

          {universes.map((u) => (
            <TransitionLink
              key={u.n}
              href={u.href}
              data-panel
              className="group relative block h-[62svh] w-[78vw] max-w-md shrink-0 snap-center lg:h-[76svh] lg:w-[44vw] lg:max-w-none"
            >
              <RevealImage kind={u.kind} className="absolute inset-0 bg-blue-night">
                <div data-slide-img className="absolute -inset-x-[9%] inset-y-0">
                  <Photo
                    name={u.image}
                    sizes="(min-width: 1024px) 50vw, 84vw"
                    imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                  />
                </div>
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_5_4/0)_45%,rgb(6_5_4/0.82)_100%)]" />
                <div className="on-dark absolute inset-x-0 bottom-0 p-6 text-ivory lg:p-10">
                  <span className="text-xs font-semibold tabular-nums text-champagne">{u.n}</span>
                  <h3 className="t-h1 mt-2 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-2">{u.title}</h3>
                  <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-ivory/85">{u.text}</p>
                </div>
              </RevealImage>
            </TransitionLink>
          ))}

          <div className="w-[62vw] max-w-xs shrink-0 snap-center lg:w-[24vw] lg:max-w-none">
            <TransitionLink href="/nos-creations" className="group inline-flex items-baseline gap-3 text-blue-deep">
              <span className="t-h2 link-draw">Voir tout le catalogue</span>
              <ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </TransitionLink>
            <p className="t-small mt-4 text-mute">Photos d’illustration. Nos créations réelles vous attendent au catalogue et en boutique.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
