import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";

/** Accroche : le message à gauche, la vitrine à droite. Le texte reste lisible car il n'est jamais posé sur la photo. */
export function HomeHero() {
  return (
    <section aria-labelledby="accueil-titre" className="grid lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12">
      <div className="relative aspect-[4/3] bg-paper sm:aspect-[16/9] lg:order-2 lg:col-span-7 lg:aspect-auto">
        <Photo name="vitrinePatisseries" sizes="(min-width: 1024px) 60vw, 100vw" preload focus="42% 50%" />
      </div>

      <div className="flex flex-col justify-center px-[var(--gutter)] py-10 sm:py-14 lg:order-1 lg:col-span-5 lg:py-16 lg:pl-[max(var(--gutter),calc((100vw-1760px)/2+var(--gutter)))]">
        <p className="font-script text-[1.9rem] leading-none text-blue">Boulangerie et pâtisserie</p>
        <h1 id="accueil-titre" className="t-h1 mt-5 max-w-[15ch] text-balance text-blue-deep">
          Chaque création a le goût d’une passion.
        </h1>
        <p className="t-lead mt-6 max-w-md text-ink/80">
          Pains, viennoiseries et pâtisseries artisanales, au cœur de Rantigny.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/nos-creations">Découvrir nos créations</ButtonLink>
          <ButtonLink href="/gateaux-sur-mesure" variant="outline">
            Commander un gâteau
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
