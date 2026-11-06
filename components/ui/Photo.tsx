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
  as: Wrapper = "div",
  decorative = false,
}: {
  name: ImageKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** À réserver à l'image principale de la page (LCP). */
  preload?: boolean;
  /** Ajoute data-parallax (utilisé par RevealImage). */
  parallax?: boolean;
  focus?: string;
  contain?: boolean;
  /** "span" quand la photo est sertie dans un texte (titre, paragraphe). */
  as?: "div" | "span";
  /** Image d'ambiance sans information : texte alternatif vide. */
  decorative?: boolean;
}) {
  const img = images[name];
  return (
    <Wrapper className={cn("absolute inset-0", parallax && "-inset-y-[8%]", className)} data-parallax={parallax || undefined}>
      <Image
        src={img.src}
        alt={decorative ? "" : img.alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={75}
        placeholder="blur"
        className={cn(contain ? "object-contain" : "object-cover", imgClassName)}
        style={{ objectPosition: focus ?? img.focus ?? "50% 50%" }}
      />
    </Wrapper>
  );
}
