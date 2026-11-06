"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { RevealImage } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Lightbox } from "@/components/ui/Lightbox";
import { categories, isCategory, products, type CategoryId, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductModal } from "./ProductModal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Une couleur de vitrine par catégorie. */
const TONE: Record<CategoryId, string> = {
  pains: "bg-blue",
  viennoiseries: "bg-citron",
  patisseries: "bg-framboise",
  gourmandises: "bg-pistache",
  snacking: "bg-caramel",
};

function CatalogueFromUrl() {
  const raw = useSearchParams().get("categorie");
  return <CatalogueView active={isCategory(raw) ? raw : "tout"} />;
}

/**
 * La liste complète reste dans le HTML généré (référencement, pas de saut à
 * l'affichage) ; le filtre de l'URL s'applique dès que la page est chargée.
 */
export function Catalogue() {
  return (
    <Suspense fallback={<CatalogueView active="tout" />}>
      <CatalogueFromUrl />
    </Suspense>
  );
}

function CatalogueView({ active }: { active: CategoryId | "tout" }) {
  const router = useRouter();
  const pathname = usePathname();
  const top = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<Product | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const list = useMemo(() => (active === "tout" ? products : products.filter((p) => p.category === active)), [active]);

  const setCategory = (id: CategoryId | "tout") => {
    router.replace(id === "tout" ? pathname : `${pathname}?categorie=${id}`, { scroll: false });
    // Si l'on a défilé dans la liste, on revient à son début : la nouvelle liste peut être bien plus courte.
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { tout: products.length };
    for (const p of products) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);

  return (
    <>
      {/* --header-h et non --sticky-top : en remontant, l'en-tête masqué réapparaît. */}
      <div ref={top} className="scroll-mt-[var(--header-h)]" />
      <div className="sticky top-[calc(var(--sticky-top)+0.25rem)] z-30 px-3 transition-[top] duration-700 ease-[var(--ease-luxe)]">
        <LayoutGroup id="filters">
          <div
            role="group"
            aria-label="Filtrer par catégorie"
            className="scroll-row mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-ivory/85 p-1.5 shadow-[var(--shadow-soft)] ring-1 ring-line backdrop-blur-xl"
          >
            {[{ id: "tout" as const, short: "Tout" }, ...categories].map((c) => {
              const on = active === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[0.92rem] font-semibold transition-colors duration-300 sm:px-5",
                    on ? "text-ivory" : "text-ink/70 hover:bg-blue-soft hover:text-blue-deep",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-blue-deep"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {c.id !== "tout" && <span aria-hidden="true" className={cn("relative size-2 rounded-full", TONE[c.id])} />}
                  <span className="relative">{c.short}</span>
                  <span
                    className={cn(
                      "relative grid min-w-6 place-items-center rounded-full px-1.5 text-[0.72rem] tabular-nums",
                      on ? "bg-ivory/15 text-ivory" : "bg-paper text-mute",
                    )}
                  >
                    {counts[c.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <section aria-label="Liste des créations" aria-live="polite" className="container-x pb-24 pt-10 lg:pb-32 lg:pt-14">
        <p className="sr-only">
          {list.length} création{list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}
        </p>
        <motion.ul layout="position" className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.id}
                layout="position"
                initial={{ opacity: 0, y: 60, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease, delay: Math.min(i, 6) * 0.06 } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="group block w-full rounded-[1.75rem] text-left"
                  aria-haspopup="dialog"
                >
                  {/* Même format partout ; l'apparition part en vague, colonne après colonne.
                      L'ombre est sur l'enveloppe : le masque de révélation la couperait. */}
                  <span className="block rounded-[1.75rem] transition-[translate,box-shadow] duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-1.5 group-hover:shadow-[0_34px_60px_-30px_rgb(18_61_88/0.6)]">
                  <RevealImage delay={(i % 3) * 0.12} radius="1.75rem" className="aspect-square rounded-[1.75rem] bg-paper">
                    <Photo
                      name={p.image}
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                      imgClassName="transition-[scale] duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.07]"
                    />
                    <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ivory/90 py-1.5 pl-2.5 pr-3.5 text-[0.78rem] font-semibold text-blue-deep backdrop-blur-sm">
                      <span aria-hidden="true" className={cn("size-2 rounded-full", TONE[p.category])} />
                      {categories.find((c) => c.id === p.category)?.short}
                    </span>
                    {p.customizable && (
                      <span className="absolute right-3 top-3 rounded-full bg-framboise px-3 py-1.5 text-[0.78rem] font-semibold text-ivory">
                        Personnalisable
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 right-3 grid size-12 place-items-center rounded-full bg-ivory text-blue-deep shadow-[0_10px_20px_-8px_rgb(0_0_0/0.35)] transition-[background-color,color,rotate,scale] duration-500 ease-[var(--ease-spring)] group-hover:rotate-90 group-hover:scale-110 group-hover:bg-blue-deep group-hover:text-ivory"
                    >
                      <Plus className="size-5" />
                    </span>
                  </RevealImage>
                  </span>
                  <h2 className="t-h3 mt-5 px-1 text-blue-deep">{p.name}</h2>
                  <p className="mt-2 max-w-[46ch] px-1 text-[0.95rem] leading-relaxed text-ink/70">{p.description}</p>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {list.length === 0 && (
          <div className="mx-auto max-w-md rounded-[2rem] bg-ivory py-16 text-center ring-1 ring-line">
            <p className="t-h3 text-blue-deep">Aucune création dans cette catégorie pour le moment.</p>
            <button type="button" onClick={() => setCategory("tout")} className="mt-4 font-semibold text-blue link-draw">
              Voir toutes nos créations
            </button>
          </div>
        )}
      </section>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onFullscreen={() => {
          const i = list.findIndex((p) => p.id === selected?.id);
          setSelected(null);
          setLightbox(Math.max(0, i));
        }}
      />
      <Lightbox
        items={list.map((p) => ({ image: p.image, caption: p.name }))}
        index={lightbox}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
