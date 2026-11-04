import { closedWeekdays, isExceptionallyClosed, todayIsoInParis } from "./hours";
import { siteConfig } from "./site.config";

/** Les dates sont manipulées en chaînes AAAA-MM-JJ, calculées en UTC pour éviter les décalages. */
export function isoToUtc(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function utcToIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  const d = isoToUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return utcToIso(d);
}

export function weekdayOf(iso: string) {
  return isoToUtc(iso).getUTCDay();
}

export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(isoToUtc(iso));
}

export function orderDateBounds() {
  const today = todayIsoInParis();
  return {
    min: addDays(today, siteConfig.order.minLeadDays),
    max: addDays(today, siteConfig.order.maxAdvanceDays),
  };
}

export type DateStatus = "ok" | "too-soon" | "too-far" | "closed" | "exceptional";

/** Une date « possible » n'est jamais une date confirmée : la boulangerie valide ensuite. */
export function pickupDateStatus(iso: string): DateStatus {
  const { min, max } = orderDateBounds();
  if (iso < min) return "too-soon";
  if (iso > max) return "too-far";
  if (closedWeekdays().includes(weekdayOf(iso))) return "closed";
  if (isExceptionallyClosed(iso)) return "exceptional";
  return "ok";
}
