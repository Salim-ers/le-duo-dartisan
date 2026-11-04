import { SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Catalogue } from "@/components/products/Catalogue";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nos créations : pains, viennoiseries et pâtisseries",
  description:
    "Baguettes, pains au chocolat, pâtisseries individuelles, macarons, cookies et snacking : découvrez les créations de la boulangerie Le Duo d’Artisans à Rantigny.",
  path: "/nos-creations",
});

export default function CreationsPage() {
  return (
    <>
      <header className="container-x pb-14 pt-10 lg:pb-20 lg:pt-16">
        <Breadcrumbs items={[{ name: "Nos créations", path: "/nos-creations" }]} />
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <SplitReveal as="h1" onStage className="t-mega text-blue-deep lg:col-span-8">
            Nos créations
          </SplitReveal>
          <p className="t-lead max-w-md text-ink/80 lg:col-span-4 lg:pb-4">
            Ce que vous trouvez en boutique, photographié chez nous. L’assortiment évolue avec les jours et les
            saisons : n’hésitez pas à nous demander les créations du moment.
          </p>
        </div>
      </header>

      <Catalogue />
    </>
  );
}
