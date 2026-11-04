import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MaisonChapters } from "@/components/maison/MaisonChapters";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Notre maison : une boulangerie-pâtisserie de quartier",
  description:
    "Découvrez Le Duo d’Artisans, boulangerie-pâtisserie artisanale rue Anatole France à Rantigny : le geste, la pâte, la cuisson et le soin du détail.",
  path: "/notre-maison",
});

export default function MaisonPage() {
  return (
    <>
      <header className="pb-16 lg:pb-24">
        <div className="container-x grid gap-8 pb-10 pt-10 lg:grid-cols-12 lg:items-end lg:pb-14 lg:pt-16">
          <div className="lg:col-span-8">
            <Breadcrumbs items={[{ name: "Notre maison", path: "/notre-maison" }]} />
            <SplitReveal as="h1" onStage className="t-mega mt-6 text-blue-deep">
              Notre maison
            </SplitReveal>
          </div>
          <p className="t-lead text-ink/80 lg:col-span-4 lg:pb-3">
            Une boulangerie-pâtisserie de quartier où l’on vient pour le pain du jour, et où l’on revient pour les
            gâteaux des grands jours.
          </p>
        </div>
        {/* Largeur limitée au conteneur : la photo reste nette, même sur un très grand écran. */}
        <div className="container-x">
          <RevealImage kind="circle" parallax={4} className="moulure aspect-[4/3] bg-paper sm:aspect-[16/9]">
            <Photo name="vitrinePatisseries" sizes="(min-width: 1760px) 1664px, 94vw" parallax preload />
          </RevealImage>
        </div>
      </header>

      <MaisonChapters />

      <section className="on-dark relative overflow-hidden bg-blue-deep py-24 text-ivory grain lg:py-32">
        <div className="container-x relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <SplitReveal as="h2" className="t-h1 max-w-[14ch]">
              Passez nous voir, la porte est ouverte.
            </SplitReveal>
            <p className="t-lead mt-6 max-w-lg text-ivory/80">
              Une façade bleue et une enseigne manuscrite, rue Anatole France : une boulangerie de quartier, pour les
              habitants de Rantigny et des environs.
            </p>
          </div>
          <ButtonLink href="/nous-trouver" variant="light">
            Nous trouver
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
