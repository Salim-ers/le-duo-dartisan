import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MaisonGallery } from "@/components/maison/MaisonGallery";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { images, type ImageKey } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Notre maison : une boulangerie-pâtisserie de quartier",
  description:
    "Découvrez Le Duo d’Artisans, boulangerie-pâtisserie artisanale rue Anatole France à Rantigny : pains, viennoiseries, pâtisseries et créations sur mesure.",
  path: "/notre-maison",
});

/** Chapitres factuels : aucun récit inventé sur les artisans. */
const chapters: { title: string; text: string; images: [ImageKey, ImageKey?]; flip?: boolean }[] = [
  {
    title: "La passion du métier",
    text: "Derrière la vitrine, il y a des gestes : pétrir, façonner, cuire, garnir, dresser. Un travail de chaque jour, fait pour que le comptoir soit prêt quand vous poussez la porte.",
    images: ["patonsFarine", "flansIndividuels"],
  },
  {
    title: "La boulangerie artisanale",
    text: "La baguette reste le cœur de la maison. Croûte dorée, grignes ouvertes, mie alvéolée : le pain du quotidien, celui qui accompagne tous les repas.",
    images: ["baguettesCroisees"],
    flip: true,
  },
  {
    title: "La gourmandise du quotidien",
    text: "Une viennoiserie pour le matin, un cookie pour le goûter, un sandwich ou une salade pour la pause de midi : de quoi passer nous voir à toute heure.",
    images: ["croissants", "cookies"],
  },
  {
    title: "Les créations pâtissières",
    text: "Tartelettes, éclairs, flans, macarons, fruits en trompe-l’œil : la vitrine pâtissière se renouvelle, et les grandes occasions ont droit à leurs gâteaux sur mesure.",
    images: ["entremetsFruits", "macaronsFramboise"],
    flip: true,
  },
  {
    title: "Une adresse à Rantigny",
    text: "Une façade bleue, une enseigne manuscrite et une porte ouverte sur la rue Anatole France : une boulangerie de quartier, pour les habitants de Rantigny et des environs.",
    images: ["vitrineTartes"],
  },
];

export default function MaisonPage() {
  return (
    <>
      <header>
        <Reveal className="mx-3 h-[70svh] min-h-[420px] bg-blue-deep lg:mx-[var(--gutter)] lg:h-[86svh]">
          <Photo name="facade" sizes="100vw" preload />
        </Reveal>
        <div className="container-x grid gap-8 pb-20 pt-12 lg:grid-cols-12 lg:pb-28 lg:pt-16">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ name: "Notre maison", path: "/notre-maison" }]} />
            <h1 className="t-mega mt-6 text-blue-deep">Notre maison</h1>
          </div>
          <p className="t-lead self-end text-ink/80 lg:col-span-4 lg:col-start-9">
            Une boulangerie-pâtisserie de quartier où l’on vient pour le pain du jour, et où l’on revient pour les
            gâteaux des grands jours.
          </p>
        </div>
      </header>

      <div className="grid gap-28 pb-28 lg:gap-44 lg:pb-44">
        {chapters.map((c, i) => (
          <section key={c.title} aria-labelledby={`chapitre-${i}`} className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className={cn("relative lg:col-span-7", c.flip && "lg:order-2 lg:col-start-6")}>
              <Reveal
                className={cn("moulure bg-paper", c.images[1] ? "aspect-[4/5] w-[78%]" : "aspect-[4/3] w-full", c.flip && c.images[1] && "ml-auto")}
              >
                <Photo name={c.images[0]} sizes="(min-width: 1024px) 50vw, 90vw" />
              </Reveal>
              {images[c.images[0]].source === "stock" && (
                <p className={cn("t-small mt-2 text-mute", c.flip && "text-right")}>Photo d’illustration</p>
              )}
              {c.images[1] && (
                <Reveal className={cn("absolute bottom-[-8%] aspect-square w-[42%] border-[6px] border-cream bg-paper", c.flip ? "left-0" : "right-0")}>
                  <Photo name={c.images[1]} sizes="(min-width: 1024px) 22vw, 40vw" />
                </Reveal>
              )}
            </div>
            <div className={cn("lg:col-span-4", c.flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
              <h2 id={`chapitre-${i}`} className="t-h1 text-blue-deep">
                {c.title}
              </h2>
              <p className="t-lead mt-8 text-ink/80">{c.text}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="relative h-[40svh] min-h-[240px] bg-paper lg:h-[60svh]">
        <Photo name="episDeBle" sizes="100vw" />
      </div>

      <section aria-labelledby="galerie" className="bg-ivory py-24 lg:py-36">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-20">
            <h2 id="galerie" className="t-h1 text-blue-deep">
              La maison en images
            </h2>
            <p className="max-w-sm text-ink/70">L’extérieur, les vitrines, les pains, les pâtisseries et la fabrication, photographiés à la boutique.</p>
          </div>
          <MaisonGallery />
        </div>
      </section>

      <section className="on-dark relative overflow-hidden bg-blue-deep py-24 text-ivory grain lg:py-32">
        <div className="container-x relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <h2 className="t-h1 max-w-[14ch]">Passez nous voir, la porte est ouverte.</h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/nous-trouver" variant="light">
              Nous trouver
            </ButtonLink>
            <ButtonLink href="/nos-creations" variant="outline-light">
              Découvrir nos créations
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
