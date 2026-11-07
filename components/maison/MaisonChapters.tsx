"use client";

import { useRef } from "react";
import { FadeIn, RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Le métier, sans récit inventé sur les artisans et sans remontrer les produits du catalogue. */
const chapters: { title: string; text: string; image: ImageKey; tone: string }[] = [
  {
    title: "Le geste",
    text: "Derrière la vitrine, il y a des gestes : pétrir, façonner, garnir, dresser. Un travail de chaque jour, fait pour que le comptoir soit prêt quand vous poussez la porte.",
    image: "petrissageMains",
    tone: "bg-blue text-ivory",
  },
  {
    title: "La pâte",
    text: "Des pâtes travaillées avec patience, pour le bon équilibre entre tendreté et tenue. Une croûte qui chante sous les doigts, une mie tendre et parfumée.",
    image: "pateFarineFondNoir",
    tone: "bg-citron text-cacao",
  },
  {
    title: "La cuisson",
    text: "Le croustillant d’une croûte, le feuilleté d’une viennoiserie, le doré d’un flan : tout se joue au four, chaque jour.",
    image: "painsDeSeigle",
    tone: "bg-caramel text-blue-night",
  },
  {
    title: "Le détail",
    text: "Chaque pièce dressée avec soin, parce que la gourmandise commence par les yeux.",
    image: "dressageFraises",
    tone: "bg-framboise-deep text-ivory",
  },
];

const RADIUS = "2.5rem";

/**
 * Desktop : l'image reste collée à gauche, dans un cadre arrondi, et se remplace
 * par un volet au bord arrondi pendant que les chapitres défilent à droite.
 * Mobile : image puis texte, chapitre par chapitre.
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
          gsap.fromTo(
            layer,
            { clipPath: `inset(100% 0% 0% 0% round ${RADIUS})` },
            { clipPath: `inset(0% 0% 0% 0% round ${RADIUS})`, ease: "none", scrollTrigger },
          );
          gsap.fromTo(layer.querySelector("[data-layer-img]"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger });
        });
        // Le numéro du chapitre en cours s'affiche sur l'image
        articles.forEach((article, i) => {
          gsap.fromTo(
            q("[data-counter]"),
            { yPercent: (-100 / chapters.length) * Math.max(0, i - 1) },
            {
              yPercent: (-100 / chapters.length) * i,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: article, start: "top 70%", end: "top 40%", scrub: 0.4 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="lg:grid lg:grid-cols-2">
      <div className="sticky top-0 hidden h-svh p-4 pt-[calc(var(--header-h)+0.5rem)] lg:motion-safe:block">
        <div className="relative size-full overflow-hidden rounded-[2.5rem] bg-blue-night">
          {chapters.map((c, i) => (
            <div key={c.title} data-layer className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
              <div data-layer-img className="absolute inset-0">
                <Photo name={c.image} sizes="50vw" />
              </div>
            </div>
          ))}
          <div className="absolute bottom-5 left-5 z-10 flex items-center gap-3 rounded-full bg-ivory/90 py-1.5 pl-1.5 pr-4 text-blue-deep backdrop-blur-sm">
            <span className="grid size-9 place-items-center overflow-hidden rounded-full bg-blue-deep font-display text-ivory">
              <span className="relative block h-[1.5em] overflow-hidden leading-[1.5em]">
                <span data-counter className="flex flex-col">
                  {chapters.map((c, i) => (
                    <span key={c.title}>{i + 1}</span>
                  ))}
                </span>
              </span>
            </span>
            <span className="t-small font-semibold">sur {chapters.length} · Photos d’illustration</span>
          </div>
        </div>
      </div>

      <div className="grid gap-20 px-[var(--gutter)] py-16 lg:gap-0 lg:px-[6vw] lg:py-0 lg:motion-reduce:col-span-2">
        {chapters.map((c, i) => (
          <article key={c.title} data-chapter className="lg:flex lg:min-h-svh lg:flex-col lg:justify-center">
            <RevealImage
              kind={i % 2 ? "right" : "left"}
              radius="2rem"
              className="mb-10 aspect-[4/3] rounded-[2rem] bg-blue-night lg:motion-safe:hidden"
            >
              <Photo name={c.image} sizes="(min-width: 1024px) 80vw, 100vw" />
            </RevealImage>
            <span className={cn("grid size-14 place-items-center rounded-full font-display text-xl font-semibold", c.tone)}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <SplitReveal as="h2" className="t-hero mt-6 text-blue-deep">
              {c.title}
            </SplitReveal>
            <FadeIn>
              <p className="t-lead mt-8 max-w-[32rem] text-ink/80">{c.text}</p>
            </FadeIn>
          </article>
        ))}
        <p className="t-small text-mute lg:hidden">Photos d’illustration</p>
      </div>
    </div>
  );
}
