"use client";

import { useState } from "react";
import { RevealImage } from "@/components/animations/Reveal";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

type Item = LightboxItem & { caption: string; group: string; aspect: string; kind: "up" | "left" | "right" | "circle" | "down" };

const items: Item[] = [
  { image: "facade", caption: "La façade, rue Anatole France", group: "L’extérieur", aspect: "aspect-[16/10]", kind: "up" },
  { image: "vitrineFlans", caption: "La grande vitrine", group: "Les vitrines", aspect: "aspect-[16/10]", kind: "left" },
  { image: "baguettesAlignees", caption: "Les baguettes", group: "Les pains", aspect: "aspect-square", kind: "circle" },
  { image: "painsChocolat", caption: "Les pains au chocolat", group: "Les viennoiseries", aspect: "aspect-[4/5]", kind: "up" },
  { image: "petrissage", caption: "Le pétrissage", group: "La fabrication", aspect: "aspect-[4/5]", kind: "down" },
  { image: "flansIndividuels", caption: "Les flans individuels", group: "Les pâtisseries", aspect: "aspect-square", kind: "right" },
  { image: "vitrineTartes", caption: "Tartes et meringues", group: "Les vitrines", aspect: "aspect-[16/10]", kind: "up" },
  { image: "macaronsFramboise", caption: "Les grands macarons", group: "Les pâtisseries", aspect: "aspect-[4/5]", kind: "left" },
  { image: "baguettesCroisees", caption: "La baguette de caractère", group: "Les pains", aspect: "aspect-[16/10]", kind: "right" },
];

/** Galerie en colonnes décalées : chaque photo a sa propre révélation. */
export function MaisonGallery() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
        {items.map((it, i) => (
          <li key={it.image} className={cn("mb-10 break-inside-avoid lg:mb-14", i % 3 === 1 && "lg:pt-16")}>
            <button type="button" onClick={() => setIndex(i)} data-cursor="Agrandir" className="group block w-full text-left" aria-label={`Agrandir : ${it.caption}`}>
              <RevealImage kind={it.kind} className={cn("bg-paper", it.aspect)}>
                <Photo
                  name={it.image}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  parallax
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                />
              </RevealImage>
              <span className="mt-4 flex items-baseline justify-between gap-4">
                <span className="t-caption text-blue-deep">{it.caption}</span>
                <span className="t-small text-mute">{it.group}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
