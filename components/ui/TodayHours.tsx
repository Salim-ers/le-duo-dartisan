"use client";

import { Clock } from "lucide-react";
import { useSyncExternalStore } from "react";
import { DAY_LABELS, formatSlots, todayInParis } from "@/lib/hours";
import { siteConfig, type DayKey, type OpeningSlot } from "@/lib/site.config";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/**
 * Horaires du jour (fuseau Europe/Paris), calculés dans le navigateur :
 * la page est générée à l'avance. Pas d'indicateur « ouvert / fermé » tant que
 * les horaires ne sont pas confirmés.
 */
export function TodayHours({ className }: { className?: string }) {
  const today = useSyncExternalStore<DayKey | null>(noopSubscribe, todayInParis, () => null);
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;

  return (
    <p className={cn("inline-flex items-center gap-3 rounded-full bg-blue-soft py-2 pl-2 pr-5 text-[0.95rem] text-blue-deep", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ivory">
        <Clock className="size-4" aria-hidden="true" />
      </span>
      {today ? (
        <span>
          <span className="font-semibold">{DAY_LABELS[today]}</span> : {formatSlots(week[today])}
          {!siteConfig.hours.confirmed && <span className="text-mute"> (indicatif)</span>}
        </span>
      ) : (
        <span>Horaires de la semaine sur la page « Nous trouver »</span>
      )}
    </p>
  );
}
