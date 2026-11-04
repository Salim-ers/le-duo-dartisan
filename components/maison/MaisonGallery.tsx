"use client";

import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Item = LightboxItem & { caption: string; group: string; aspect: string };

/** Uniquement des photos fournies par la boulangerie : la légende de la section l'affirme. */
const items: Item[] = [
  { image: "facade", caption: "La façade, rue Anatole France", group: "L’extérieur", aspect: "aspect-[16/10]" },
  { image: "vitrineFlans", caption: "La grande vitrine", group: "Les vitrines", aspect: "aspect-[16/10]" },
  { image: "baguettesAlignees", caption: "Les baguettes", group: "Les pains", aspect: "aspect-square" },
  { image: "painsChocolat", caption: "Les pains au chocolat", group: "Les viennoiseries", aspect: "aspect-[4/5]" },
  { image: "petrissage", caption: "Le pétrissage", group: "La fabrication", aspect: "aspect-[4/5]" },
  { image: "flansIndividuels", caption: "Les flans individuels", group: "Les pâtisseries", aspect: "aspect-square" },
  { image: "vitrineTartes", caption: "Tartes et meringues", group: "Les vitrines", aspect: "aspect-[16/10]" },
  { image: "macaronsFramboise", caption: "Les grands macarons", group: "Les pâtisseries", aspect: "aspect-[4/5]" },
  { image: "baguettesCroisees", caption: "La baguette de caractère", group: "Les pains", aspect: "aspect-[16/10]" },
];

/** Galerie en colonnes ; chaque photo s'ouvre en plein écran. */
export function MaisonGallery() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
        {items.map((it, i) => (
          <li key={it.image} className="mb-10 break-inside-avoid lg:mb-14">
            <button type="button" onClick={() => setIndex(i)} className="group block w-full text-left" aria-label={`Agrandir : ${it.caption}`}>
              <Reveal className={cn("bg-paper", it.aspect)}>
                <Photo
                  name={it.image}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  imgClassName="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                />
              </Reveal>
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
