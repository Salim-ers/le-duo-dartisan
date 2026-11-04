import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import type { ImageKey } from "@/data/images";

const universes: { title: string; text: string; image: ImageKey; href: string }[] = [
  {
    title: "Les pains",
    text: "Baguettes, pains traditionnels et spécialités boulangères.",
    image: "baguettesAlignees",
    href: "/nos-creations?categorie=pains",
  },
  {
    title: "Les viennoiseries",
    text: "Croissants, pains au chocolat et gourmandises du matin.",
    image: "painsChocolat",
    href: "/nos-creations?categorie=viennoiseries",
  },
  {
    title: "Les pâtisseries",
    text: "Entremets, tartes, flans, créations fruitées et chocolat.",
    image: "flansIndividuels",
    href: "/nos-creations?categorie=patisseries",
  },
  {
    title: "La pause gourmande",
    text: "Sandwichs, salades et préparations salées.",
    image: "sandwichs",
    href: "/nos-creations?categorie=snacking",
  },
];

/** Ce que l'on trouve en boutique : quatre entrées vers le catalogue. */
export function Universes() {
  return (
    <section aria-labelledby="creations-titre" className="bg-ivory py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="creations-titre" className="t-h1 text-blue-deep">
            Nos créations
          </h2>
          <Link href="/nos-creations" className="w-fit font-semibold text-blue-deep link-draw">
            Voir tout le catalogue
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-8">
          {universes.map((u) => (
            <li key={u.title}>
              <Link href={u.href} className="group block">
                <Reveal className="aspect-[4/5] bg-paper">
                  <Photo
                    name={u.image}
                    sizes="(min-width: 1024px) 24vw, 48vw"
                    imgClassName="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
                  />
                </Reveal>
                <h3 className="t-h3 mt-4 text-blue-deep">{u.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/70">{u.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
