import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Catalogue } from "@/components/products/Catalogue";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { showcaseDetails } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Nos créations : pains, viennoiseries et pâtisseries",
  description:
    "Baguettes, pains au chocolat, pâtisseries individuelles, fraisier, number cakes, cookies et snacking : découvrez les créations de la boulangerie Le Duo d’Artisans à Rantigny.",
  path: "/nos-creations",
});

export default function CreationsPage() {
  return (
    <>
      <header className="container-x pb-14 pt-10 lg:pb-20 lg:pt-16">
        <Breadcrumbs items={[{ name: "Nos créations", path: "/nos-creations" }]} />
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <h1 className="t-mega text-blue-deep lg:col-span-8">Nos créations</h1>
          <p className="t-lead max-w-md text-ink/80 lg:col-span-4 lg:pb-4">
            Ce que vous trouvez en boutique, photographié chez nous. L’assortiment évolue avec les jours et les
            saisons : n’hésitez pas à nous demander les créations du moment.
          </p>
        </div>
      </header>

      <Reveal className="moulure mx-3 aspect-[16/10] bg-paper sm:aspect-[16/7] lg:mx-[var(--gutter)] lg:aspect-[16/6]">
        <Photo name="vitrineEclairs" sizes="100vw" preload focus="50% 55%" />
      </Reveal>

      <div className="mt-16 lg:mt-24">
        <Catalogue />
      </div>

      {siteConfig.catalogue.showShowcaseDetails && (
        <section aria-labelledby="vitrine-details" className="border-t border-line bg-ivory py-20 lg:py-28">
          <div className="container-x flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="vitrine-details" className="t-h2 text-blue-deep">
              Également en vitrine
            </h2>
            <p className="max-w-md text-ink/70">
              Aperçus pris dans nos vitrines. L’assortiment change selon les jours : demandez-nous les
              pâtisseries du moment.
            </p>
          </div>
          <ul className="scroll-row mt-10 flex snap-x gap-5 overflow-x-auto px-[var(--gutter)] pb-2">
            {showcaseDetails.map((d) => (
              <li key={d.name} className="w-[46vw] max-w-[220px] shrink-0 snap-start">
                <div className="relative aspect-[3/4] overflow-hidden bg-paper">
                  <Photo name={d.image} sizes="220px" />
                </div>
                <p className="t-caption mt-3 text-blue-deep">{d.name}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="on-dark relative overflow-hidden bg-blue-deep py-24 text-ivory grain lg:py-32">
        <div className="container-x relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <h2 className="t-h1 max-w-[16ch]">Une création à partager, rien que pour vous ?</h2>
          <ButtonLink href="/gateaux-sur-mesure" variant="light">
            Imaginer mon gâteau
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
