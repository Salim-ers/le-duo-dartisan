"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Uniquement des spécialités visibles sur les photographies de la boutique. */
const ROW_A = ["Baguettes", "Pains au chocolat", "Macarons", "Éclairs", "Flans pâtissiers", "Tartelettes"];
const ROW_B = ["Paris-Brest", "Cookies garnis", "Sandwichs", "Salades composées", "Number cakes", "Fraisiers"];

const PASTEL = ["bg-rose text-framboise-deep", "bg-pistache-soft text-pistache-deep", "bg-citron-soft text-cacao", "bg-blue-soft text-blue-deep"];
const DOTS = ["bg-framboise", "bg-citron", "bg-pistache", "bg-ivory"];

function Row({ items, variant, reverse }: { items: string[]; variant: "ribbon" | "pastel"; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn("animate-marquee flex w-max gap-3 pr-3", reverse && "[animation-direction:reverse]")}
      style={{ "--marquee-d": reverse ? "46s" : "38s" } as CSSProperties}
    >
      {loop.map((label, i) => (
        <span
          key={`${label}-${i}`}
          className={cn(
            "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-6 py-2.5 font-display text-[clamp(1.35rem,2.4vw,2.4rem)] font-[450] tracking-[-0.015em] [font-variation-settings:'SOFT'_100] lg:px-8 lg:py-3",
            variant === "ribbon" ? "bg-ivory/[0.1] text-ivory ring-1 ring-ivory/15" : PASTEL[(i % items.length) % PASTEL.length],
          )}
        >
          <span className={cn("size-3 rounded-full lg:size-3.5", variant === "ribbon" ? DOTS[(i % items.length) % DOTS.length] : "bg-current opacity-60")} />
          {label}
        </span>
      ))}
    </div>
  );
}

/**
 * Deux rubans de spécialités qui se croisent et défilent en sens inverse ;
 * ils s'inclinent légèrement avec la vitesse du défilement.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-skew]", root.current);
        const setters = rows.map((r) => gsap.quickTo(r, "skewX", { duration: 0.6, ease: "power3" }));
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const skew = gsap.utils.clamp(-7, 7, self.getVelocity() / -260);
            setters.forEach((set, i) => set(i % 2 ? -skew : skew));
          },
          onLeave: () => setters.forEach((set) => set(0)),
          onLeaveBack: () => setters.forEach((set) => set(0)),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="specialites" className="relative overflow-hidden bg-cream py-14 lg:py-24">
      <h2 id="specialites" className="sr-only">
        Nos spécialités
      </h2>
      <ul className="sr-only">
        {[...ROW_A, ...ROW_B].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="relative">
        <div className="relative z-10 -mx-[5vw] -rotate-[2.5deg] bg-blue py-3 shadow-[var(--shadow-float)] lg:py-4">
          <div data-skew className="flex">
            <Row items={ROW_A} variant="ribbon" />
          </div>
        </div>
        <div className="-mx-[5vw] mt-4 rotate-[1.5deg] lg:mt-6">
          <div data-skew className="flex">
            <Row items={ROW_B} variant="pastel" reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
