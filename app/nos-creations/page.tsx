import { FadeIn, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Catalogue } from "@/components/products/Catalogue";
import { Glow, Macaron } from "@/components/ui/Decor";
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
      <header className="relative isolate overflow-hidden">
        <Glow className="-z-10 opacity-60" />
        <div aria-hidden="true" className="pointer-events-none absolute left-[53%] top-[16%] hidden w-[clamp(70px,6.5vw,110px)] lg:block">
          <Macaron flavour="pistache" className="w-full animate-bob [--rot:12deg]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[12%] left-[60%] hidden w-[clamp(46px,4.2vw,72px)] lg:block">
          <Macaron flavour="framboise" className="w-full animate-bob [--bob-delay:-2s] [--rot:-10deg]" />
        </div>
        <div className="container-x pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Breadcrumbs items={[{ name: "Nos créations", path: "/nos-creations" }]} />
          <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
            <SplitReveal as="h1" onStage className="t-mega text-blue-deep lg:col-span-8">
              Nos <em className="text-blue">créations</em>
            </SplitReveal>
            <FadeIn onStage delay={0.3} className="lg:col-span-4 lg:pb-3">
              <p className="t-lead max-w-md text-ink/80">
                Ce que vous trouvez en boutique, photographié chez nous. L’assortiment évolue avec les jours et les
                saisons : n’hésitez pas à nous demander les créations du moment.
              </p>
            </FadeIn>
          </div>
        </div>
      </header>

      <Catalogue />
    </>
  );
}
