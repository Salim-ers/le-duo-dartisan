"use client";

import { usePathname } from "next/navigation";
import { CakeSlice, Navigation, Phone } from "lucide-react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { mapsDirectionsUrl, telHref } from "@/lib/site.config";
import { cn } from "@/lib/utils";

const item =
  "flex min-h-[52px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[0.8rem] font-semibold min-[380px]:gap-2 min-[380px]:text-[0.85rem] transition-[background-color,transform] duration-300 active:scale-[0.96]";

/** Accès rapide flottant en bas d'écran, sur mobile et tablette. */
export function MobileActionBar() {
  const pathname = usePathname();
  const onOrderPage = pathname.startsWith("/gateaux-sur-mesure");

  return (
    <nav
      aria-label="Accès rapide"
      className="right-scroll-bar-position on-dark fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[55] lg:hidden"
    >
      <div className="mx-auto flex max-w-md gap-1 rounded-full bg-blue-deep/[0.96] p-1.5 text-ivory shadow-[var(--shadow-float)] ring-1 ring-ivory/10">
        <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={cn(item, "active:bg-ivory/10")}>
          <Navigation className="size-4" aria-hidden="true" />
          Itinéraire
        </a>
        <a href={telHref} className={cn(item, "active:bg-ivory/10")}>
          <Phone className="size-4" aria-hidden="true" />
          Appeler
        </a>
        {!onOrderPage && (
          <TransitionLink href="/gateaux-sur-mesure" aria-label="Commander un gâteau" className={cn(item, "bg-ivory text-blue-deep")}>
            <CakeSlice className="size-4" aria-hidden="true" />
            Commander
          </TransitionLink>
        )}
      </div>
    </nav>
  );
}
