"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { RevealImage } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import { Lightbox } from "@/components/ui/Lightbox";
import { categories, isCategory, products, type CategoryId, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductModal } from "./ProductModal";

const ease = [0.22, 1, 0.36, 1] as const;

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

  const list = useMemo(
    () => (active === "tout" ? products : products.filter((p) => p.category === active)),
    [active],
  );

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
      <div className="sticky top-[var(--sticky-top)] z-30 border-y border-line bg-cream/92 backdrop-blur-md transition-[top] duration-500 ease-[var(--ease-luxe)]">
        <LayoutGroup id="filters">
          <div role="tablist" aria-label="Catégories" className="scroll-row container-x flex gap-1 overflow-x-auto py-2 sm:gap-2">
            {[{ id: "tout" as const, short: "Toutes nos créations" }, ...categories].map((c) => {
              const on = active === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[0.92rem] font-medium transition-colors duration-300",
                    on ? "text-ivory" : "text-ink/70 hover:text-blue-deep",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-blue-deep"
                      transition={{ duration: 0.5, ease }}
                    />
                  )}
                  <span className="relative">{c.short}</span>
                  <span className={cn("relative text-xs tabular-nums", on ? "text-champagne" : "text-mute")}>
                    {counts[c.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <section aria-live="polite" className="container-x py-14 lg:py-20">
        <p className="sr-only">
          {list.length} création{list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}
        </p>
        <motion.ul layout="position" className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.id}
                layout="position"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: Math.min(i, 6) * 0.07 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="group block w-full text-left"
                  aria-haspopup="dialog"
                >
                  {/* Même format partout ; l'apparition part en vague, colonne après colonne. */}
                  <RevealImage delay={(i % 3) * 0.12} className="aspect-square bg-paper">
                    <Photo
                      name={p.image}
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                      imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/70"
                    />
                    {p.customizable && (
                      <span className="absolute left-4 top-4 rounded-full bg-ivory/92 px-3 py-1 text-xs font-semibold text-blue-deep">
                        Personnalisable
                      </span>
                    )}
                  </RevealImage>
                  <span className="t-caption mt-5 block text-mute">
                    {categories.find((c) => c.id === p.category)?.short}
                  </span>
                  <h2 className="t-h3 mt-1 text-blue-deep transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-1">
                    {p.name}
                  </h2>
                  <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink/70">{p.description}</p>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="t-h3 text-blue-deep">Aucune création dans cette catégorie pour le moment.</p>
            <button type="button" onClick={() => setCategory("tout")} className="mt-4 text-blue link-draw">
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
