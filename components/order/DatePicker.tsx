"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { addDays, formatLongDate, isoToUtc, orderDateBounds, pickupDateStatus, utcToIso } from "@/lib/dates";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

function monthStart(iso: string) {
  return `${iso.slice(0, 7)}-01`;
}
function shiftMonth(iso: string, n: number) {
  const d = isoToUtc(iso);
  d.setUTCMonth(d.getUTCMonth() + n, 1);
  return utcToIso(d);
}

/**
 * Calendrier de retrait : jours de fermeture, délai minimum et fermetures
 * exceptionnelles désactivés. Navigation complète au clavier (flèches, Entrée).
 */
export function DatePicker({
  value,
  onChange,
  invalid,
  describedBy,
  labelId,
}: {
  value: string;
  onChange: (iso: string) => void;
  invalid?: boolean;
  describedBy?: string;
  labelId: string;
}) {
  const { min, max } = useMemo(() => orderDateBounds(), []);
  const [month, setMonth] = useState(() => monthStart(value || min));
  const [focusIso, setFocusIso] = useState(value || min);
  const [dir, setDir] = useState(1);
  const grid = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const first = isoToUtc(month);
    const offset = (first.getUTCDay() + 6) % 7; // lundi = 0
    const start = addDays(month, -offset);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [month]);

  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    isoToUtc(month),
  );
  const canPrev = month > monthStart(min);
  const canNext = month < monthStart(max);

  const go = (n: number) => {
    setDir(n);
    setMonth((m) => shiftMonth(m, n));
  };

  const moveFocus = (iso: string) => {
    if (iso < monthStart(min) || iso > max) return;
    setFocusIso(iso);
    if (monthStart(iso) !== month) {
      setDir(iso > month ? 1 : -1);
      setMonth(monthStart(iso));
    }
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)?.focus());
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      moveFocus(addDays(iso, map[e.key]));
    }
  };

  return (
    <div className={cn("border bg-ivory p-4 sm:p-6", invalid ? "border-[#b4432f]" : "border-line")}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!canPrev}
          className="grid size-11 place-items-center rounded-full text-blue-deep transition hover:bg-paper disabled:opacity-25"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="t-h3 text-[1.45rem] capitalize text-blue-deep" aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!canNext}
          className="grid size-11 place-items-center rounded-full text-blue-deep transition hover:bg-paper disabled:opacity-25"
          aria-label="Mois suivant"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-xs text-mute" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2">
            {d}
          </span>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={month}
            ref={grid}
            role="group"
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            className="grid grid-cols-7 gap-1"
            custom={dir}
            initial={{ x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {days.map((iso) => {
              const inMonth = iso.slice(0, 7) === month.slice(0, 7);
              const status = pickupDateStatus(iso);
              const disabled = status !== "ok";
              const selected = value === iso;
              const label = `${formatLongDate(iso)}${
                status === "closed" ? ", boutique fermée" : status === "too-soon" ? ", délai trop court" : status === "exceptional" ? ", fermeture exceptionnelle" : ""
              }`;
              if (!inMonth) return <span key={iso} aria-hidden="true" />;
              return (
                <button
                  key={iso}
                  type="button"
                  data-iso={iso}
                  tabIndex={iso === focusIso ? 0 : -1}
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-label={label}
                  onClick={() => {
                    setFocusIso(iso);
                    onChange(iso);
                  }}
                  onKeyDown={(e) => onKey(e, iso)}
                  onFocus={() => setFocusIso(iso)}
                  className={cn(
                    "relative grid aspect-square min-h-10 place-items-center rounded-full text-[0.95rem] tabular-nums transition-colors duration-300",
                    selected
                      ? "bg-blue-deep font-semibold text-ivory"
                      : disabled
                        ? "cursor-not-allowed text-ink/25 line-through decoration-ink/20"
                        : "text-blue-deep hover:bg-blue-soft",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="date-ring"
                      className="absolute -inset-1 rounded-full border border-champagne"
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {Number(iso.slice(8))}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 border-t border-line pt-4 t-small text-mute">
        {value ? (
          <>
            <span className="font-semibold text-blue-deep first-letter:uppercase">{formatLongDate(value)}</span>
            <br />
            Date souhaitée, confirmée ensuite par la boutique selon ses disponibilités.
          </>
        ) : (
          "Les jours barrés ne sont pas disponibles (fermeture ou délai trop court)."
        )}
      </p>
    </div>
  );
}
