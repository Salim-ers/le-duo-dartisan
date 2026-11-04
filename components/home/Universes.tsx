import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { TransitionLink } from "@/components/animations/PageTransition";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/data/images";
import { cn } from "@/lib/utils";

const universes: {
  n: string;
  title: string;
  text: string;
  image: ImageKey;
  href: string;
  kind: "up" | "left" | "circle" | "down";
  offset: string;
}[] = [
  {
    n: "01",
    title: "La boulangerie",
    text: "Baguettes, pains traditionnels et spécialités boulangères.",
    image: "baguettesCroisees",
    href: "/nos-creations?categorie=pains",
    kind: "up",
    offset: "lg:mt-0",
  },
  {
    n: "02",
    title: "Les pâtisseries",
    text: "Entremets, tartes, flans, créations fruitées et chocolat.",
    image: "entremetsFruits",
    href: "/nos-creations?categorie=patisseries",
    kind: "circle",
    offset: "lg:mt-28",
  },
  {
    n: "03",
    title: "Les viennoiseries",
    text: "Croissants, pains au chocolat et gourmandises du matin.",
    image: "painsChocolat",
    href: "/nos-creations?categorie=viennoiseries",
    kind: "left",
    offset: "lg:mt-10",
  },
  {
    n: "04",
    title: "La pause gourmande",
    text: "Sandwichs, salades et préparations salées.",
    image: "sandwichs",
    href: "/nos-creations?categorie=snacking",
    kind: "down",
    offset: "lg:mt-40",
  },
];

/** Section C — Nos univers : quatre colonnes décalées, quatre révélations distinctes. */
export function Universes() {
  return (
    <section aria-labelledby="univers-titre" className="bg-ivory py-24 lg:py-36">
      <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SplitReveal as="h2" className="t-h1 max-w-[14ch] text-blue-deep">
          <span id="univers-titre">Quatre univers, une même gourmandise.</span>
        </SplitReveal>
        <p className="max-w-sm text-ink/75">Du premier croissant au goûter, la vitrine se renouvelle au fil de la journée.</p>
      </div>

      <ul className="scroll-row mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 lg:mt-20 lg:grid lg:grid-cols-4 lg:gap-7 lg:overflow-visible lg:pb-0 container-x lg:px-[var(--gutter)]">
        {universes.map((u) => (
          <li key={u.n} className={cn("w-[76vw] max-w-[360px] shrink-0 snap-start lg:w-auto lg:max-w-none", u.offset)}>
            <TransitionLink href={u.href} className="group block" data-cursor="Voir">
              <RevealImage kind={u.kind} className="aspect-[3/4] bg-paper">
                <Photo
                  name={u.image}
                  sizes="(min-width: 1024px) 24vw, 76vw"
                  parallax
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                />
              </RevealImage>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="text-xs font-semibold tabular-nums text-champagne-deep">{u.n}</span>
                <div className="min-w-0">
                  <h3 className="t-h3 text-blue-deep transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-1.5">
                    {u.title}
                  </h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/70">{u.text}</p>
                  <span className="mt-3 block h-px w-0 bg-blue transition-[width] duration-700 ease-[var(--ease-luxe)] group-hover:w-16" aria-hidden="true" />
                </div>
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
