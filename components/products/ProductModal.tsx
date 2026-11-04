"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { categories, productImage, type Product } from "@/data/products";
import { siteConfig } from "@/lib/site.config";

const ease = [0.22, 1, 0.36, 1] as const;

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

  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {product && img && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-blue-night/70 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-0 bottom-0 z-[91] max-h-[92svh] overflow-y-auto bg-ivory outline-none md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:w-[min(1100px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.55, ease }}
              >
                <div className="grid md:grid-cols-[1.1fr_1fr]">
                  <div className="relative aspect-square bg-paper md:aspect-auto md:min-h-[560px]">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                      transition={{ duration: 0.9, ease, delay: 0.1 }}
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
                      className="absolute bottom-4 left-4 flex min-h-11 items-center gap-2 rounded-full bg-ivory/92 px-4 text-sm font-semibold text-blue-deep transition hover:bg-ivory"
                    >
                      <Expand className="size-4" aria-hidden="true" />
                      Plein écran
                    </button>
                  </div>

                  <div className="flex flex-col p-7 sm:p-10 lg:p-12">
                    <div className="flex items-start justify-between gap-4">
                      <p className="t-caption text-champagne-deep">{category?.label}</p>
                      <Dialog.Close
                        className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-blue-deep transition hover:bg-paper"
                        aria-label="Fermer la fiche"
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Title className="t-h2 mt-3 text-blue-deep">{product.name}</Dialog.Title>
                    <Dialog.Description className="t-lead mt-6 text-ink/80">{product.description}</Dialog.Description>

                    <dl className="mt-8 grid gap-3 border-t border-line pt-6 text-[0.95rem]">
                      {siteConfig.catalogue.showPrices && product.price && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-mute">Prix</dt>
                          <dd className="font-semibold text-blue-deep">{product.price}</dd>
                        </div>
                      )}
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">Disponibilité</dt>
                        <dd className="text-right text-blue-deep">{product.availability ?? "Selon la vitrine du jour"}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-mute">Allergènes</dt>
                        <dd className="max-w-[60%] text-right text-blue-deep">
                          {product.allergens.length > 0
                            ? product.allergens.join(", ")
                            : "Liste disponible en boutique, sur simple demande"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-auto flex flex-wrap gap-3 pt-10">
                      {product.customizable ? (
                        <ButtonLink href={`/gateaux-sur-mesure?inspiration=${product.id}`}>
                          Demander cette création
                        </ButtonLink>
                      ) : (
                        <ButtonLink href="/nous-trouver" variant="outline">
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
