"use client";

import { useSyncExternalStore } from "react";
import { DAY_LABELS, DAY_ORDER, formatSlots, todayInParis } from "@/lib/hours";
import { siteConfig, type DayKey, type OpeningSlot } from "@/lib/site.config";
import { cn } from "@/lib/utils";

/**
 * Horaires jour par jour. Le jour courant (fuseau Europe/Paris) est repéré,
 * sans afficher d'indicateur « ouvert / fermé » tant que les horaires ne sont pas confirmés.
 */
const noopSubscribe = () => () => {};

export function HoursTable({ className }: { className?: string }) {
  // Jour courant calculé côté navigateur uniquement (la page est générée à l'avance).
  const today = useSyncExternalStore<DayKey | null>(noopSubscribe, todayInParis, () => null);
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;

  return (
    <div className={className}>
      <dl className="grid">
        {DAY_ORDER.map((d) => {
          const closed = week[d].length === 0;
          const isToday = today === d;
          return (
            <div
              key={d}
              className={cn(
                "relative flex items-baseline justify-between gap-6 border-b border-line py-3.5 transition-colors",
                isToday && "text-blue-deep",
              )}
            >
              <dt className={cn("flex items-center gap-3", isToday ? "font-semibold" : "text-ink/75")}>
                {DAY_LABELS[d]}
                {isToday && <span className="rounded-full bg-blue-soft px-2.5 py-0.5 text-xs font-semibold text-blue-deep">Aujourd’hui</span>}
              </dt>
              <dd className={cn("tabular-nums", closed ? "text-mute" : "text-blue-deep", isToday && "font-semibold")}>
                {formatSlots(week[d])}
              </dd>
            </div>
          );
        })}
      </dl>
      {siteConfig.hours.closures.length > 0 && (
        <ul className="mt-4 t-small text-cacao">
          {siteConfig.hours.closures.map((c) => (
            <li key={c.from}>{c.label}</li>
          ))}
        </ul>
      )}
      {!siteConfig.hours.confirmed && (
        <p className="mt-4 t-small text-mute">
          Horaires donnés à titre indicatif. En cas de doute, un appel suffit pour les vérifier.
        </p>
      )}
    </div>
  );
}
