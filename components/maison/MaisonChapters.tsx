"use client";

import { useRef } from "react";
import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Le métier, sans récit inventé sur les artisans et sans remontrer les produits du catalogue. */
const chapters: { title: string; text: string; image: ImageKey }[] = [
  {
    title: "Le geste",
    text: "Derrière la vitrine, il y a des gestes : pétrir, façonner, garnir, dresser. Un travail de chaque jour, fait pour que le comptoir soit prêt quand vous poussez la porte.",
    image: "petrissageMains",
  },
  {
    title: "La pâte",
    text: "Des pâtes travaillées avec patience, pour le bon équilibre entre tendreté et tenue. Une croûte qui chante sous les doigts, une mie tendre et parfumée.",
    image: "pateFarineFondNoir",
  },
  {
    title: "La cuisson",
    text: "Le croustillant d’une croûte, le feuilleté d’une viennoiserie, le doré d’un flan : tout se joue au four, chaque jour.",
    image: "painsDeSeigle",
  },
  {
    title: "Le détail",
    text: "Chaque pièce dressée avec soin, parce que la gourmandise commence par les yeux.",
    image: "dressageFraises",
  },
];

/**
 * Desktop : l'image reste collée à gauche et se remplace par un volet pendant
 * que les chapitres défilent à droite. Mobile : image puis texte, chapitre par chapitre.
 */
export function MaisonChapters() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const articles = q("[data-chapter]");
        q("[data-layer]").forEach((layer, i) => {
          if (i === 0) return;
          const scrollTrigger = { trigger: articles[i], start: "top 90%", end: "top 30%", scrub: 0.6 };
          gsap.fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger });
          gsap.fromTo(layer.querySelector("[data-layer-img]"), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="lg:grid lg:grid-cols-2">
      <div className="sticky top-0 hidden h-svh overflow-hidden bg-blue-night lg:motion-safe:block">
        {chapters.map((c, i) => (
          <div key={c.title} data-layer className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
            <div data-layer-img className="absolute inset-0">
              <Photo name={c.image} sizes="50vw" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-20 px-[var(--gutter)] py-20 lg:gap-0 lg:px-[6vw] lg:py-0 lg:motion-reduce:col-span-2">
        {chapters.map((c, i) => (
          <article key={c.title} data-chapter className="lg:flex lg:min-h-svh lg:flex-col lg:justify-center">
            <RevealImage kind={i % 2 ? "right" : "left"} className="moulure mb-10 aspect-[4/3] bg-blue-night lg:motion-safe:hidden">
              <Photo name={c.image} sizes="(min-width: 1024px) 80vw, 100vw" />
            </RevealImage>
            <span className="text-xs font-semibold tabular-nums text-champagne-deep">{String(i + 1).padStart(2, "0")}</span>
            <SplitReveal as="h2" className="t-mega mt-4 text-blue-deep">
              {c.title}
            </SplitReveal>
            <p className="t-lead mt-8 max-w-[32rem] text-ink/80">{c.text}</p>
          </article>
        ))}
        <p className="t-small text-mute lg:pb-16">Photos d’illustration</p>
      </div>
    </div>
  );
}
