import { siteConfig, type DayKey, type OpeningSlot } from "./site.config";

export const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

/** "06:30" → "6h30", "19:00" → "19h" */
export function formatTime(t: string) {
  const [h, m] = t.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

export function formatSlots(slots: readonly OpeningSlot[]) {
  if (slots.length === 0) return "Fermé";
  return slots.map((s) => `${formatTime(s.open)} – ${formatTime(s.close)}`).join(" · ");
}

/** Lignes regroupées : jours consécutifs aux horaires identiques fusionnés. */
export function groupedHours() {
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;
  const rows: { days: DayKey[]; label: string; value: string }[] = [];
  for (const day of DAY_ORDER) {
    const value = formatSlots(week[day]);
    const last = rows[rows.length - 1];
    if (last && last.value === value) last.days.push(day);
    else rows.push({ days: [day], label: "", value });
  }
  for (const r of rows) {
    r.label =
      r.days.length === 1
        ? DAY_LABELS[r.days[0]]
        : `${DAY_LABELS[r.days[0]]} au ${DAY_LABELS[r.days[r.days.length - 1]].toLowerCase()}`;
  }
  return rows;
}

/** Jour de la semaine courant dans le fuseau de la boulangerie. */
export function todayInParis(): DayKey {
  const name = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: siteConfig.hours.timezone,
  })
    .format(new Date())
    .toLowerCase();
  return name as DayKey;
}

/** Date du jour (AAAA-MM-JJ) dans le fuseau de la boulangerie. */
export function todayIsoInParis() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: siteConfig.hours.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Liste des jours de fermeture hebdomadaire, en index JS (0 = dimanche). */
export function closedWeekdays(): number[] {
  const map: Record<DayKey, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;
  return DAY_ORDER.filter((d) => week[d].length === 0).map((d) => map[d]);
}

export function isExceptionallyClosed(iso: string) {
  return siteConfig.hours.closures.some((c) => iso >= c.from && iso <= c.to);
}

/** Format schema.org : ["Tu-Fr 06:30-19:30", …] */
export function schemaOpeningHours() {
  const abbr: Record<DayKey, string> = {
    monday: "Mo",
    tuesday: "Tu",
    wednesday: "We",
    thursday: "Th",
    friday: "Fr",
    saturday: "Sa",
    sunday: "Su",
  };
  const week = siteConfig.hours.week as Record<DayKey, readonly OpeningSlot[]>;
  return DAY_ORDER.flatMap((d) => week[d].map((s) => `${abbr[d]} ${s.open}-${s.close}`));
}
