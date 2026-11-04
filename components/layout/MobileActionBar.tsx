"use client";

import { usePathname } from "next/navigation";
import { CakeSlice, Navigation, Phone } from "lucide-react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { mapsDirectionsUrl, telHref } from "@/lib/site.config";

const item =
  "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[0.72rem] font-semibold tracking-[0.01em] transition-colors active:bg-ivory/10";

/** Accès rapide en bas d'écran sur mobile et tablette. */
export function MobileActionBar() {
  const pathname = usePathname();
  const onOrderPage = pathname.startsWith("/gateaux-sur-mesure");

  return (
    <nav
      aria-label="Accès rapide"
      className="on-dark fixed inset-x-0 bottom-0 z-[55] border-t border-ivory/10 bg-blue-deep/96 pb-[env(safe-area-inset-bottom)] text-ivory backdrop-blur-md lg:hidden"
    >
      <div className="flex divide-x divide-ivory/12 px-1.5 py-1.5">
        <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={item}>
          <Navigation className="size-[18px]" aria-hidden="true" />
          Itinéraire
        </a>
        <a href={telHref} className={item}>
          <Phone className="size-[18px]" aria-hidden="true" />
          Appeler
        </a>
        {!onOrderPage && (
          <TransitionLink href="/gateaux-sur-mesure" className={`${item} rounded-[2px] bg-blue text-ivory`}>
            <CakeSlice className="size-[18px]" aria-hidden="true" />
            Commander un gâteau
          </TransitionLink>
        )}
      </div>
    </nav>
  );
}
