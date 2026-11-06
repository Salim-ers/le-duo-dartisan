import { ExpandImage } from "@/components/animations/ExpandImage";
import { FadeIn, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MaisonChapters } from "@/components/maison/MaisonChapters";
import { ButtonLink } from "@/components/ui/Button";
import { Glow, RotatingBadge } from "@/components/ui/Decor";
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
      <header className="relative isolate overflow-hidden pb-16 lg:pb-24">
        <Glow className="-z-10 opacity-50" />
        <div className="container-x grid gap-8 pb-10 pt-8 lg:grid-cols-12 lg:items-end lg:pb-14 lg:pt-12">
          <div className="lg:col-span-8">
            <Breadcrumbs items={[{ name: "Notre maison", path: "/notre-maison" }]} />
            <SplitReveal as="h1" onStage className="t-mega mt-8 text-blue-deep">
              Notre <em className="text-blue">maison</em>
            </SplitReveal>
          </div>
          <FadeIn onStage delay={0.3} className="lg:col-span-4 lg:pb-3">
            <p className="t-lead text-ink/80">
              Une boulangerie-pâtisserie de quartier où l’on vient pour le pain du jour, et où l’on revient pour les
              gâteaux des grands jours.
            </p>
          </FadeIn>
        </div>
        {/* Largeur limitée au conteneur : la photo reste nette, même sur un très grand écran. */}
        <div className="container-x relative">
          <ExpandImage className="aspect-[4/3] bg-paper sm:aspect-[16/9]">
            <Photo name="vitrinePatisseries" sizes="(min-width: 1600px) 1500px, 94vw" preload />
          </ExpandImage>
          <div className="absolute -bottom-10 right-[calc(var(--gutter)+1.5rem)] hidden text-blue-deep sm:block lg:-bottom-14">
            <RotatingBadge text="La vitrine · Rue Anatole France · " className="size-28 bg-citron shadow-[var(--shadow-float)] lg:size-36">
              <span className="font-display text-2xl italic text-blue-deep">Duo</span>
            </RotatingBadge>
          </div>
        </div>
      </header>

      <MaisonChapters />

      <div className="px-2 pb-2 sm:px-3 lg:px-4">
        <section className="on-dark relative isolate overflow-hidden rounded-[2.5rem] bg-blue-deep py-20 text-ivory grain lg:rounded-[4rem] lg:py-28">
          <Glow variant="blue" className="-z-10 opacity-50" />
          <div className="container-x relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <SplitReveal as="h2" className="t-h1 max-w-[14ch]">
                Passez nous voir, la porte est ouverte.
              </SplitReveal>
              <FadeIn>
                <p className="t-lead mt-6 max-w-lg text-ivory/80">
                  Une façade bleue et une enseigne manuscrite, rue Anatole France : une boulangerie de quartier, pour les
                  habitants de Rantigny et des environs.
                </p>
              </FadeIn>
            </div>
            <ButtonLink href="/nous-trouver" variant="light" arrow>
              Nous trouver
            </ButtonLink>
          </div>
        </section>
      </div>
      <div className="h-16 lg:h-24" aria-hidden="true" />
    </>
  );
}
