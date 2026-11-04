import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cadre de photographie avec apparition douce au défilement.
 * L'effet est entièrement en CSS (classe .reveal) : sans JavaScript ou sur un
 * navigateur qui ne le gère pas, l'image est simplement affichée.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("reveal relative overflow-hidden", className)}>{children}</div>;
}
