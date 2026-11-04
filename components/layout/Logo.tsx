import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";

/** Lettrage de l'enseigne, vectorisé depuis le fichier fourni. Couleur = currentColor. */
export function Logo({ className, title = siteConfig.name }: { className?: string; title?: string }) {
  return <span role="img" aria-label={title} className={cn("logo-mask", className)} />;
}
