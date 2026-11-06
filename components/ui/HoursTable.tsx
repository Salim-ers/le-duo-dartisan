"use client";

import { useSyncExternalStore } from "react";
import { DAY_LABELS, DAY_ORDER, formatSlots, todayInParis } from "@/lib/hours";
import { siteConfig, type DayKey, type OpeningSlot } from "@/lib/site.config";
import { cn } from "@/lib/utils";

/**
 * Horaires jour par jour, en pastilles. Le jour courant (fuseau Europe/Paris) est repéré,
 * sans afficher d'indicateur « ouvert / fermé » tant que les horaires ne sont pas confirmés.
 */
const noopSubscribe = () => () => {};

export function HoursTable({ className }: { className?: string }) {
  // Jour courant calculé côté navigateur uniquement (la page est générée à l'avance).
  const today = useSyncExternalStore<DayKey | null>(noopSubscribe, todayInParis, () => null);
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;

  return (
    <div className={className}>
      <dl className="grid gap-1.5">
        {DAY_ORDER.map((d) => {
          const closed = week[d].length === 0;
          const isToday = today === d;
          return (
            <div
              key={d}
              className={cn(
                "flex items-center justify-between gap-4 rounded-full px-5 py-3 transition-colors duration-500",
                isToday ? "bg-blue-deep text-ivory shadow-[0_12px_24px_-14px_rgb(18_61_88/0.8)]" : "bg-ivory/75",
              )}
            >
              <dt className={cn("flex items-center gap-3", isToday ? "font-semibold" : "text-ink/80")}>
                {DAY_LABELS[d]}
                {isToday && <span className="rounded-full bg-citron px-2.5 py-0.5 text-xs font-bold text-cacao">Aujourd’hui</span>}
              </dt>
              <dd className={cn("text-right tabular-nums", isToday ? "font-semibold" : closed ? "text-mute" : "font-medium text-blue-deep")}>
                {formatSlots(week[d])}
              </dd>
            </div>
          );
        })}
      </dl>
      {siteConfig.hours.closures.length > 0 && (
        <ul className="mt-4 grid gap-1.5 t-small text-cacao">
          {siteConfig.hours.closures.map((c) => (
            <li key={c.from} className="rounded-2xl bg-citron-soft px-4 py-2.5">
              {c.label}
            </li>
          ))}
        </ul>
      )}
      {!siteConfig.hours.confirmed && (
        <p className="mt-4 px-1 t-small text-mute">Horaires donnés à titre indicatif. En cas de doute, un appel suffit pour les vérifier.</p>
      )}
    </div>
  );
}
