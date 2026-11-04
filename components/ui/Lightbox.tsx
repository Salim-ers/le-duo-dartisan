"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { images, type ImageKey } from "@/data/images";

export type LightboxItem = { image: ImageKey; caption?: string };

/** Visionneuse plein écran : image entière (jamais recadrée), clavier et balayage. */
export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const current = open ? items[index] : null;
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndexChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[95] bg-blue-night/95 backdrop-blur-sm data-[state=open]:animate-in" />
        <Dialog.Content
          className="on-dark fixed inset-0 z-[96] flex flex-col text-ivory outline-none"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-[var(--gutter)] py-4">
            <Dialog.Title className="t-caption text-ivory/80">
              {current?.caption ?? "Photographie"}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Image {index !== null ? index + 1 : 0} sur {items.length}. Flèches gauche et droite pour naviguer.
            </Dialog.Description>
            <Dialog.Close className="grid size-12 place-items-center rounded-full border border-ivory/30 transition hover:bg-ivory hover:text-blue-deep" aria-label="Fermer la visionneuse">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {current && (
                <motion.div
                  key={current.image}
                  className="absolute inset-x-[var(--gutter)] inset-y-2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={images[current.image].src}
                    alt={images[current.image].alt}
                    fill
                    sizes="100vw"
                    quality={90}
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {items.length > 1 && (
            <div className="flex items-center justify-center gap-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-12 place-items-center rounded-full border border-ivory/30 transition hover:bg-ivory hover:text-blue-deep"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="t-small tabular-nums text-ivory/70" aria-hidden="true">
                {(index ?? 0) + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-12 place-items-center rounded-full border border-ivory/30 transition hover:bg-ivory hover:text-blue-deep"
                aria-label="Photo suivante"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
