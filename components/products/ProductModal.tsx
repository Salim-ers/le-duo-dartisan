"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { categories, productImage, type Product } from "@/data/products";
import { siteConfig } from "@/lib/site.config";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fiche produit : carte arrondie centrée (desktop), feuille flottante qui monte du bas (mobile). */
export function ProductModal({
  product,
  onClose,
  onFullscreen,
}: {
  product: Product | null;
  onClose: () => void;
  onFullscreen: () => void;
}) {
  const img = product ? productImage(product) : null;
  const category = product ? categories.find((c) => c.id === product.category) : null;

  const rows: [string, string][] = product
    ? [
        ...(siteConfig.catalogue.showPrices && product.price ? ([["Prix", product.price]] as [string, string][]) : []),
        ["Disponibilité", product.availability ?? "Selon la vitrine du jour"],
        [
          "Allergènes",
          product.allergens.length > 0 ? product.allergens.join(", ") : "Liste disponible en boutique, sur simple demande",
        ],
      ]
    : [];

  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {product && img && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-blue-night/60 backdrop-blur-[6px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-2 bottom-2 z-[91] max-h-[calc(100svh-1rem)] overflow-y-auto rounded-[2rem] bg-ivory p-2 shadow-[var(--shadow-float)] outline-none md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[min(1080px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2.5rem] md:p-3"
                initial={{ opacity: 0, y: 90, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.97 }}
                transition={{ duration: 0.6, ease }}
              >
                <div className="grid md:grid-cols-[1.1fr_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-paper md:aspect-auto md:min-h-[560px] md:rounded-[2rem]">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ clipPath: "inset(18% 18% 18% 18% round 999px)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
                      transition={{ duration: 1, ease, delay: 0.08 }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 768px) 560px, 100vw"
                        quality={90}
                        placeholder="blur"
                        className="object-cover"
                        style={{ objectPosition: img.focus ?? "50% 50%" }}
                      />
                    </motion.div>
                    <button
                      type="button"
                      onClick={onFullscreen}
                      className="absolute bottom-3 left-3 flex min-h-11 items-center gap-2 rounded-full bg-ivory/92 px-4 text-sm font-semibold text-blue-deep backdrop-blur-sm transition hover:bg-ivory"
                    >
                      <Expand className="size-4" aria-hidden="true" />
                      Plein écran
                    </button>
                  </div>

                  <div className="flex flex-col p-5 pt-6 sm:p-8 lg:p-10">
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full bg-blue-soft px-3.5 py-1.5 text-[0.8rem] font-semibold text-blue-deep">{category?.label}</span>
                      <Dialog.Close
                        className="-mr-1 -mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-paper text-blue-deep transition-[background-color,color,rotate] duration-500 ease-[var(--ease-spring)] hover:rotate-90 hover:bg-blue-deep hover:text-ivory"
                        aria-label="Fermer la fiche"
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Title className="t-h2 mt-4 text-blue-deep">{product.name}</Dialog.Title>
                    <Dialog.Description className="t-lead mt-4 text-ink/80">{product.description}</Dialog.Description>

                    <dl className="mt-7 grid gap-2 text-[0.95rem]">
                      {rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
                          <dt className="text-mute">{k}</dt>
                          <dd className="max-w-[62%] text-right font-medium text-blue-deep">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-auto flex flex-wrap gap-3 pt-8">
                      {product.customizable ? (
                        <ButtonLink href={`/gateaux-sur-mesure?inspiration=${product.id}`} arrow>
                          Demander cette création
                        </ButtonLink>
                      ) : (
                        <ButtonLink href="/nous-trouver" variant="outline" arrow>
                          Venir en boutique
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
