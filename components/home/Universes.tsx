"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { SplitReveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const universes: {
  n: string;
  title: string;
  text: string;
  image: ImageKey;
  href: string;
  cta: string;
  tone: string;
  badge: string;
}[] = [
  {
    n: "01",
    title: "Les pains",
    text: "Baguettes, pains traditionnels et spécialités boulangères, du matin au soir.",
    image: "baguetteFondNoir",
    href: "/nos-creations?categorie=pains",
    cta: "Voir les pains",
    tone: "bg-blue-soft",
    badge: "bg-blue text-ivory",
  },
  {
    n: "02",
    title: "Les viennoiseries",
    text: "Croissants, pains au chocolat et toutes les gourmandises du petit-déjeuner.",
    image: "croissantsFondNoir",
    href: "/nos-creations?categorie=viennoiseries",
    cta: "Voir les viennoiseries",
    tone: "bg-citron-soft",
    badge: "bg-citron text-cacao",
  },
  {
    n: "03",
    title: "Les pâtisseries",
    text: "Entremets, tartelettes, flans, macarons : des créations fruitées et chocolatées.",
    image: "tarteletteFramboises",
    href: "/nos-creations?categorie=patisseries",
    cta: "Voir les pâtisseries",
    tone: "bg-rose",
    badge: "bg-framboise-deep text-ivory",
  },
  {
    n: "04",
    title: "La pause gourmande",
    text: "Sandwichs, salades composées et préparations salées pour le déjeuner.",
    image: "sandwichBaguette",
    href: "/nos-creations?categorie=snacking",
    cta: "Voir le snacking",
    tone: "bg-pistache-soft",
    badge: "bg-pistache text-blue-night",
  },
];

/** Décalage vertical entre deux cartes empilées. */
const STEP = 18;

/**
 * Nos univers : quatre grandes cartes arrondies qui s'empilent au défilement
 * (position: sticky, sans épinglage). La carte recouverte recule et s'assombrit.
 * Sur les écrans trop bas, les cartes se suivent simplement.
 */
export function Universes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and (min-height: 640px)`, () => {
        const items = q<HTMLElement>("[data-stack-item]");
        const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;
        items.forEach((item, i) => {
          const card = item.querySelector("[data-card]");
          const img = item.querySelector("[data-card-img]");
          gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
          const next = items[i + 1];
          if (!next) return;
          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: () => `top ${headerH() + 16 + (i + 1) * STEP}px`,
            scrub: true,
            invalidateOnRefresh: true,
          };
          gsap.fromTo(card, { scale: 1 }, { scale: 0.9 + i * 0.02, ease: "none", scrollTrigger });
          gsap.fromTo(item.querySelector("[data-dim]"), { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="nos-univers" aria-labelledby="univers-titre" className="relative scroll-mt-8 bg-cream pb-20 pt-16 lg:pb-32 lg:pt-24">
      <div className="container-x grid items-end gap-6 pb-10 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-7">
          <SplitReveal as="h2" id="univers-titre" className="t-h1 max-w-[15ch] text-blue-deep">
            De quoi passer nous voir à toute heure.
          </SplitReveal>
        </div>
        <p className="t-lead max-w-md text-ink/75 lg:col-span-4 lg:col-start-9 lg:pb-2">
          Du premier croissant au goûter, la vitrine se renouvelle au fil de la journée.
        </p>
      </div>

      <div className="container-x">
        {universes.map((u, i) => (
          <div
            key={u.n}
            data-stack-item
            className={cn("[@media(min-height:640px)]:sticky", i < universes.length - 1 && "pb-[7vh]")}
            style={{ top: `calc(var(--header-h) + 1rem + ${i * STEP}px)` }}
          >
            <article
              data-card
              className={cn(
                "group relative grid origin-top overflow-hidden rounded-[2rem] p-2.5 shadow-[0_-12px_40px_-24px_rgb(18_61_88/0.35)] will-change-transform sm:rounded-[2.5rem] sm:p-3 lg:grid-cols-[1fr_1.08fr] lg:p-4",
                u.tone,
              )}
            >
              <div className="order-2 flex flex-col justify-between gap-5 px-4 pb-4 pt-5 sm:p-8 lg:order-1 lg:gap-10 lg:p-12">
                <span className={cn("hidden size-14 place-items-center rounded-full font-display text-xl font-medium lg:grid", u.badge)}>
                  {u.n}
                </span>
                <div>
                  <h3 className="flex items-center gap-3 font-display text-[clamp(2rem,5vw,5rem)] font-[430] leading-[1] tracking-[-0.03em] text-blue-deep [font-variation-settings:'SOFT'_100]">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full font-sans text-xs font-bold lg:hidden", u.badge)}>{u.n}</span>
                    {u.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-ink/75 lg:t-lead lg:mt-5">{u.text}</p>
                  <TransitionLink
                    href={u.href}
                    className="mt-5 inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full bg-blue-deep py-2 pl-5 pr-2 text-[0.92rem] font-semibold text-ivory sm:pl-6 sm:text-base transition-colors duration-500 after:absolute after:inset-0 hover:bg-blue lg:mt-8"
                  >
                    {u.cta}
                    <span className="grid size-8 place-items-center rounded-full bg-ivory/15 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[-45deg]">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </TransitionLink>
                </div>
              </div>

              <div className="relative order-1 aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-blue-night sm:aspect-[16/9] sm:rounded-[2rem] lg:order-2 lg:aspect-auto lg:min-h-[min(62svh,640px)]">
                <div data-card-img className="absolute -inset-y-[8%] inset-x-0">
                  <Photo
                    name={u.image}
                    sizes="(min-width: 1024px) 50vw, calc(100vw - 3.25rem)"
                    imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                  />
                </div>
                <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1 text-[0.72rem] font-semibold text-blue-deep backdrop-blur-sm">
                  Photo d’illustration
                </span>
              </div>

              <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-blue-night/10 opacity-0" />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
