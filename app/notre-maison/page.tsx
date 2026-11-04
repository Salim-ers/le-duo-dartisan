import { FlourDust } from "@/components/animations/FlourDust";
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
      <header className="on-dark relative flex h-[calc(100svh-var(--header-h))] min-h-[520px] flex-col justify-end overflow-hidden bg-[#050505] text-ivory">
        <RevealImage kind="circle" parallax={4} className="absolute inset-0 bg-[#050505]">
          <Photo name="bolDeFarine" sizes="100vw" parallax preload />
        </RevealImage>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.1)_40%,rgb(5_5_5/0.88)_100%)]" />
        <FlourDust />
        <div className="container-x relative grid gap-6 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-span-8">
            <Breadcrumbs tone="light" items={[{ name: "Notre maison", path: "/notre-maison" }]} />
            <SplitReveal as="h1" onStage className="t-mega mt-6">
              Notre maison
            </SplitReveal>
          </div>
          <p className="t-lead text-ivory/85 lg:col-span-4">
            Une boulangerie-pâtisserie de quartier où l’on vient pour le pain du jour, et où l’on revient pour les
            gâteaux des grands jours.
          </p>
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
