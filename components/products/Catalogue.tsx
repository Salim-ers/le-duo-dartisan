"use client";

import { LayoutGroup, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { Lightbox } from "@/components/ui/Lightbox";
import { categories, isCategory, products, type CategoryId, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductModal } from "./ProductModal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Rythme éditorial : grand / moyen, puis trois carrés — jamais une grille uniforme. */
const LAYOUT = [
  { span: "md:col-span-7", aspect: "aspect-[4/3]", sizes: "(min-width: 768px) 56vw, 100vw" },
  { span: "md:col-span-5", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 40vw, 100vw" },
  { span: "md:col-span-4", aspect: "aspect-square", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", aspect: "aspect-square", sizes: "(min-width: 768px) 32vw, 100vw" },
];

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
  const [filtered, setFiltered] = useState(false);

  const list = useMemo(
    () => (active === "tout" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  const setCategory = (id: CategoryId | "tout") => {
    setFiltered(true);
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
        <ul
          key={active}
          className={cn("grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-x-8 md:gap-y-20", filtered && "fade-up")}
        >
          {list.map((p, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            const offset = i % 5 === 1 ? "md:mt-24" : i % 5 === 3 ? "md:mt-12" : "";
            return (
              <li key={p.id} className={cn(l.span, offset)}>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="group block w-full text-left"
                  aria-haspopup="dialog"
                >
                  <div className={cn("relative overflow-hidden bg-paper", l.aspect)}>
                    <Photo
                      name={p.image}
                      sizes={l.sizes}
                      imgClassName="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                    />
                    {p.customizable && (
                      <span className="absolute left-4 top-4 rounded-full bg-ivory/92 px-3 py-1 text-xs font-semibold text-blue-deep">
                        Personnalisable
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-6">
                    <h2 className="t-h3 text-blue-deep">{p.name}</h2>
                    <span className="t-caption shrink-0 text-mute">
                      {categories.find((c) => c.id === p.category)?.short}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink/70">{p.description}</p>
                </button>
              </li>
            );
          })}
        </ul>

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
