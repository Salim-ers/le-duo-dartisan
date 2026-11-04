import Image from "next/image";
import { images, type ImageKey } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * Photographie en mode « fill » : remplit son conteneur sans jamais
 * être étirée (object-cover + point focal), avec flou de chargement.
 */
export function Photo({
  name,
  sizes,
  className,
  imgClassName,
  preload = false,
  parallax = false,
  focus,
  contain = false,
}: {
  name: ImageKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  /** Ajoute data-parallax (utilisé par RevealImage). */
  parallax?: boolean;
  focus?: string;
  contain?: boolean;
}) {
  const img = images[name];
  return (
    <div className={cn("absolute inset-0", parallax && "-inset-y-[8%]", className)} data-parallax={parallax || undefined}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        quality={75}
        placeholder="blur"
        className={cn(contain ? "object-contain" : "object-cover", imgClassName)}
        style={{ objectPosition: focus ?? img.focus ?? "50% 50%" }}
      />
    </div>
  );
}
